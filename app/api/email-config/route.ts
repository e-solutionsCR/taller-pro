import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encrypt, decrypt, testEmailConnection } from '@/lib/email';

// GET - Get email configuration (without sensitive data)
export async function GET() {
    try {
        const config = await prisma.emailConfig.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!config) {
            return NextResponse.json({ exists: false }, { status: 200 });
        }

        // Don't send password to frontend
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { smtpPassword, ...safeConfig } = config;

        return NextResponse.json({ exists: true, config: safeConfig });
    } catch (error) {
        console.error('Error fetching email config:', error);
        return NextResponse.json({ error: 'Error fetching configuration' }, { status: 500 });
    }
}

// POST - Create or update email configuration
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { smtpHost, smtpPort, smtpUser, smtpPassword, fromEmail, fromName } = body;

        // Validation
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail || !fromName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Test connection before saving
        try {
            await testEmailConnection(smtpHost, parseInt(smtpPort), smtpUser, smtpPassword);
        } catch (error) {
            console.error('SMTP test failed:', error);
            return NextResponse.json({
                error: 'Failed to connect to SMTP server. Please check your credentials.'
            }, { status: 400 });
        }

        // Deactivate all existing configs
        await prisma.emailConfig.updateMany({
            where: { isActive: true },
            data: { isActive: false }
        });

        // Create new config with encrypted password
        const newConfig = await prisma.emailConfig.create({
            data: {
                smtpHost,
                smtpPort: parseInt(smtpPort),
                smtpUser,
                smtpPassword: encrypt(smtpPassword),
                fromEmail,
                fromName,
                isActive: true
            }
        });

        // Don't send password back
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { smtpPassword: _, ...safeConfig } = newConfig;

        return NextResponse.json({
            message: 'Email configuration saved successfully',
            config: safeConfig
        });
    } catch (error) {
        console.error('Error saving email config:', error);
        return NextResponse.json({ error: 'Error saving configuration' }, { status: 500 });
    }
}

// PUT - Test email configuration
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { testEmail } = body;

        if (!testEmail) {
            return NextResponse.json({ error: 'Test email is required' }, { status: 400 });
        }

        const config = await prisma.emailConfig.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!config) {
            return NextResponse.json({ error: 'No email configuration found' }, { status: 404 });
        }

        // Send test email
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter({
            host: config.smtpHost,
            port: config.smtpPort,
            secure: config.smtpPort === 465,
            auth: {
                user: config.smtpUser,
                pass: decrypt(config.smtpPassword)
            }
        });

        await transporter.sendMail({
            from: `"${config.fromName}" <${config.fromEmail}>`,
            to: testEmail,
            subject: 'Prueba de Configuración - TallerPro',
            html: `
                <h2>✅ Configuración de correo exitosa</h2>
                <p>Si recibiste este correo, significa que la configuración SMTP está funcionando correctamente.</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
            `
        });

        return NextResponse.json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json({
            error: 'Failed to send test email. Please check your configuration.'
        }, { status: 500 });
    }
}
