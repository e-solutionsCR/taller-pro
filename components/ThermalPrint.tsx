'use client';

import { Printer } from 'lucide-react';

interface ThermalPrintProps {
    ticket: {
        codigo: string;
        tipoDispositivo: string;
        marcaModelo: string | null;
        descripcion: string;
        diagnostico: string | null;
        costo: number | null;
        status: string;
        createdAt: string;
        client: {
            nombre: string;
            cedula: string;
            telefono: string | null;
        };
    };
    shopName?: string;
    shopPhone?: string;
    shopAddress?: string;
}

export default function ThermalPrint({ ticket, shopName = "TallerPro", shopPhone, shopAddress }: ThermalPrintProps) {

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Botón de Imprimir - Solo visible en pantalla */}
            <button
                onClick={handlePrint}
                className="print:hidden w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
            >
                <Printer size={20} />
                Imprimir Recibo Térmico
            </button>

            {/* Ticket Térmico - Solo visible al imprimir */}
            <div className="hidden print:block">
                <style jsx global>{`
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}</style>

                <div style={{
                    width: '80mm',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    padding: '5mm',
                    lineHeight: '1.4'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '10px', borderBottom: '2px dashed #000', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{shopName}</div>
                        {shopPhone && <div style={{ fontSize: '11px' }}>Tel: {shopPhone}</div>}
                        {shopAddress && <div style={{ fontSize: '10px' }}>{shopAddress}</div>}
                    </div>

                    {/* Ticket Info */}
                    <div style={{ marginBottom: '10px', borderBottom: '1px dashed #000', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center', marginBottom: '5px' }}>
                            ORDEN #{ticket.codigo}
                        </div>
                        <div style={{ fontSize: '10px' }}>
                            Fecha: {new Date(ticket.createdAt).toLocaleString('es-CR')}
                        </div>
                        <div style={{ fontSize: '10px' }}>
                            Estado: <strong>{ticket.status.replace('_', ' ')}</strong>
                        </div>
                    </div>

                    {/* Cliente */}
                    <div style={{ marginBottom: '10px', borderBottom: '1px dashed #000', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>CLIENTE</div>
                        <div style={{ fontSize: '10px' }}>Nombre: {ticket.client.nombre}</div>
                        <div style={{ fontSize: '10px' }}>Cédula: {ticket.client.cedula}</div>
                        {ticket.client.telefono && (
                            <div style={{ fontSize: '10px' }}>Tel: {ticket.client.telefono}</div>
                        )}
                    </div>

                    {/* Equipo */}
                    <div style={{ marginBottom: '10px', borderBottom: '1px dashed #000', paddingBottom: '10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>EQUIPO</div>
                        <div style={{ fontSize: '10px' }}>Tipo: {ticket.tipoDispositivo}</div>
                        {ticket.marcaModelo && (
                            <div style={{ fontSize: '10px' }}>Marca/Modelo: {ticket.marcaModelo}</div>
                        )}
                        <div style={{ fontSize: '10px', marginTop: '5px' }}>
                            <strong>Problema:</strong>
                        </div>
                        <div style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                            {ticket.descripcion}
                        </div>
                    </div>

                    {/* Diagnóstico */}
                    {ticket.diagnostico && (
                        <div style={{ marginBottom: '10px', borderBottom: '1px dashed #000', paddingBottom: '10px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>DIAGNÓSTICO</div>
                            <div style={{ fontSize: '10px', whiteSpace: 'pre-wrap' }}>
                                {ticket.diagnostico}
                            </div>
                        </div>
                    )}

                    {/* Costo */}
                    {ticket.costo && (
                        <div style={{ marginBottom: '10px', borderBottom: '2px dashed #000', paddingBottom: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold' }}>
                                <span>TOTAL:</span>
                                <span>₡{Number(ticket.costo).toLocaleString('es-CR')}</span>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '10px' }}>
                        <div style={{ marginBottom: '5px' }}>¡Gracias por su preferencia!</div>
                        <div style={{ fontSize: '9px', marginTop: '10px' }}>
                            Este documento es una orden de servicio
                        </div>
                        <div style={{ fontSize: '9px' }}>
                            Guarde este recibo para retirar su equipo
                        </div>
                    </div>

                    {/* Código de barras simulado */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '15px',
                        fontSize: '20px',
                        fontFamily: 'monospace',
                        letterSpacing: '2px'
                    }}>
                        {ticket.codigo}
                    </div>
                </div>
            </div>
        </>
    );
}
