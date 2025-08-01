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
    <div className="flex flex-col items-center p-4">
      {/* Todo el contenido del resumen está ahora dentro de este único contenedor */}
      <div id="pdf-render-container" className="w-full max-w-7xl p-4 md:p-8 bg-white rounded-xl shadow-lg">
        <style dangerouslySetInnerHTML={{
            __html: `
              @media print {
                .no-print {
                  display: none;
                }
              }
            `
          }}
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Resumen de Pedido</h2>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600 text-sm">
          <div><strong>Cliente:</strong> {order.client || 'N/A'}</div>
          <div className="text-right"><strong>Fecha:</strong> {new Date(order.date).toLocaleDateString()}</div>
          <div><strong>Vendedor:</strong> {order.seller || 'N/A'}</div>
          <div className="text-right"><strong>Hora:</strong> {new Date(order.date).toLocaleTimeString()}</div>
          <div><strong>Distribuidor:</strong> {order.distributor || 'N/A'}</div>
          <div className="text-right"><strong>ID Pedido:</strong> {order.id}</div>
        </div>
        <div className="border-t border-b border-gray-200 py-4 my-4 text-xs">
          <div className="grid grid-cols-5 gap-2 font-semibold text-gray-700 mb-2 text-xs">
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
        <div className="flex flex-col items-end mt-6 space-y-2">
          {order.discount > 0 && (
            <>
              <div className="flex justify-between w-full max-w-sm text-gray-600">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full max-w-sm text-red-500 font-semibold">
                <span>Descuento ({order.discount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between w-full max-w-sm text-gray-800">
            <span className="text-2xl font-bold">Total:</span>
            <span className="text-2xl font-bold">${order.grandTotal}</span>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-8">
          <p>Gracias por su compra.</p>
        </div>
      </div>

      <div className="w-full max-w-7xl mt-6 p-4 bg-white rounded-xl shadow-lg no-print">
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
