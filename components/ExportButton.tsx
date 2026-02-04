'use client';

import { Download, FileSpreadsheet } from 'lucide-react';

export default function ExportButton() {
    const handleExport = async () => {
        try {
            // Obtener todos los tickets
            const res = await fetch('/api/tickets?status=TODOS');
            const data = await res.json();

            if (!data.tickets) {
                alert('No hay datos para exportar');
                return;
            }

            // Convertir a CSV
            const tickets = data.tickets;
            const headers = [
                'Código',
                'Estado',
                'Cliente',
                'Cédula',
                'Teléfono',
                'Tipo Dispositivo',
                'Marca/Modelo',
                'N° Serie',
                'Descripción',
                'Diagnóstico',
                'Costo',
                'Fecha Creación',
                'Última Actualización'
            ];

            const csvContent = [
                headers.join(','),
                ...tickets.map((t: any) => [
                    t.codigo,
                    t.status.replace('_', ' '),
                    `"${t.client?.nombre || ''}"`,
                    t.client?.cedula || '',
                    t.client?.telefono || '',
                    `"${t.tipoDispositivo}"`,
                    `"${t.marcaModelo || ''}"`,
                    t.numeroSerie || '',
                    `"${t.descripcion.replace(/"/g, '""')}"`,
                    `"${(t.diagnostico || '').replace(/"/g, '""')}"`,
                    t.costo || '0',
                    new Date(t.createdAt).toLocaleDateString('es-CR'),
                    new Date(t.updatedAt).toLocaleDateString('es-CR')
                ].join(','))
            ].join('\n');

            // Crear archivo y descargar
            const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            const fecha = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `tickets_export_${fecha}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            alert(`${tickets.length} tickets exportados correctamente`);
        } catch (error) {
            console.error('Error:', error);
            alert('Error al exportar datos');
        }
    };

    return (
        <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm"
        >
            <FileSpreadsheet size={20} />
            Exportar a Excel
        </button>
    );
}
