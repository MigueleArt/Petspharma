import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Package, Users, Truck, Building, FilePlus, BarChart3, LogOut, Edit, Trash2, Plus, ShoppingCart, DollarSign, Printer, Share2, ArrowLeft, FileText, X, User as UserIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Component: Modal ---
const Modal = ({ children, onClose, title }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-200">
            <X size={24} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// --- Component: GenericManagement ---
const GenericManagement = ({ items, handlers, itemName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const openModal = (item = null) => {
    setCurrentItem(item || { name: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (currentItem.id) {
      handlers.handleUpdateItem(currentItem);
    } else {
      handlers.handleAddItem(currentItem);
    }
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de {itemName}s</h2>
        <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Agregar {itemName}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-600">{item.id}</td>
                <td className="p-3 font-medium text-gray-800">{item.name}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                  <button onClick={() => handlers.handleDeleteItem(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal} title={currentItem.id ? `Editar ${itemName}` : `Agregar ${itemName}`}>
          <form onSubmit={handleSave}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del {itemName}</label>
                <input type="text" name="name" value={currentItem.name} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-100 border rounded-lg" required />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button type="button" onClick={closeModal} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// --- Component: ProductManagement ---
const ProductManagement = ({ items, handlers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const openModal = (item = null) => {
    setCurrentItem(item || { name: '', price: '', code: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Create a new object with the price converted to a number
    const itemToSave = {
        ...currentItem,
        price: parseFloat(currentItem.price) || 0 // Ensure it's a number
    };

    if (itemToSave.id) {
      handlers.handleUpdateItem(itemToSave);
    } else {
      handlers.handleAddItem(itemToSave);
    }
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
        <button onClick={() => openModal()} className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
          <Plus size={20} className="mr-2" /> Agregar Producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Precio</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id || item.code} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-600">{item.code}</td>
                <td className="p-3 font-medium text-gray-800">{item.name}</td>
                <td className="p-3 text-gray-600">${parseFloat(item.price).toFixed(2)}</td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:text-blue-800"><Edit size={20} /></button>
                  <button onClick={() => handlers.handleDeleteItem(item.id)} className="p-2 text-red-600 hover:text-red-800"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal} title={currentItem.id ? 'Editar Producto' : 'Agregar Producto'}>
          <form onSubmit={handleSave}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Código</label>
                <input type="text" name="code" value={currentItem.code} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-100 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" value={currentItem.name} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-100 border rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input type="number" name="price" value={currentItem.price} onChange={handleChange} className="w-full p-2 mt-1 bg-gray-100 border rounded-lg" required step="0.01" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button type="button" onClick={closeModal} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
              <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

// --- Component: ReportsView ---
const ReportsView = ({ orders, onNavigate, onViewDetails }) => {
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
};

// --- Component: OrderSummary ---
const OrderSummary = ({ order, onNavigate, previousView }) => {
  const printRef = useRef();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePdf = async (action = 'download') => {
    if (!printRef.current) return;
    setIsGenerating(true);

    const canvas = await html2canvas(printRef.current, { scale: 2 });
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
    
    setIsGenerating(false);
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
    <>
      <div ref={printRef} className="p-4 md:p-8 bg-white rounded-xl shadow-lg print-area">
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

      <div className="mt-6 p-4 bg-white rounded-xl shadow-lg no-print">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => generatePdf('print')} disabled={isGenerating} className="flex items-center justify-center bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400">
            <Printer className="mr-2" /> {isGenerating ? 'Generando...' : 'Imprimir PDF'}
          </button>
          <button onClick={handleWhatsAppShare} disabled={isGenerating} className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition disabled:bg-green-300">
            <Share2 className="mr-2" /> {isGenerating ? 'Generando...' : 'Enviar por WhatsApp'}
          </button>
        </div>
        <div className="mt-4">
            <button onClick={returnInfo.action} className="w-full flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                {returnInfo.icon} {returnInfo.text}
            </button>
        </div>
      </div>
    </>
  );
};

// --- Component: OrderForm ---
const ProductRow = ({ item, index, onUpdate, onRemove, productList }) => {
  const handleProductSelect = (productName) => {
    const product = productList.find((p) => p.name === productName);
    let updatedItem;

    if (product) {
      const quantity = parseFloat(item.quantity) || 1;
      const price = product.price; // This will be a number now
      updatedItem = {
        ...item,
        productName: product.name,
        price: price.toFixed(2),
        total: (quantity * price).toFixed(2),
      };
    } else {
      updatedItem = { ...item, productName: "", price: "", total: "0.00" };
    }
    onUpdate(index, updatedItem);
  };

  const handleInputChange = (field, value) => {
    const newItem = { ...item, [field]: value };
    if (field === "quantity" || field === "price") {
      const quantity = parseFloat(newItem.quantity) || 0;
      const price = parseFloat(newItem.price) || 0;
      newItem.total = (quantity * price).toFixed(2);
    }
    onUpdate(index, newItem);
  };

  return (
    <div className="grid md:grid-cols-10 gap-2 p-2 bg-gray-50 rounded-lg mb-2 items-center">
      <select
        value={item.productName}
        onChange={(e) => handleProductSelect(e.target.value)}
        className="col-span-1 md:col-span-3 p-2 border rounded-md bg-white"
      >
        <option value="">Selecciona un producto</option>
        {productList.map((product) => (
          <option key={product.code || product.id} value={product.name}>
            {product.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Cant."
        value={item.quantity}
        onChange={(e) => handleInputChange("quantity", e.target.value)}
        className="col-span-1 md:col-span-1 p-2 border rounded-md"
      />
      <div className="col-span-1 md:col-span-2 flex items-center">
        <span className="text-gray-500 mr-1">$</span>
        <input
          type="number"
          placeholder="Precio"
          value={item.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="col-span-1 md:col-span-2 flex items-center justify-end font-medium text-gray-800">
        <span>${item.total || "0.00"}</span>
      </div>
      <div className="col-span-1 md:col-span-1 flex justify-end">
        <button onClick={() => onRemove(index)} className="p-2 text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

const OrderForm = ({ onSaveOrder, products, clients, sellers, distributors }) => {
  const [seller, setSeller] = useState("");
  const [client, setClient] = useState("");
  const [distributor, setDistributor] = useState("");
  const [items, setItems] = useState([{ productName: "", quantity: "1", price: "", total: "0.00" }]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleUpdateItem = (index, updatedItem) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { productName: "", quantity: "1", price: "", total: "0.00" }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateGrandTotal = () => {
    return items.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0).toFixed(2);
  };

  const handleSubmit = () => {
    if (!client || items.some((i) => !i.productName || !i.price || parseFloat(i.price) <= 0)) {
      setModalMessage("Por favor, completa el cliente y asegúrate de que todos los productos tengan nombre y precio válido.");
      setShowModal(true);
      return;
    }
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      seller,
      client,
      distributor,
      items,
      grandTotal: calculateGrandTotal(),
    };
    onSaveOrder(order);
  };

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg font-bold mb-4">Información Incompleta</h3>
            <p className="mb-4">{modalMessage}</p>
            <button onClick={() => setShowModal(false)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">
              Entendido
            </button>
          </div>
        </div>
      )}
      <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ShoppingCart className="mr-3 text-blue-500" /> Nuevo Pedido
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <UserIcon className="text-gray-500 mr-3" />
            <select value={seller} onChange={(e) => setSeller(e.target.value)} className="w-full bg-transparent focus:outline-none">
              <option value="">Selecciona Vendedor</option>
              {sellers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <UserIcon className="text-gray-500 mr-3" />
            <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full bg-transparent focus:outline-none" required>
              <option value="">Selecciona Cliente *</option>
              {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <Truck className="text-gray-500 mr-3" />
            <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className="w-full bg-transparent focus:outline-none">
              <option value="">Selecciona Distribuidor</option>
              {distributors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mb-4">
          {items.map((item, index) => (
            <ProductRow
              key={index}
              index={index}
              item={item}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
              productList={products}
            />
          ))}
        </div>

        <button onClick={handleAddItem} className="flex items-center text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg transition duration-200 mb-6">
          <Plus size={18} className="mr-2" /> Agregar Producto
        </button>

        <div className="flex justify-end items-center mb-6">
          <span className="text-xl font-bold text-gray-700">Total:</span>
          <span className="text-2xl font-bold text-gray-900 ml-4">${calculateGrandTotal()}</span>
        </div>

        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center text-lg shadow-md">
          <DollarSign className="mr-2" /> Generar Pedido
        </button>
      </div>
    </>
  );
};

// --- Component: AdminPanel ---
const AdminPanel = ({ onLogout, onNavigate, currentView }) => {
  const navItems = [
    { view: 'orderForm', label: 'Crear Pedido', icon: FilePlus },
    { view: 'reports', label: 'Reportes', icon: BarChart3 },
    { view: 'admin/products', label: 'Productos', icon: Package },
    { view: 'admin/clients', label: 'Clientes', icon: Users },
    { view: 'admin/sellers', label: 'Vendedores', icon: Users },
    { view: 'admin/distributors', label: 'Distribuidores', icon: Building },
  ];

  return (
    <header className="bg-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-center no-print">
      <div className="flex items-center mb-4 md:mb-0">
        <img
          src="https://petspharma.com.mx/wp-content/uploads/2024/06/LogoPets-1-1.png"
          alt="Logo"
          className="h-12 w-auto mr-4"
          onError={(e) => { e.currentTarget.src = "https://placehold.co/150x50?text=Logo"; }}
        />
        <h1 className="text-xl font-bold text-gray-700">Sistema de Pedidos</h1>
      </div>
      <nav className="flex flex-wrap items-center justify-center gap-2">
        {navItems.map(item => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <item.icon size={16} className="mr-2" />
              {item.label}
            </button>
          );
        })}
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200"
        >
          <LogOut size={16} className="mr-2" />
          Salir
        </button>
      </nav>
    </header>
  );
};

// --- Component: Login ---
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <img
            src="https://petspharma.com.mx/wp-content/uploads/2024/06/LogoPets-1-1.png"
            alt="Logo"
            className="w-40 mx-auto mb-4"
            onError={(e) => { e.currentTarget.src = "https://placehold.co/200x80?text=Logo"; }}
          />
          <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
          <p className="text-gray-500">Accede al sistema de pedidos</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-600 block">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <LogIn className="mr-2" size={20} />
            Acceder
          </button>
        </form>
      </div>
    </div>
  );
};


// --- Main App Component ---
const initialData = {
  products: [
    { id: 1, code: "PET001", name: "ACUACIDE BOTE 1 LT", price: 300.0 },
    { id: 2, code: "PET002", name: "AD3E 100 ML", price: 80.0 },
    { id: 3, code: "PET003", name: "ALBENDAZOL 10% 1 LT", price: 400.0 },
  ],
  clients: [{ id: 1, name: "Cliente Mostrador" }],
  sellers: [{ id: 1, name: "Vendedor Principal" }],
  distributors: [{ id: 1, name: "Pets Pharma" }],
  orders: [],
};

export default function App() {
  // --- STATE MANAGEMENT ---
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login"); // login, orderForm, summary, reports, admin
  const [previousView, setPreviousView] = useState("login");

  // Master data lists
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [orders, setOrders] = useState([]);

  const [currentOrder, setCurrentOrder] = useState(null);

  // --- LOCALSTORAGE PERSISTENCE ---
  useEffect(() => {
    const savedUser = localStorage.getItem("salesUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView("orderForm");
    }

    const loadData = (key, setter) => {
      try {
        const savedData = localStorage.getItem(key);
        if (savedData && JSON.parse(savedData).length > 0) {
          setter(JSON.parse(savedData));
        } else {
          setter(initialData[key] || []);
        }
      } catch (e) {
        console.error("Failed to parse JSON from localStorage for key:", key, e);
        setter(initialData[key] || []);
      }
    };

    loadData("products", setProducts);
    loadData("clients", setClients);
    loadData("sellers", setSellers);
    loadData("distributors", setDistributors);
    loadData("orders", setOrders);
  }, []);

  useEffect(() => {
    const saveData = (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
    };
    if (products.length > 0) saveData("products", products);
    if (clients.length > 0) saveData("clients", clients);
    if (sellers.length > 0) saveData("sellers", sellers);
    if (distributors.length > 0) saveData("distributors", distributors);
    if (orders.length > 0) saveData("orders", orders);
  }, [products, clients, sellers, distributors, orders]);

  // --- HANDLERS ---
  const handleLogin = (username, password) => {
    if (username === "admin" && password === "admin123") {
      const userData = { username: "admin", isAdmin: true };
      setUser(userData);
      localStorage.setItem("salesUser", JSON.stringify(userData));
      setView("orderForm");
    } else {
      alert("Credenciales incorrectas.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("salesUser");
    setView("login");
  };

  const handleNavigate = (newView) => {
    setPreviousView(view);
    setView(newView);
  };

  const handleSaveOrder = (order) => {
    setOrders((prev) => [...prev, order]);
    setCurrentOrder(order);
    handleNavigate("summary");
  };

  const handleViewDetails = (order) => {
    setCurrentOrder(order);
    handleNavigate("summary");
  };

  const createCrudHandlers = (setState, itemName) => ({
    handleAddItem: (item) => {
      setState((prev) => [...prev, { ...item, id: Date.now() }]);
    },
    handleUpdateItem: (updatedItem) => {
      setState((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    },
    handleDeleteItem: (id) => {
      if (window.confirm(`¿Estás seguro de que quieres eliminar este ${itemName}?`)) {
        setState((prev) => prev.filter((item) => item.id !== id));
      }
    },
  });

  const productHandlers = createCrudHandlers(setProducts, "producto");
  const clientHandlers = createCrudHandlers(setClients, "cliente");
  const sellerHandlers = createCrudHandlers(setSellers, "vendedor");
  const distributorHandlers = createCrudHandlers(setDistributors, "distribuidor");

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (view === "login") {
      return <Login onLogin={handleLogin} />;
    }

    switch (view) {
      case "orderForm":
        return (
          <OrderForm
            onSaveOrder={handleSaveOrder}
            products={products}
            clients={clients}
            sellers={sellers}
            distributors={distributors}
          />
        );
      case "summary":
        return (
          <OrderSummary
            order={currentOrder}
            onNavigate={handleNavigate}
            previousView={previousView}
          />
        );
      case "reports":
        return (
          <ReportsView
            orders={orders}
            onNavigate={handleNavigate}
            onViewDetails={handleViewDetails}
          />
        );
      case "admin/products":
        return <ProductManagement items={products} handlers={productHandlers} />;
      case "admin/clients":
        return <GenericManagement items={clients} handlers={clientHandlers} itemName="Cliente" />;
      case "admin/sellers":
        return <GenericManagement items={sellers} handlers={sellerHandlers} itemName="Vendedor" />;
      case "admin/distributors":
        return <GenericManagement items={distributors} handlers={distributorHandlers} itemName="Distribuidor" />;
      default:
        return <OrderForm onSaveOrder={handleSaveOrder} products={products} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body { 
          font-family: 'Inter', sans-serif;
          background-color: #f0f4f8;
        }
        .print-area-container { display: none; }
        @media print {
          body * { visibility: hidden; }
          .print-area-container, .print-area-container * { visibility: visible; }
          .print-area-container { display: block; position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none; }
        }
      `}</style>
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {view !== "login" && (
          <AdminPanel
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            currentView={view}
          />
        )}
        <div className={view !== "login" ? "mt-8" : ""}>
          {renderContent()}
        </div>
        {/* Hidden div for printing */}
        {currentOrder && <div className="print-area-container"><OrderSummary order={currentOrder} /></div>}
      </main>
    </>
  );
}
