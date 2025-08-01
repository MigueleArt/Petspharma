import React, { useState } from 'react';
import { BarChart3, ArrowLeft, FileText } from 'lucide-react';

export default function ReportsView({ orders, onNavigate, onViewDetails }) {
  const [filterDate, setFilterDate] = useState('');

  const filteredOrders = orders.filter(order => {
    if (!filterDate) return true;
    const orderDate = new Date(order.date).toISOString().split('T')[0];
    return orderDate === filterDate;
  });

  const totalSales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.grandTotal), 0);
  const totalOrders = filteredOrders.length;

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChart3 className="mr-3 text-purple-500" /> Reporte de Ventas
        </h2>
        <button onClick={() => onNavigate('orderForm')} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={18} className="mr-1" /> Volver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-green-800">Ventas Totales (Filtradas)</h3>
          <p className="text-3xl font-bold text-green-900">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-blue-800">Pedidos Totales (Filtrados)</h3>
          <p className="text-3xl font-bold text-blue-900">{totalOrders}</p>
        </div>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Filtrar por Día:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-4">Historial de Pedidos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Fecha</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Vendedor</th>
              <th className="p-3 text-right">Total</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice().reverse().map(order => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium text-gray-800">{order.client}</td>
                <td className="p-3 text-gray-600">{order.seller || 'N/A'}</td>
                <td className="p-3 text-right font-semibold text-gray-800">${order.grandTotal}</td>
                <td className="p-3 text-center">
                  <button onClick={() => onViewDetails(order)} className="p-2 text-indigo-600 hover:text-indigo-800" title="Ver Resumen">
                    <FileText size={20} />
                  </button>
                </td>
              </tr>
            ))}
             {filteredOrders.length === 0 && (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No se encontraron pedidos.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
