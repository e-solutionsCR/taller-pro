import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/tickets/[id] - Obtener ticket por ID
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const ticket = await prisma.ticket.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                client: true
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ ticket });
    } catch (error) {
        console.error('Error al obtener ticket:', error);
        return NextResponse.json({ error: 'Error al obtener ticket' }, { status: 500 });
    }
}

// PATCH /api/tickets/[id] - Actualizar ticket
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { diagnostico, costo, status } = body;

        const updateData: any = {};
        if (diagnostico !== undefined) updateData.diagnostico = diagnostico;
        if (costo !== undefined) updateData.costo = parseFloat(costo);
        if (status !== undefined) updateData.status = status;

        const ticket = await prisma.ticket.update({
            where: { id: parseInt(params.id) },
            data: updateData,
            include: {
                client: true
            }
        });

        return NextResponse.json({ ticket });
    } catch (error) {
        console.error('Error al actualizar ticket:', error);
        return NextResponse.json({ error: 'Error al actualizar ticket' }, { status: 500 });
    }
}
