import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET - Obtener todos los tipos de dispositivos
export async function GET() {
    try {
        const tipos = await prisma.tipoDispositivo.findMany({
            orderBy: { nombre: 'asc' }
        });
        return NextResponse.json({ tipos });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al obtener tipos' }, { status: 500 });
    }
}

// POST - Crear nuevo tipo
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nombre } = body;

        if (!nombre) {
            return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
        }

        const tipo = await prisma.tipoDispositivo.create({
            data: { nombre, activo: true }
        });

        return NextResponse.json({ tipo }, { status: 201 });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Este tipo ya existe' }, { status: 400 });
        }
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al crear tipo' }, { status: 500 });
    }
}
