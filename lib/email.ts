import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY || 'default-key-change-in-production-32ch';
const ALGORITHM = 'aes-256-cbc';

// Encrypt sensitive data
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt sensitive data
export function decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32)), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

// Get active email configuration
export async function getEmailConfig() {
    const config = await prisma.emailConfig.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });
    return config;
}

// Create nodemailer transporter
export async function createTransporter() {
    const config = await getEmailConfig();
    if (!config) {
        throw new Error('No email configuration found');
    }

    const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: {
            user: config.smtpUser,
            pass: decrypt(config.smtpPassword)
        }
    });

    return { transporter, config };
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, temporaryPassword: string) {
    const { transporter, config } = await createTransporter();

    const mailOptions = {
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: email,
        subject: 'Recuperación de Contraseña - TallerPro',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
                    .password-box { background-color: #fff; border: 2px solid #4F46E5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; color: #4F46E5; margin: 20px 0; border-radius: 5px; }
                    .warning { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Recuperación de Contraseña</h1>
                    </div>
                    <div class="content">
                        <p>Hola,</p>
                        <p>Recibimos una solicitud para restablecer tu contraseña en <strong>TallerPro</strong>.</p>
                        <p>Tu nueva contraseña temporal es:</p>
                        <div class="password-box">${temporaryPassword}</div>
                        <div class="warning">
                            ⚠️ <strong>Importante:</strong>
                            <ul>
                                <li>Esta contraseña es temporal y expirará en <strong>30 minutos</strong></li>
                                <li>Cámbiala inmediatamente después de iniciar sesión</li>
                                <li>Si no solicitaste este cambio, ignora este correo</li>
                            </ul>
                        </div>
                        <p><strong>Pasos a seguir:</strong></p>
                        <ol>
                            <li>Inicia sesión con la contraseña temporal</li>
                            <li>Ve a tu perfil</li>
                            <li>Cambia tu contraseña por una nueva y segura</li>
                        </ol>
                        <p>Saludos,<br>El equipo de TallerPro</p>
                    </div>
                    <div class="footer">
                        <p>Este es un correo automático, por favor no responder.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    await transporter.sendMail(mailOptions);
}

// Test email configuration
export async function testEmailConnection(smtpHost: string, smtpPort: number, smtpUser: string, smtpPassword: string) {
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPassword
        }
    });

    await transporter.verify();
    return true;
}
