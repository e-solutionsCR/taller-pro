import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Obtain the business configuration
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let config = await prisma.businessConfig.findFirst();

        if (!config) {
            // Create default config if it doesn't exist
            config = await prisma.businessConfig.create({
                data: {
                    nombre: 'TallerPro',
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching business config:', error);
        return NextResponse.json(
            { error: 'Error al obtener la configuración de la empresa' },
            { status: 500 }
        );
    }
}

// POST: Update the business configuration
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        // Find existing config or create new one
        const existingConfig = await prisma.businessConfig.findFirst();

        let config;

        if (existingConfig) {
            config = await prisma.businessConfig.update({
                where: { id: existingConfig.id },
                data: {
                    nombre: data.nombre,
                    lema: data.lema,
                    telefono: data.telefono,
                    email: data.email,
                    direccion: data.direccion,
                    sitioWeb: data.sitioWeb,
                    mensajeTicket: data.mensajeTicket,
                    logoUrl: data.logoUrl
                }
            });
        } else {
            config = await prisma.businessConfig.create({
                data: {
                    nombre: data.nombre || 'TallerPro',
                    lema: data.lema,
                    telefono: data.telefono,
                    email: data.email,
                    direccion: data.direccion,
                    sitioWeb: data.sitioWeb,
                    mensajeTicket: data.mensajeTicket,
                    logoUrl: data.logoUrl
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating business config:', error);
        return NextResponse.json(
            { error: 'Error al actualizar la configuración de la empresa' },
            { status: 500 }
        );
    }
}
