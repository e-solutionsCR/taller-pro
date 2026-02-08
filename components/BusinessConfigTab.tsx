'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, Phone, Mail, MapPin, Globe, Ticket } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BusinessConfig {
    id?: number;
    nombre: string;
    lema?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    sitioWeb?: string;
    mensajeTicket?: string;
    logoUrl?: string; // Por ahora usaremos solo URL, no upload
}

export default function BusinessConfigTab() {
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState<BusinessConfig>({
        nombre: 'TallerPro',
        lema: '',
        telefono: '',
        email: '',
        direccion: '',
        sitioWeb: '',
        mensajeTicket: '',
        logoUrl: ''
    });

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/business-config');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
            toast.error('Error al cargar datos de empresa');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/business-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                toast.success('Configuración actualizada correctamente');
                // Opcional: Recargar página para actualizar navbar/etc si es necesario
            } else {
                const error = await res.json();
                toast.error(error.error || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error guardando configuración:', error);
            toast.error('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Nombre y Lema */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Building2 size={20} />
                        Identidad
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio *</label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={config.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Taller Electrónico Juan"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lema / Slogan</label>
                        <input
                            type="text"
                            name="lema"
                            value={config.lema || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Ej: Expertos en tecnología"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo (Opcional)</label>
                        <input
                            type="text"
                            name="logoUrl"
                            value={config.logoUrl || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="https://imgur.com/..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Ingresa una URL pública válida de tu logo.</p>
                    </div>
                </div>

                {/* Contacto */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        <Phone size={20} />
                        Contacto
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="text"
                            name="telefono"
                            value={config.telefono || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="+506 8888-8888"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Público</label>
                        <input
                            type="email"
                            name="email"
                            value={config.email || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="contacto@tallerjuan.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="sitioWeb"
                                value={config.sitioWeb || ''}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="www.tallerjuan.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Ubicación y Ticket */}
                <div className="space-y-4 md:col-span-2">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                            <MapPin size={20} />
                            Dirección Física
                        </h3>
                        <textarea
                            name="direccion"
                            rows={2}
                            value={config.direccion || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Dirección completa del local..."
                        />
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-4">
                            <Ticket size={20} />
                            Configuración de Ticket / Recibo
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje al Pie del Ticket</label>
                            <textarea
                                name="mensajeTicket"
                                rows={3}
                                value={config.mensajeTicket || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ej: Gracias por su preferencia. Garantía de 30 días."
                            />
                            <p className="text-xs text-gray-500 mt-1">Aparecerá al final de cada impresión de recibo.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="pt-6 border-t flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2 shadow-lg disabled:opacity-70"
                >
                    <Save size={20} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
