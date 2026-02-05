'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { User, Phone, Mail, MapPin, Calendar } from 'lucide-react';

interface Client {
    id: number;
    cedula: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    createdAt: string;
    tickets: Array<{
        id: number;
        codigo: string;
        descripcion: string;
        tipoDispositivo: string;
        status: string;
        costo: number | null;
        createdAt: string;
    }>;
}

export default function ClientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id as string;

    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clientId) {
            fetchClient();
        }
    }, [clientId]);

    const fetchClient = async () => {
        try {
            const res = await fetch(`/api/clients/${clientId}`);
            const data = await res.json();
            if (data.client) {
                setClient(data.client);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!client) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-red-600">Cliente no encontrado</p>
                </div>
            </div>
        );
    }

    const totalGastado = client.tickets.reduce((sum, t) => sum + (t.costo ? Number(t.costo) : 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-800">Detalle del Cliente</h1>
                        <button
                            onClick={() => router.push('/clients')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            ← Volver
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Client Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                                    <User className="text-blue-600" size={48} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                                {client.nombre}
                            </h2>
                            <p className="text-center text-gray-600 mb-6">Cédula: {client.cedula}</p>

                            <div className="space-y-3">
                                {client.telefono && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Phone size={20} className="text-gray-400" />
                                        <span>{client.telefono}</span>
                                    </div>
                                )}
                                {client.email && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <Mail size={20} className="text-gray-400" />
                                        <span className="text-sm">{client.email}</span>
                                    </div>
                                )}
                                {client.direccion && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin size={20} className="text-gray-400" />
                                        <span className="text-sm">{client.direccion}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Calendar size={20} className="text-gray-400" />
                                    <span className="text-sm">
                                        Cliente desde {new Date(client.createdAt).toLocaleDateString('es-CR')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Tickets</p>
                                        <p className="text-2xl font-bold text-blue-600">{client.tickets.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Gastado</p>
                                        <p className="text-2xl font-bold text-green-600">₡{totalGastado.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tickets History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 border-b">
                                <h2 className="text-xl font-bold text-gray-800">Historial de Tickets</h2>
                            </div>

                            <div className="divide-y max-h-[600px] overflow-y-auto">
                                {client.tickets.length > 0 ? (
                                    client.tickets.map((ticket) => (
                                        <Link
                                            key={ticket.id}
                                            href={`/tickets/${ticket.id}`}
                                            className="block p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="font-bold text-gray-800">{ticket.codigo}</span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${ticket.status === 'REPARADO' ? 'bg-green-100 text-green-700' :
                                                                ticket.status === 'EN_REPARACION' ? 'bg-yellow-100 text-yellow-700' :
                                                                    ticket.status === 'ENTREGADO' ? 'bg-gray-100 text-gray-700' :
                                                                        'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{ticket.tipoDispositivo}</p>
                                                    <p className="text-sm text-gray-500">{ticket.descripcion}</p>
                                                </div>
                                                <div className="text-right">
                                                    {ticket.costo && (
                                                        <p className="font-bold text-green-600">₡{Number(ticket.costo).toLocaleString()}</p>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(ticket.createdAt).toLocaleDateString('es-CR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-10 text-center text-gray-500">
                                        Este cliente no tiene tickets registrados
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
