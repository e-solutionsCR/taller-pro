'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setMessage({ type: 'error', text: 'Por favor ingresa tu correo electrónico' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({
                    type: 'success',
                    text: 'Si el correo existe, recibirás un email con tu nueva contraseña temporal.'
                });
                setEmail('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al procesar la solicitud' });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: 'Error de conexión. Intenta más tarde.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <Mail className="text-blue-600" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">¿Olvidaste tu contraseña?</h1>
                        <p className="text-gray-600">
                            Ingresa tu correo electrónico y te enviaremos una contraseña temporal
                        </p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm">{message.text}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu-correo@ejemplo.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Mail size={20} />
                                    Enviar Nueva Contraseña
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to login */}
                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                        >
                            <ArrowLeft size={16} />
                            Volver al inicio de sesión
                        </Link>
                    </div>

                    {/* Info Box */}
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                            <strong>📧 Nota:</strong> La contraseña temporal expira en 30 minutos.
                            Cámbiala inmediatamente después de iniciar sesión.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-white text-sm">
                    © 2026 TallerPro - Sistema de Gestión de Reparaciones
                </p>
            </div>
        </div>
    );
}
