import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { clientId, tipoDispositivo, marcaModelo, numeroSerie, descripcion, password } = body;

        if (!clientId || !descripcion) {
            return NextResponse.json({ error: 'ID de cliente y descripción son requeridos' }, { status: 400 });
        }

        // Verificar que el cliente existe
        const client = await prisma.client.findUnique({
            where: { id: clientId }
        });

        if (!client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        // Generar código único para el ticket
        const ticketCount = await prisma.ticket.count();
        const codigo = `TKT-${String(ticketCount + 1).padStart(5, '0')}`;

        // Crear ticket asociado al cliente
        const ticket = await prisma.ticket.create({
            data: {
                clientId,
                codigo,
                tipoDispositivo: tipoDispositivo || 'Otro',
                marcaModelo: marcaModelo || '',
                numeroSerie: numeroSerie || '',
                descripcion,
                password: password || '',
                status: 'RECIBIDO'
            },
            include: {
                client: true
            }
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const tickets = await prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
            include: { client: true },
            take: 20
        });

        const stats = await prisma.ticket.groupBy({
            by: ['status'],
            _count: {
                status: true
            }
        });

        return NextResponse.json({ tickets, stats });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
