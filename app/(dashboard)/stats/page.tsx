'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Clock, CheckCircle, Calendar } from 'lucide-react';

interface Stats {
    totalTickets: number;
    ticketsCompletados: number;
    ticketsActivos: number;
    ingresoTotal: number;
    ingresoMesActual: number;
    promedioReparacion: number;
    ticketsPorMes: Array<{ mes: string; cantidad: number }>;
    serviciosMasComunes: Array<{ tipo: string; cantidad: number }>;
}

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/stats');
            const data = await res.json();
            if (data.stats) {
                setStats(data.stats);
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
                <p className="text-center text-gray-600">Cargando estadísticas...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <p className="text-center text-red-600">Error al cargar estadísticas</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Estadísticas</h1>
                    <p className="text-gray-600 mt-2">Análisis completo de tu taller</p>
                </div>

                {/* KPIs Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
                        <p className="text-3xl font-bold text-gray-800">{stats.totalTickets}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Completados</p>
                        <p className="text-3xl font-bold text-green-600">{stats.ticketsCompletados}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.totalTickets > 0
                                ? `${Math.round((stats.ticketsCompletados / stats.totalTickets) * 100)}% del total`
                                : '0%'}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="text-purple-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Ingreso Total</p>
                        <p className="text-3xl font-bold text-purple-600">
                            ₡{stats.ingresoTotal.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Promedio Reparación</p>
                        <p className="text-3xl font-bold text-yellow-600">
                            {stats.promedioReparacion.toFixed(1)} días
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tickets por Mes */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="text-blue-600" size={24} />
                            Tickets por Mes
                        </h3>
                        <div className="space-y-4">
                            {stats.ticketsPorMes.map((mes, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{mes.mes}</span>
                                        <span className="text-sm font-bold text-gray-800">{mes.cantidad}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${Math.max((mes.cantidad / Math.max(...stats.ticketsPorMes.map(m => m.cantidad))) * 100, 5)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Servicios Más Comunes */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-6">Dispositivos Más Reparados</h3>
                        <div className="space-y-4">
                            {stats.serviciosMasComunes.map((servicio, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{servicio.tipo}</span>
                                        <span className="text-sm font-bold text-gray-800">{servicio.cantidad}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full transition-all"
                                            style={{
                                                width: `${Math.max((servicio.cantidad / Math.max(...stats.serviciosMasComunes.map(s => s.cantidad))) * 100, 5)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ingreso Mensual */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h3 className="text-xl font-bold mb-4">Ingreso Mes Actual</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-bold text-green-600">
                            ₡{stats.ingresoMesActual.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                            ({stats.ticketsActivos} tickets activos)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
