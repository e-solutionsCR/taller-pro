'use client';

import { Bell, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    ticketId?: number;
    ticketCode?: string;
    timestamp: Date;
}

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [tickets, setTickets] = useState<any[]>([]);

    useEffect(() => {
        fetchTicketsAndGenerateNotifications();
        // Actualizar cada 30 segundos
        const interval = setInterval(fetchTicketsAndGenerateNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchTicketsAndGenerateNotifications = async () => {
        try {
            const res = await fetch('/api/tickets');
            const data = await res.json();
            if (data.tickets) {
                setTickets(data.tickets);
                generateNotifications(data.tickets);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const generateNotifications = (ticketList: any[]) => {
        const newNotifications: Notification[] = [];

        // Equipos listos para entrega
        const reparados = ticketList.filter(t => t.status === 'REPARADO');
        if (reparados.length > 0) {
            newNotifications.push({
                id: 'reparados',
                type: 'success',
                title: `${reparados.length} equipo${reparados.length > 1 ? 's' : ''} listo${reparados.length > 1 ? 's' : ''}`,
                message: 'Equipos reparados esperando entrega',
                timestamp: new Date()
            });
        }

        // Equipos en reparación
        const enReparacion = ticketList.filter(t => t.status === 'EN_REPARACION');
        if (enReparacion.length > 0) {
            newNotifications.push({
                id: 'en_reparacion',
                type: 'info',
                title: `${enReparacion.length} en reparación`,
                message: 'Equipos actualmente siendo reparados',
                timestamp: new Date()
            });
        }

        // Equipos recién recibidos (últimas 24 horas)
        const ahora = new Date();
        const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
        const recientes = ticketList.filter(t => {
            const creado = new Date(t.createdAt);
            return t.status === 'RECIBIDO' && creado > hace24h;
        });
        if (recientes.length > 0) {
            newNotifications.push({
                id: 'recientes',
                type: 'warning',
                title: `${recientes.length} nuevo${recientes.length > 1 ? 's' : ''}`,
                message: 'Equipos recibidos en las últimas 24 horas',
                timestamp: new Date()
            });
        }

        setNotifications(newNotifications);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'warning':
                return <AlertCircle className="text-yellow-600" size={20} />;
            case 'info':
                return <Clock className="text-blue-600" size={20} />;
            default:
                return <Bell className="text-gray-600" size={20} />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
                <Bell size={24} className="text-gray-700" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {isOpen && (
                <div className="absolute left-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-bold text-lg">Notificaciones</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 ${getBgColor(notif.type)} border-l-4`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {getIcon(notif.type)}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">{notif.title}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                                {notif.ticketId && (
                                                    <Link
                                                        href={`/tickets/${notif.ticketId}`}
                                                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                                                    >
                                                        Ver ticket {notif.ticketCode}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="mx-auto mb-2 text-gray-300" size={40} />
                                <p>No hay notificaciones</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t bg-gray-50 text-center">
                        <Link
                            href="/"
                            className="text-sm text-blue-600 hover:underline"
                            onClick={() => setIsOpen(false)}
                        >
                            Ver dashboard completo
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
