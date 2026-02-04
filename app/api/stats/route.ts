import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Total de tickets
        const totalTickets = await prisma.ticket.count();

        // Tickets completados (REPARADO + ENTREGADO)
        const ticketsCompletados = await prisma.ticket.count({
            where: {
                OR: [
                    { status: 'REPARADO' },
                    { status: 'ENTREGADO' }
                ]
            }
        });

        // Tickets activos (RECIBIDO + EN_REPARACION)
        const ticketsActivos = await prisma.ticket.count({
            where: {
                OR: [
                    { status: 'RECIBIDO' },
                    { status: 'EN_REPARACION' },
                    { status: 'REPARADO' }
                ]
            }
        });

        // Ingreso total
        const ticketsConCosto = await prisma.ticket.findMany({
            where: {
                costo: { not: null }
            },
            select: { costo: true }
        });
        const ingresoTotal = ticketsConCosto.reduce((sum, t) => sum + Number(t.costo || 0), 0);

        // Ingreso del mes actual
        const ahora = new Date();
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        const ticketsMesActual = await prisma.ticket.findMany({
            where: {
                createdAt: { gte: inicioMes },
                costo: { not: null }
            },
            select: { costo: true }
        });
        const ingresoMesActual = ticketsMesActual.reduce((sum, t) => sum + Number(t.costo || 0), 0);

        // Promedio de días de reparación
        const ticketsTerminados = await prisma.ticket.findMany({
            where: {
                status: { in: ['REPARADO', 'ENTREGADO'] }
            },
            select: {
                createdAt: true,
                updatedAt: true
            }
        });

        let promedioReparacion = 0;
        if (ticketsTerminados.length > 0) {
            const totalDias = ticketsTerminados.reduce((sum, t) => {
                const inicio = new Date(t.createdAt);
                const fin = new Date(t.updatedAt);
                const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
                return sum + dias;
            }, 0);
            promedioReparacion = totalDias / ticketsTerminados.length;
        }

        // Tickets por mes (últimos 6 meses)
        const hace6Meses = new Date();
        hace6Meses.setMonth(hace6Meses.getMonth() - 6);

        const ticketsPorMes: Array<{ mes: string; cantidad: number }> = [];
        for (let i = 5; i >= 0; i--) {
            const fecha = new Date();
            fecha.setMonth(fecha.getMonth() - i);
            const inicioMes = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
            const finMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

            const cantidad = await prisma.ticket.count({
                where: {
                    createdAt: {
                        gte: inicioMes,
                        lte: finMes
                    }
                }
            });

            const nombreMes = fecha.toLocaleDateString('es-CR', { month: 'short', year: 'numeric' });
            ticketsPorMes.push({ mes: nombreMes, cantidad });
        }

        // Servicios más comunes (top 5)
        const todosTickets = await prisma.ticket.findMany({
            select: { tipoDispositivo: true }
        });

        const conteoDispositivos: { [key: string]: number } = {};
        todosTickets.forEach(t => {
            const tipo = t.tipoDispositivo || 'Otro';
            conteoDispositivos[tipo] = (conteoDispositivos[tipo] || 0) + 1;
        });

        const serviciosMasComunes = Object.entries(conteoDispositivos)
            .map(([tipo, cantidad]) => ({ tipo, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        const stats = {
            totalTickets,
            ticketsCompletados,
            ticketsActivos,
            ingresoTotal,
            ingresoMesActual,
            promedioReparacion,
            ticketsPorMes,
            serviciosMasComunes
        };

        return NextResponse.json({ stats });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
    }
}
