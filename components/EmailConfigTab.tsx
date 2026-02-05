'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface EmailConfig {
    id: number;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    fromEmail: string;
    fromName: string;
    isActive: boolean;
}

export default function EmailConfigTab() {
    const [config, setConfig] = useState<EmailConfig | null>(null);
    const [exists, setExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState({
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: 'TallerPro'
    });

    const [testEmail, setTestEmail] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch('/api/email-config');
            const data = await res.json();
            if (data.exists && data.config) {
                setExists(true);
                setConfig(data.config);
                setFormData({
                    smtpHost: data.config.smtpHost,
                    smtpPort: String(data.config.smtpPort),
                    smtpUser: data.config.smtpUser,
                    smtpPassword: '',
                    fromEmail: data.config.fromEmail,
                    fromName: data.config.fromName
                });
            }
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.smtpHost || !formData.smtpPort || !formData.smtpUser || !formData.fromEmail || !formData.fromName) {
            setMessage({ type: 'error', text: 'Todos los campos son obligatorios' });
            return;
        }

        if (!formData.smtpPassword && !exists) {
            setMessage({ type: 'error', text: 'La contraseña es obligatoria para la primera configuración' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/email-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Configuración guardada y probada exitosamente' });
                setExists(true);
                setConfig(data.config);
                setFormData({ ...formData, smtpPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al guardar la configuración' });
            }
        } catch (error) {
            console.error('Error saving config:', error);
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        if (!testEmail) {
            setMessage({ type: 'error', text: 'Ingresa un correo para la prueba' });
            return;
        }

        if (!exists) {
            setMessage({ type: 'error', text: 'Primero debes guardar la configuración' });
            return;
        }

        setTesting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/email-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testEmail })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `✅ Correo de prueba enviado a ${testEmail}` });
                setTestEmail('');
            } else {
                setMessage({ type: 'error', text: data.error || 'Error al enviar correo de prueba' });
            }
        } catch (error) {
            console.error('Error testing email:', error);
            setMessage({ type: 'error', text: 'Error de conexión' });
        } finally {
            setTesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Mail className="text-blue-600" size={32} />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Configuración de Correo SMTP</h2>
                    <p className="text-sm text-gray-600">Configure el servidor de correo electrónico para recuperación de contraseñas</p>
                </div>
            </div>

            {/* Status Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Form */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Servidor SMTP</label>
                        <input
                            type="text"
                            value={formData.smtpHost}
                            onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                            placeholder="smtp.gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Gmail: smtp.gmail.com | Outlook: smtp-mail.outlook.com</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Puerto</label>
                        <input
                            type="number"
                            value={formData.smtpPort}
                            onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                            placeholder="587"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">TLS: 587 | SSL: 465</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario SMTP</label>
                        <input
                            type="text"
                            value={formData.smtpUser}
                            onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                            placeholder="tu-correo@gmail.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña {exists && '(dejar vacío para mantener)'}
                        </label>
                        <input
                            type="password"
                            value={formData.smtpPassword}
                            onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                            placeholder="••••••••••••"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Para Gmail usa una &quot;Contraseña de Aplicación&quot;</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Remitente</label>
                        <input
                            type="email"
                            value={formData.fromEmail}
                            onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                            placeholder="noreply@tallerpro.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Remitente</label>
                        <input
                            type="text"
                            value={formData.fromName}
                            onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                            placeholder="TallerPro"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Guardar Configuración
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Test Email Section */}
            {exists && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Send size={20} />
                        Enviar Correo de Prueba
                    </h3>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            onClick={handleTest}
                            disabled={testing}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {testing ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Enviar Prueba
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Gmail Instructions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-3">📖 Guía rápida para Gmail</h3>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                    <li>Ve a tu cuenta de Google → Seguridad</li>
                    <li>Activa la &quot;Verificación en 2 pasos&quot; (si no está activa)</li>
                    <li>Busca &quot;Contraseñas de aplicaciones&quot;</li>
                    <li>Genera una nueva contraseña para &quot;Correo&quot;</li>
                    <li>Copia la contraseña de 16 caracteres y pégala en el campo de arriba</li>
                </ol>
            </div>
        </div>
    );
}
