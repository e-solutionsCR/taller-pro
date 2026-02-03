"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/tickets');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const { tickets = [], stats = [] } = data || {};

  // Map stats to our display items
  const getCount = (status: string) => stats.find((s: any) => s.status === status)?._count?.status || 0;

  const displayStats = [
    { name: 'Equipos Recibidos', value: getCount('RECIBIDO'), icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'En Diagnóstico', value: getCount('DIAGNOSTICO'), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Listos para Entrega', value: getCount('LISTO'), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Urgentes / Atrasados', value: getCount('ESPERA'), icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">¡Hola de nuevo!</h2>
          <p className="text-muted-foreground mt-1">Este es el resumen de actividad de tu taller para hoy.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/tickets/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
            <ClipboardList size={18} />
            Nueva Orden
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((item) => (
          <div key={item.name} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
            <div className={`${item.bg} ${item.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              <item.icon size={24} />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{item.name}</p>
            <p className="text-2xl font-bold mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-card rounded-2xl border shadow-sm overflow-hidden text-card-foreground">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold text-lg">Tickets Recientes</h3>
            <Link href="/tickets" className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y">
            {tickets.length > 0 ? tickets.map((ticket: any) => (
              <div key={ticket.id} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground uppercase">
                    {ticket.tipoDispositivo.substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold">{ticket.marcaModelo || ticket.tipoDispositivo}</p>
                    <p className="text-xs text-muted-foreground">{ticket.client?.nombre} • {ticket.codigo || ticket.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${ticket.status === 'LISTO' ? 'bg-emerald-100 text-emerald-700' :
                      ticket.status === 'DIAGNOSTICO' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {ticket.status}
                  </span>
                  <p className="text-xs text-muted-foreground w-32 text-right">
                    {new Date(ticket.createdAt).toLocaleDateString('es-CR')}
                  </p>
                </div>
              </div>
            )) : (
              <div className="p-10 text-center text-muted-foreground">
                No hay tickets registrados aún.
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / Info */}
        <div className="space-y-6">
          <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <TrendingUp className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
            <h3 className="font-bold text-lg mb-2">Rendimiento</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">El sistema está listo para procesar tus órdenes de servicio.</p>
            <div className="bg-white/20 h-2 w-full rounded-full">
              <div className="bg-white h-2 w-full rounded-full" />
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border shadow-sm">
            <h3 className="font-bold text-lg mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-secondary transition-colors text-sm font-medium flex items-center justify-between">
                Búsqueda de Cliente
                <ArrowRight size={14} />
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-secondary transition-colors text-sm font-medium flex items-center justify-between">
                Reporte Mensual
                <ArrowRight size={14} />
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-secondary transition-colors text-sm font-medium flex items-center justify-between">
                Inventario de Partes
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
