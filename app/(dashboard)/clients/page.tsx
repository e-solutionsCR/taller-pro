'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Wrench } from 'lucide-react';

interface Client {
    id: number;
    cedula: string;
    nombre: string;
    telefono: string | null;
    email: string | null;
    direccion: string | null;
    createdAt: string;
    _count?: {
        tickets: number;
    };
}

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const res = await fetch('/api/clients/all');
            const data = await res.json();
            if (data.clients) {
                setClients(data.clients);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cedula.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <p className="text-center text-gray-600">Cargando clientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Clientes</h1>
                            <p className="text-gray-600 mt-1">Gestiona tu base de clientes</p>
                        </div>
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            ← Volver
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o cédula..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600">Total Clientes</p>
                        <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600">Resultados</p>
                        <p className="text-2xl font-bold text-green-600">{filteredClients.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-600">Total Tickets</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {clients.reduce((sum, c) => sum + (c._count?.tickets || 0), 0)}
                        </p>
                    </div>
                </div>

                {/* Clients List */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="divide-y">
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                                <div
                                    key={client.id}
                                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/clients/${client.id}`)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="text-blue-600" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-800">{client.nombre}</h3>
                                                    <p className="text-sm text-gray-600">Cédula: {client.cedula}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-sm">
                                                {client.telefono && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone size={16} />
                                                        <span>{client.telefono}</span>
                                                    </div>
                                                )}
                                                {client.email && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail size={16} />
                                                        <span>{client.email}</span>
                                                    </div>
                                                )}
                                                {client.direccion && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <MapPin size={16} />
                                                        <span>{client.direccion}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                                            <Wrench className="text-blue-600" size={20} />
                                            <span className="font-bold text-blue-600">
                                                {client._count?.tickets || 0} tickets
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-500">
                                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
