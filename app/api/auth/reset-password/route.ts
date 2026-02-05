import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

// Generate random password
function generateTemporaryPassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    const all = uppercase + lowercase + numbers + special;

    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < 12; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
}

// POST - Request password reset
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        // Always return success to prevent email enumeration
        if (!user || !user.activo) {
            return NextResponse.json({
                message: 'If the email exists, a password reset link has been sent.'
            });
        }

        // Check for recent reset requests (rate limiting - max 3 per hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentTokens = await prisma.passwordResetToken.count({
            where: {
                userId: user.id,
                createdAt: { gte: oneHourAgo }
            }
        });

        if (recentTokens >= 3) {
            return NextResponse.json({
                error: 'Too many reset attempts. Please try again later.'
            }, { status: 429 });
        }

        // Generate temporary password
        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        // Create reset token (expires in 30 minutes)
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
            }
        });

        // Update user password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        // Send email
        try {
            await sendPasswordResetEmail(user.email, temporaryPassword);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return NextResponse.json({
                error: 'Email service is not configured. Please contact the administrator.'
            }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Password reset email sent successfully. Please check your inbox.'
        });

    } catch (error) {
        console.error('Error in password reset:', error);
        return NextResponse.json({
            error: 'An error occurred. Please try again later.'
        }, { status: 500 });
    }
}
