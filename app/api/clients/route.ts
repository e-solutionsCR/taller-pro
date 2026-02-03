import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/clients?cedula=XXX - Buscar cliente por cédula
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const cedula = searchParams.get('cedula');

        if (!cedula) {
            return NextResponse.json({ error: 'Cédula es requerida' }, { status: 400 });
        }

        const client = await prisma.client.findUnique({
            where: { cedula },
            include: {
                tickets: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!client) {
            return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
        }

        return NextResponse.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}

// POST /api/clients - Crear o actualizar cliente
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cedula, nombre, email, telefono, direccion } = body;

        if (!cedula || !nombre) {
            return NextResponse.json({ error: 'Cédula y nombre son requeridos' }, { status: 400 });
        }

        const client = await prisma.client.upsert({
            where: { cedula },
            update: {
                nombre,
                email: email || null,
                telefono: telefono || null,
                direccion: direccion || null
            },
            create: {
                cedula,
                nombre,
                email: email || null,
                telefono: telefono || null,
                direccion: direccion || null
            },
        });

        return NextResponse.json(client, { status: 200 });
    } catch (error) {
        console.error('Error saving client:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
