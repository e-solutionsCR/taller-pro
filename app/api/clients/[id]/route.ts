import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/clients/[id] - Obtener cliente por ID con su historial de tickets
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const client = await prisma.client.findUnique({
            where: { id: parseInt(params.id) },
            include: {
                tickets: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        return NextResponse.json({ client });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        return NextResponse.json({ error: 'Error al obtener cliente' }, { status: 500 });
    }
}
