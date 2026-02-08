'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ThermalPrint from '@/components/ThermalPrint';

interface Client {
    cedula: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
}

interface Ticket {
    id: number;
    codigo: string;
    descripcion: string;
    tipoDispositivo: string;
    marcaModelo: string | null;
    numeroSerie: string | null;
    password: string | null;
    diagnostico: string | null;
    costo: number | null;
    status: string;
    createdAt: string;
    client: Client;
}

export default function TicketDetailPage() {
    const router = useRouter();
    const params = useParams();
    const ticketId = params.id as string;

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [diagnostico, setDiagnostico] = useState('');
    const [costo, setCosto] = useState('');
    const [status, setStatus] = useState('RECIBIDO');
    const [businessConfig, setBusinessConfig] = useState<any>(null);

    useEffect(() => {
        if (ticketId) {
            fetchTicket();
            fetchBusinessConfig();
        }
    }, [ticketId]);

    const fetchTicket = async () => {
        try {
            const res = await fetch(`/api/tickets/${ticketId}`);
            const data = await res.json();

            if (data.ticket) {
                setTicket(data.ticket);
                setDiagnostico(data.ticket.diagnostico || '');
                setCosto(data.ticket.costo?.toString() || '');
                setStatus(data.ticket.status);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinessConfig = async () => {
        try {
            const res = await fetch('/api/business-config');
            if (res.ok) {
                const data = await res.json();
                setBusinessConfig(data);
            }
        } catch (error) {
            console.error('Error fetching business config:', error);
        }
    };

    const handleUpdate = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/tickets/${ticketId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diagnostico,
                    costo: costo ? parseFloat(costo) : null,
                    status
                })
            });

            if (res.ok) {
                alert('Ticket actualizado correctamente');
                fetchTicket();
            } else {
                alert('Error al actualizar ticket');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar ticket');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <p className="text-center text-red-600">Ticket no encontrado</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-4 mx-auto block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Ticket #{ticket.codigo}
                        </h1>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            ← Volver
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Estado:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'RECIBIDO' ? 'bg-blue-100 text-blue-800' :
                            status === 'EN_REPARACION' ? 'bg-yellow-100 text-yellow-800' :
                                status === 'REPARADO' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                            }`}>
                            {status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del Cliente */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Cliente</h2>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Nombre:</span> {ticket.client.nombre}</p>
                            <p><span className="font-semibold">Cédula:</span> {ticket.client.cedula}</p>
                            {ticket.client.telefono && (
                                <p><span className="font-semibold">Teléfono:</span> {ticket.client.telefono}</p>
                            )}
                            {ticket.client.email && (
                                <p><span className="font-semibold">Email:</span> {ticket.client.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Información del Dispositivo */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Dispositivo</h2>
                        <div className="space-y-2">
                            <p><span className="font-semibold">Tipo:</span> {ticket.tipoDispositivo}</p>
                            {ticket.marcaModelo && (
                                <p><span className="font-semibold">Marca/Modelo:</span> {ticket.marcaModelo}</p>
                            )}
                            {ticket.numeroSerie && (
                                <p><span className="font-semibold">N° Serie:</span> {ticket.numeroSerie}</p>
                            )}
                            {ticket.password && (
                                <p><span className="font-semibold">Contraseña:</span> {ticket.password}</p>
                            )}
                            <p><span className="font-semibold">Descripción:</span> {ticket.descripcion}</p>
                        </div>
                    </div>
                </div>

                {/* Formulario de Actualización */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Actualizar Ticket</h2>

                    <div className="space-y-4">
                        {/* Estado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="RECIBIDO">RECIBIDO</option>
                                <option value="EN_REPARACION">EN REPARACIÓN</option>
                                <option value="REPARADO">REPARADO</option>
                                <option value="ENTREGADO">ENTREGADO</option>
                            </select>
                        </div>

                        {/* Diagnóstico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Diagnóstico del Técnico
                            </label>
                            <textarea
                                value={diagnostico}
                                onChange={(e) => setDiagnostico(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Descripción del problema encontrado..."
                            />
                        </div>

                        {/* Costo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Costo de Reparación (₡)
                            </label>
                            <input
                                type="number"
                                value={costo}
                                onChange={(e) => setCosto(e.target.value)}
                                step="0.01"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="0.00"
                            />
                        </div>

                        {/* Botón Guardar */}
                        <button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                        >
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>

                        {/* Botón Imprimir */}
                        <div className="mt-4">
                            <ThermalPrint
                                ticket={ticket}
                                shopName={businessConfig?.nombre}
                                shopPhone={businessConfig?.telefono}
                                shopAddress={businessConfig?.direccion}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
