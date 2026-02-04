import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Obtener todas las marcas
export async function GET() {
    try {
        const marcas = await prisma.marca.findMany({
            orderBy: { nombre: 'asc' }
        });
        return NextResponse.json({ marcas });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al obtener marcas' }, { status: 500 });
    }
}

// POST - Crear nueva marca
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre } = body;

        if (!nombre) {
            return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
        }

        const marca = await prisma.marca.create({
            data: { nombre, activo: true }
        });

        return NextResponse.json({ marca }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Esta marca ya existe' }, { status: 400 });
        }
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al crear marca' }, { status: 500 });
    }
}
