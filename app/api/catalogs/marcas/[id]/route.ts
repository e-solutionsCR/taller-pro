import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH - Actualizar marca
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { nombre, activo } = body;

        const updateData: any = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (activo !== undefined) updateData.activo = activo;

        const marca = await prisma.marca.update({
            where: { id: parseInt(params.id) },
            data: updateData
        });

        return NextResponse.json({ marca });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Este nombre ya existe' }, { status: 400 });
        }
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al actualizar marca' }, { status: 500 });
    }
}

// DELETE - Desactivar marca (soft delete)
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;

        const marca = await prisma.marca.update({
            where: { id: parseInt(params.id) },
            data: { activo: false }
        });

        return NextResponse.json({ marca });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al eliminar marca' }, { status: 500 });
    }
}
