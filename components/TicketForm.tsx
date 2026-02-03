"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Search, Loader2, Save, UserCheck, Lock } from "lucide-react";

type FormInputs = {
    cedula: string;
    nombre: string;
    telefono: string;
    email: string;
    direccion: string;
    tipoDispositivo: string;
    marcaModelo: string;
    numeroSerie: string;
    descripcion: string;
    password: string;
};

export default function TicketForm() {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<FormInputs>({
        defaultValues: {
            tipoDispositivo: "Laptop"
        }
    });
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [clientSaved, setClientSaved] = useState(false);
    const [clientId, setClientId] = useState<number | null>(null);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const handleCedulaSearch = async () => {
        const cedula = watch("cedula");
        if (!cedula) return;

        setLoadingSearch(true);
        setStatusMessage({ type: "info", text: "Buscando cliente..." });

        try {
            // 1. Buscar en base de datos local primero
            const localRes = await axios.get(`/api/clients?cedula=${cedula}`, { timeout: 5000 });

            if (localRes.data && localRes.data.id) {
                // Cliente existe en la base de datos
                setValue("nombre", localRes.data.nombre);
                setValue("telefono", localRes.data.telefono || "");
                setValue("email", localRes.data.email || "");
                setValue("direccion", localRes.data.direccion || "");
                setClientId(localRes.data.id);
                setClientSaved(true);
                setStatusMessage({
                    type: "success",
                    text: `✅ Cliente encontrado: ${localRes.data.nombre} (${localRes.data.tickets?.length || 0} tickets previos)`
                });
                return;
            }
        } catch (error: any) {
            console.log("Local search error:", error.message);

            // Si falla por timeout o error de red, asumimos que no hay conexión y permitimos ingreso manual
            // en lugar de bloquear al usuario.

            // Cliente no existe localmente, buscar en Hacienda
            if (error.response?.status === 404 || error.code === 'ECONNABORTED' || !error.response) {
                try {
                    const haciendaRes = await axios.get(`/api/hacienda?cedula=${cedula}`, { timeout: 3000 });
                    if (haciendaRes.data.nombre) {
                        setValue("nombre", haciendaRes.data.nombre);
                        setClientSaved(false);
                        setStatusMessage({ type: "info", text: "📋 Cliente nuevo (Hacienda) - Complete y guarde" });
                        return;
                    }
                } catch (haciendaError) {
                    // Si todo falla, permitir ingreso manual
                    setStatusMessage({ type: "warning", text: "⚠️ No encontrado / Error de red - Ingrese datos manualmente" });
                }
            } else {
                setStatusMessage({ type: "warning", text: "⚠️ Error de conexión - Ingrese datos manualmente" });
            }
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleSaveClient = async () => {
        const cedula = watch("cedula");
        const nombre = watch("nombre");
        const telefono = watch("telefono");
        const email = watch("email");
        const direccion = watch("direccion");

        if (!cedula || !nombre) {
            setStatusMessage({ type: "error", text: "❌ Cédula y nombre son obligatorios" });
            return;
        }

        try {
            setStatusMessage({ type: "info", text: "Guardando cliente..." });
            const res = await axios.post("/api/clients", { cedula, nombre, telefono, email, direccion });

            setClientId(res.data.id);
            setClientSaved(true);
            setStatusMessage({ type: "success", text: "✅ Cliente guardado exitosamente" });
        } catch (error) {
            setStatusMessage({ type: "error", text: "❌ Error al guardar cliente" });
        }
    };

    const onSubmit = async (data: FormInputs) => {
        if (!clientSaved || !clientId) {
            setStatusMessage({ type: "error", text: "❌ Debe guardar el cliente primero" });
            return;
        }

        try {
            const ticketData = {
                clientId,
                tipoDispositivo: data.tipoDispositivo,
                marcaModelo: data.marcaModelo,
                numeroSerie: data.numeroSerie,
                descripcion: data.descripcion,
                password: data.password
            };

            await axios.post("/api/tickets", ticketData);
            setStatusMessage({ type: "success", text: "🎉 ¡Orden de servicio creada exitosamente!" });

            // Reset form
            reset();
            setClientSaved(false);
            setClientId(null);
            setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
        } catch (e) {
            setStatusMessage({ type: "error", text: "❌ Error al crear la orden. Reintente." });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="glass card-shadow p-8 rounded-3xl border border-white/20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-lg">
                        <Save size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Registro de Ingreso</h2>
                        <p className="text-muted-foreground">Documenta los fallos y datos del equipo para iniciar la reparación.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-card-foreground">
                    {/* Alerta de Estado */}
                    {statusMessage.text && (
                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' :
                            statusMessage.type === 'error' ? 'bg-rose-100 text-rose-800' :
                                statusMessage.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {statusMessage.text}
                        </div>
                    )}

                    {/* Sección Cliente */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                            <h3 className="font-bold text-lg">Información del Cliente</h3>
                            {clientSaved && <UserCheck className="text-emerald-600 ml-auto" size={20} />}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Identificación (Cédula)</label>
                                <div className="flex gap-2">
                                    <input
                                        {...register("cedula", { required: "Requerido" })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleCedulaSearch();
                                            }
                                        }}
                                        disabled={clientSaved}
                                        className="flex-1 bg-muted/50 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-60"
                                        placeholder="Ej: 101110222"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCedulaSearch}
                                        disabled={loadingSearch || clientSaved}
                                        className="px-4 bg-secondary text-secondary-foreground rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                                    >
                                        {loadingSearch ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.cedula && <span className="text-rose-500 text-xs mt-1">{errors.cedula.message}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Nombre Completo</label>
                                <input
                                    {...register("nombre", { required: "Requerido" })}
                                    disabled={clientSaved}
                                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
                                    placeholder="Nombre del cliente"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">WhatsApp / Tel</label>
                                    <input
                                        {...register("telefono")}
                                        disabled={clientSaved}
                                        className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none disabled:opacity-60"
                                        placeholder="8888-8888"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email</label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        disabled={clientSaved}
                                        className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none disabled:opacity-60"
                                        placeholder="cliente@ejemplo.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Dirección (Opcional)</label>
                                <input
                                    {...register("direccion")}
                                    disabled={clientSaved}
                                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none disabled:opacity-60"
                                    placeholder="Dirección del cliente"
                                />
                            </div>

                            {!clientSaved && (
                                <button
                                    type="button"
                                    onClick={handleSaveClient}
                                    className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <UserCheck size={20} />
                                    GUARDAR CLIENTE
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sección Equipo - Deshabilitada hasta guardar cliente */}
                    <div className={`space-y-6 ${!clientSaved ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                            <h3 className="font-bold text-lg">Detalles del Equipo</h3>
                            {!clientSaved && <Lock className="text-muted-foreground ml-auto" size={18} />}
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Categoría</label>
                                    <select
                                        {...register("tipoDispositivo")}
                                        className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none"
                                    >
                                        <option value="Laptop">Laptop / Portátil</option>
                                        <option value="PC">PC Escritorio</option>
                                        <option value="Celular">Celular / Tablet</option>
                                        <option value="Consola">Consola</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Marca / Modelo</label>
                                    <input
                                        {...register("marcaModelo")}
                                        className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none"
                                        placeholder="Ej: Lenovo ThinkPad"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Número de Serie (S/N)</label>
                                <input
                                    {...register("numeroSerie")}
                                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none"
                                    placeholder="Indispensable para garantía"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Contraseña / PIN</label>
                                <input
                                    {...register("password")}
                                    className="w-full bg-muted/50 border rounded-xl px-4 py-2.5 outline-none"
                                    placeholder="Para desbloqueo y pruebas"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Problema */}
                    <div className={`space-y-4 pt-4 ${!clientSaved ? 'opacity-50 pointer-events-none' : ''}`}>
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                            <h3 className="font-bold text-lg">Diagnóstico Inicial y Reporte</h3>
                        </div>
                        <textarea
                            {...register("descripcion", { required: "Debe describir el fallo" })}
                            rows={4}
                            className="w-full bg-muted/50 border rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            placeholder="Describe detalladamente el problema y el estado físico en que se recibe el equipo..."
                        ></textarea>
                        {errors.descripcion && <span className="text-rose-500 text-xs">{errors.descripcion.message}</span>}
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                setClientSaved(false);
                                setClientId(null);
                                setStatusMessage({ type: "", text: "" });
                            }}
                            className="px-6 py-3 rounded-xl font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Limpiar Todo
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !clientSaved}
                            className="px-10 py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/30 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            CREAR ORDEN DE SERVICIO
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
