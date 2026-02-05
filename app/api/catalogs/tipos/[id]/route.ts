import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PATCH - Actualizar tipo
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { nombre, activo, precioRevision, precioReparacionMinima } = body;

        const updateData: any = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (activo !== undefined) updateData.activo = activo;
        if (precioRevision !== undefined) updateData.precioRevision = precioRevision;
        if (precioReparacionMinima !== undefined) updateData.precioReparacionMinima = precioReparacionMinima;

        const tipo = await prisma.tipoDispositivo.update({
            where: { id: parseInt(params.id) },
            data: updateData
        });

        return NextResponse.json({ tipo });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Este nombre ya existe' }, { status: 400 });
        }
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al actualizar tipo' }, { status: 500 });
    }
}

// DELETE - Desactivar tipo (soft delete)
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;

        const tipo = await prisma.tipoDispositivo.update({
            where: { id: parseInt(params.id) },
            data: { activo: false }
        });

        return NextResponse.json({ tipo });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error al eliminar tipo' }, { status: 500 });
    }
}
