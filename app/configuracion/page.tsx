'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Tipo {
    id: number;
    nombre: string;
    activo: boolean;
}

interface Marca {
    id: number;
    nombre: string;
    activo: boolean;
}

export default function ConfigPage() {
    const [activeTab, setActiveTab] = useState<'tipos' | 'marcas'>('tipos');
    const [tipos, setTipos] = useState<Tipo[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');
    const [newValue, setNewValue] = useState('');

    useEffect(() => {
        fetchTipos();
        fetchMarcas();
    }, []);

    const fetchTipos = async () => {
        const res = await fetch('/api/catalogs/tipos');
        const data = await res.json();
        if (data.tipos) setTipos(data.tipos);
    };

    const fetchMarcas = async () => {
        const res = await fetch('/api/catalogs/marcas');
        const data = await res.json();
        if (data.marcas) setMarcas(data.marcas);
    };

    const handleAddTipo = async () => {
        if (!newValue.trim()) return;
        const res = await fetch('/api/catalogs/tipos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newValue })
        });
        if (res.ok) {
            setNewValue('');
            fetchTipos();
        } else {
            const error = await res.json();
            alert(error.error || 'Error al crear');
        }
    };

    const handleAddMarca = async () => {
        if (!newValue.trim()) return;
        const res = await fetch('/api/catalogs/marcas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: newValue })
        });
        if (res.ok) {
            setNewValue('');
            fetchMarcas();
        } else {
            const error = await res.json();
            alert(error.error || 'Error al crear');
        }
    };

    const handleUpdateTipo = async (id: number) => {
        const res = await fetch(`/api/catalogs/tipos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: editValue })
        });
        if (res.ok) {
            setEditingId(null);
            fetchTipos();
        }
    };

    const handleUpdateMarca = async (id: number) => {
        const res = await fetch(`/api/catalogs/marcas/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: editValue })
        });
        if (res.ok) {
            setEditingId(null);
            fetchMarcas();
        }
    };

    const handleDeleteTipo = async (id: number) => {
        if (!confirm('¿Está seguro que desea desactivar este tipo?')) return;
        await fetch(`/api/catalogs/tipos/${id}`, { method: 'DELETE' });
        fetchTipos();
    };

    const handleDeleteMarca = async (id: number) => {
        if (!confirm('¿Está seguro que desea desactivar esta marca?')) return;
        await fetch(`/api/catalogs/marcas/${id}`, { method: 'DELETE' });
        fetchMarcas();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Configuración / Mantenimientos</h1>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab('tipos')}
                            className={`flex-1 px-6 py-4 font-semibold ${activeTab === 'tipos'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Tipos de Dispositivos
                        </button>
                        <button
                            onClick={() => setActiveTab('marcas')}
                            className={`flex-1 px-6 py-4 font-semibold ${activeTab === 'marcas'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            Marcas
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Add New */}
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            placeholder={`Nuevo ${activeTab === 'tipos' ? 'tipo' : 'marca'}...`}
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (activeTab === 'tipos' ? handleAddTipo() : handleAddMarca())}
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => activeTab === 'tipos' ? handleAddTipo() : handleAddMarca()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Agregar
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {activeTab === 'tipos' ? (
                            tipos.filter(t => t.activo).map(tipo => (
                                <div key={tipo.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    {editingId === tipo.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleUpdateTipo(tipo.id)}
                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-medium">{tipo.nombre}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(tipo.id);
                                                        setEditValue(tipo.nombre);
                                                    }}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTipo(tipo.id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            marcas.filter(m => m.activo).map(marca => (
                                <div key={marca.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                    {editingId === marca.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="flex-1 px-3 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleUpdateMarca(marca.id)}
                                                className="p-1 text-green-600 hover:bg-green-100 rounded"
                                            >
                                                <Check size={20} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-medium">{marca.nombre}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(marca.id);
                                                        setEditValue(marca.nombre);
                                                    }}
                                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMarca(marca.id)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
