// components/SummaryLayout.jsx
import React from 'react';

export default function SummaryLayout({ order }) {
  return (
    <div className="p-8 bg-white">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Resumen de Pedido</h2>
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
        <div><strong>Cliente:</strong> {order.client || 'N/A'}</div>
        <div className="text-right"><strong>Fecha:</strong> {new Date(order.date).toLocaleDateString()}</div>
        <div><strong>Vendedor:</strong> {order.seller || 'N/A'}</div>
        <div className="text-right"><strong>Hora:</strong> {new Date(order.date).toLocaleTimeString()}</div>
        <div><strong>Distribuidor:</strong> {order.distributor || 'N/A'}</div>
        <div className="text-right"><strong>ID Pedido:</strong> {order.id}</div>
      </div>
      <div className="border-t border-b border-gray-200 py-4 my-4">
        <div className="grid grid-cols-5 gap-2 font-semibold text-gray-700 mb-2">
          <div className="col-span-2">Producto</div>
          <div>Cant.</div>
          <div className="text-right">P. Unit.</div>
          <div className="text-right">Total</div>
        </div>
        {order.items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 py-1 text-gray-600">
            <div className="col-span-2">{item.productName}</div>
            <div>{item.quantity}</div>
            <div className="text-right">${parseFloat(item.price).toFixed(2)}</div>
            <div className="text-right">${item.total}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <div className="text-right">
          <div className="text-gray-600">Subtotal</div>
          <div className="text-2xl font-bold text-gray-800">${order.grandTotal}</div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-8">
        <p>Gracias por su compra.</p>
      </div>
    </div>
  );
}
