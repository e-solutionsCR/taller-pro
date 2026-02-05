'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Shield, Plus } from 'lucide-react';

interface UserData {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    activo: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 flex items-center justify-center">
                <div className="text-xl text-blue-600 font-semibold">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
                        <p className="text-gray-600">Gestión de acceso al sistema</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            ← Volver
                        </button>
                        <button
                            onClick={() => router.push('/users/new')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Nuevo Usuario
                        </button>
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
                        No hay usuarios registrados. Crea el primero.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(user => (
                            <div
                                key={user.id}
                                onClick={() => router.push(`/users/${user.id}`)}
                                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500 group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <User className="text-blue-600" size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.activo ? 'ACTIVO' : 'INACTIVO'}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-1">{user.nombre}</h3>
                                <p className="text-gray-500 text-sm mb-4 truncate" title={user.email}>{user.email}</p>

                                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    <Shield size={16} />
                                    <span className="font-semibold">{user.rol}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
