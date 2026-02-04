import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/clients/all - Obtener todos los clientes con conteo de tickets
export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { tickets: true }
                }
            }
        });

        return NextResponse.json({ clients });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
    }
}
