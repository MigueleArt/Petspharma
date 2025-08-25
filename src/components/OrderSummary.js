import React, { useState } from 'react';
import { Printer, Share2, Plus, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function OrderSummary({ order, onNavigate, previousView }) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Calcula el subtotal y el monto del descuento para mostrar en el resumen
  const calculateSubtotal = () => {
    return order.items.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
  };
  
  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * (order.discount || 0)) / 100;

  const generatePdf = async (action = 'download') => {
  const pdfContainer = document.getElementById('pdf-render-container');
  if (!pdfContainer) return;

  setIsGenerating(true);

  try {
    // Clonamos el contenedor
    const containerClone = pdfContainer.cloneNode(true);
    document.body.appendChild(containerClone);
    containerClone.style.display = 'block';
    containerClone.style.maxWidth = '800px'; // tamaño fijo
    containerClone.style.width = '800px';    // fuerza el ancho para que no cambie en móvil
    containerClone.style.fontSize = '12px';  // tamaño uniforme de letra

    // Usamos siempre la misma escala
    const canvas = await html2canvas(containerClone, {
      scale: 2, // igual en PC y móvil
      useCORS: true
    });

    document.body.removeChild(containerClone);

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

    if (action === 'print') {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    } else {
      pdf.save(`Pedido-${order.id}.pdf`);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    setIsGenerating(false);
  }
};


  const handleWhatsAppShare = async () => {
    await generatePdf('download');
    
    let message = `*Resumen de Pedido*\n\nEl PDF del pedido ha sido descargado. Por favor, adjúntalo a este chat.\n\n*Pedido ID:* ${order.id}\n*Cliente:* ${order.client}\n*Total:* $${order.grandTotal}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const returnInfo = previousView === 'reports'
    ? { text: 'Volver a Reportes', action: () => onNavigate('reports'), icon: <ArrowLeft className="mr-2" /> }
    : { text: 'Hacer Otro Pedido', action: () => onNavigate('orderForm'), icon: <Plus className="mr-2" /> };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100">

      {/* Contenedor principal para el contenido del resumen y PDF */}
      <div id="summary-content" className="w-full max-w-4xl p-6 md:p-8 bg-white rounded-xl shadow-lg">
        {/* Estilos específicos para la impresión */}
        <style>{`
          @media print {
            body { background-color: white; }
            .no-print { display: none; }
            #summary-content { 
              box-shadow: none; 
              margin: 0;
              max-width: 100%;
              border: 1px solid #eee;
            }
          }
        `}</style>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Resumen de Pedido</h2>
        
        {/* --- INFORMACIÓN GENERAL DEL PEDIDO ACTUALIZADA --- */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm text-gray-700">
          <div><strong>Cliente:</strong> {order.client || 'N/A'}</div>
          <div className="text-right"><strong>Fecha:</strong> {new Date(order.date).toLocaleDateString()}</div>
          <div><strong>Vendedor:</strong> {order.seller || 'N/A'}</div>
          <div className="text-right"><strong>ID Pedido:</strong> {order.id}</div>
          <div><strong>Distribuidor:</strong> {order.distributor || 'N/A'}</div>
          <div className="text-right"><strong>Rep. Distribuidor:</strong> {order.distributorRepName || 'N/A'}</div>
        </div>

        {/* --- TABLA DE ITEMS MEJORADA --- */}
        <div className="border-t border-b border-gray-200 py-4 my-4">
          {/* Nuevos encabezados de la tabla */}
          <div className="grid grid-cols-12 gap-2 font-semibold text-gray-800 mb-3 px-2 text-xs uppercase">
            <div className="col-span-4">Producto</div>
            <div className="col-span-1 text-center">Cant.</div>
            <div className="col-span-1 text-center">Bonif.</div>
            <div className="col-span-2 text-center">Desc. %</div>
            <div className="col-span-2 text-right">P. Unit.</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>
          {/* Contenido de la tabla */}
          {order.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 py-2 px-2 text-sm text-gray-600 border-b last:border-b-0">
              <div className="col-span-4 font-medium">{item.productName}</div>
              <div className="col-span-1 text-center">{item.quantity}</div>
              {/* NUEVA COLUMNA */}
              <div className="col-span-1 text-center">{item.bonus || 0}</div>
              {/* NUEVA COLUMNA */}
              <div className="col-span-2 text-center">{item.discount || 0}%</div>
              <div className="col-span-2 text-right">${parseFloat(item.price).toFixed(2)}</div>
              {/* DATO CORREGIDO */}
              <div className="col-span-2 text-right font-semibold">${parseFloat(item.subtotal).toFixed(2)}</div>
            </div>
          ))}
        </div>
        
        {/* --- SECCIÓN DE TOTALES CONSISTENTE --- */}
        <div className="flex flex-col items-end mt-6 space-y-2">
          <div className="w-full max-w-sm">
            {/*<div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>*/}
            {/* Se muestra solo si hay un descuento general */}
            {order.overallDiscount > 0 && (
              <div className="flex justify-between text-red-500 font-semibold">
                <span>Descuento ({order.overallDiscount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between text-gray-800">
              <span className="text-2xl font-bold">Total:</span>
              <span className="text-2xl font-bold">${order.grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-8">
          <p>Gracias por su compra.</p>
        </div>
      </div>

      <div className="w-full max-w-4xl mt-6 p-4 bg-white rounded-xl shadow-lg no-print">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => generatePdf('print')} disabled={isGenerating} className="flex items-center justify-center bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400">
            <Printer className="mr-2" /> {isGenerating ? 'Generando...' : 'Imprimir PDF'}
          </button>
          <button onClick={() => handleWhatsAppShare()} disabled={isGenerating} className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition disabled:bg-green-300">
            <Share2 className="mr-2" /> {isGenerating ? 'Generando...' : 'Enviar por WhatsApp'}
          </button>
        </div>
        <div className="mt-4">
          <button onClick={returnInfo.action} className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
            {returnInfo.icon} {returnInfo.text}
          </button>
        </div>
      </div>
    </div>
  );
}
