'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, Trash2, X, User as UserIcon } from 'lucide-react';

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        rol: 'USER',
        activo: true
    });

    useEffect(() => {
        if (id) fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/users/${id}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setFormData({
                nombre: data.nombre,
                email: data.email,
                password: '', // Don't show password
                rol: data.rol,
                activo: data.activo
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error al actualizar');
            }

            router.push('/users');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');

            router.push('/users');
            router.refresh();
        } catch (err: any) {
            alert(err.message);
            setDeleting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserIcon size={24} className="text-blue-600" />
                        Editar Usuario
                    </h1>
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva Contraseña
                            <span className="text-gray-400 font-normal ml-2">(Opcional)</span>
                        </label>
                        <input
                            type="password"
                            minLength={6}
                            placeholder="Dejar en blanco para no cambiar"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={formData.rol}
                            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                        >
                            <option value="USER">Usuario (Técnico/Vendedor)</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="activo"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            checked={formData.activo}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                        />
                        <label htmlFor="activo" className="text-sm font-medium text-gray-700 select-none">
                            Usuario Activo (Puede iniciar sesión)
                        </label>
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={20} />
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? 'Guardando...' : (
                                <>
                                    <Save size={20} />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
