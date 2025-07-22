import React, { useState, useEffect, useRef } from 'react';
import { Printer, ShoppingCart, BarChart2, User, Truck, DollarSign, Plus, Trash2, Share2, ArrowLeft, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Product List ---
// Extracted from the provided spreadsheet.
const productList = [
  { "code": "PET001", "name": "ACUACIDE BOTE 1 LT", "price": 300.00 },
  { "code": "PET002", "name": "AD3E 100 ML", "price": 80.00 },
  { "code": "PET003", "name": "ALBENDAZOL 10% 1 LT", "price": 400.00 },
  { "code": "PET004", "name": "ALBENDAZOL 10% 250 ML", "price": 120.00 },
  { "code": "PET005", "name": "AMOXILAND 100 ML", "price": 110.00 },
  { "code": "PET006", "name": "AMOXILAND 250 ML", "price": 240.00 },
  { "code": "PET007", "name": "CALCIO PLUS 100 ML", "price": 65.00 },
  { "code": "PET008", "name": "CALCIO PLUS 250 ML", "price": 120.00 },
  { "code": "PET009", "name": "CALCIO PLUS 500 ML", "price": 180.00 },
  { "code": "PET010", "name": "CEFTIOFUR 100 ML", "price": 380.00 },
  { "code": "PET011", "name": "CEFTIOFUR 250 ML", "price": 850.00 },
  { "code": "PET012", "name": "CIPROFLOXACINO 1 LT", "price": 650.00 },
  { "code": "PET013", "name": "CIPROFLOXACINO 5 LTS", "price": 3000.00 },
  { "code": "PET014", "name": "CLOSANTEL 100 ML", "price": 150.00 },
  { "code": "PET015", "name": "CLOSANTEL 250 ML", "price": 340.00 },
  { "code": "PET016", "name": "COMPLEJO B 100 ML", "price": 60.00 },
  { "code": "PET017", "name": "COMPLEJO B 500 ML", "price": 250.00 },
  { "code": "PET018", "name": "DEXAFLAM 50 ML", "price": 100.00 },
  { "code": "PET019", "name": "DICLOFENACO 100 ML", "price": 100.00 },
  { "code": "PET020", "name": "ENROFLOXACINA 10% 100 ML", "price": 120.00 },
  { "code": "PET021", "name": "ENROFLOXACINA 10% 250 ML", "price": 280.00 },
  { "code": "PET022", "name": "ENROFLOXACINA 10% 20 ML", "price": 40.00 },
  { "code": "PET023", "name": "ENROFLOXACINA 5% 20 ML", "price": 35.00 },
  { "code": "PET024", "name": "FLORFENICOL 100 ML", "price": 200.00 },
  { "code": "PET025", "name": "FLORFENICOL 250 ML", "price": 450.00 },
  { "code": "PET026", "name": "FLUNIXIN 100 ML", "price": 280.00 },
  { "code": "PET027", "name": "FLUNIXIN 20 ML", "price": 80.00 },
  { "code": "PET028", "name": "HIERRO 10% 100 ML", "price": 100.00 },
  { "code": "PET029", "name": "HIERRO 20% 100 ML", "price": 120.00 },
  { "code": "PET030", "name": "IVERMECTINA 1% 100 ML", "price": 100.00 },
  { "code": "PET031", "name": "IVERMECTINA 1% 500 ML", "price": 450.00 },
  { "code": "PET032", "name": "IVERMECTINA 3.15% 100 ML", "price": 200.00 },
  { "code": "PET033", "name": "IVERMECTINA 3.15% 500 ML", "price": 850.00 },
  { "code": "PET034", "name": "KETOPROFENO 100 ML", "price": 180.00 },
  { "code": "PET035", "name": "MODIFICADOR 100 ML", "price": 120.00 },
  { "code": "PET036", "name": "MODIFICADOR 500 ML", "price": 550.00 },
  { "code": "PET037", "name": "OXITETRACICLINA 100 ML", "price": 80.00 },
  { "code": "PET038", "name": "OXITETRACICLINA 250 ML", "price": 180.00 },
  { "code": "PET039", "name": "OXITETRACICLINA 500 ML", "price": 320.00 },
  { "code": "PET040", "name": "TILMICOSINA 100 ML", "price": 350.00 },
  { "code": "PET041", "name": "TILOSINA 100 ML", "price": 120.00 },
  { "code": "PET042", "name": "TILOSINA 250 ML", "price": 280.00 },
  { "code": "PET043", "name": "VITAMINA K 100 ML", "price": 150.00 }
];

const distributors = [
  { id: 1, name: "Distribuidor 1" },
  { id: 2, name: "Distribuidor 2" },
  { id: 3, name: "Distribuidor 3" }
];

/*
const [order, setOrder] = useState({
  client: "",
  distributor: "", // <--- aquí se guarda el distribuidor
  items: [],
  date: new Date(),
  grandTotal: 0,
  id: Date.now()
});*/


// Component for product rows in the form
const ProductRow = ({ item, index, onUpdate, onRemove }) => {
    
    const handleProductSelect = (productName) => {
        const product = productList.find(p => p.name === productName);
        let updatedItem;

        if (product) {
            const quantity = parseFloat(item.quantity) || 1;
            const price = product.price;
            updatedItem = {
                ...item,
                productName: product.name,
                price: price.toFixed(2),
                total: (quantity * price).toFixed(2),
            };
        } else {
            updatedItem = {
                ...item,
                productName: '',
                price: '',
                total: '0.00',
            };
        }
        onUpdate(index, updatedItem);
    };

    const handleInputChange = (field, value) => {
        const newItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
            const quantity = parseFloat(newItem.quantity) || 0;
            const price = parseFloat(newItem.price) || 0;
            newItem.total = (quantity * price).toFixed(2);
        }
        onUpdate(index, newItem);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center p-2 bg-gray-50 rounded-lg mb-2">
            <select
                value={item.productName}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="col-span-1 md:col-span-3 p-2 border rounded-md bg-white"
            >
                <option value="">Selecciona un producto</option>
                {productList.map((product) => (
                    <option key={product.code} value={product.name}>
                        {product.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Cant."
                value={item.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="col-span-1 md:col-span-2 p-2 border rounded-md"
            />
            <div className="col-span-1 md:col-span-2 flex items-center">
                 <span className="text-gray-500 mr-1">$</span>
                 <input
                    type="number"
                    placeholder="Precio"
                    value={item.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full p-2 border rounded-md"
                />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center justify-end font-medium text-gray-800">
                <span>${item.total || '0.00'}</span>
            </div>
            <div className="col-span-1 flex justify-end">
                <button onClick={() => onRemove(index)} className="p-2 text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    );
};

// Form to create a new order
const OrderForm = ({ onSaveOrder }) => {
    const [seller, setSeller] = useState('');
    const [client, setClient] = useState('');
    const [distributor, setDistributor] = useState('');
    const [items, setItems] = useState([{ productName: '', quantity: '1', price: '', total: '0.00' }]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleUpdateItem = (index, updatedItem) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const handleAddItem = () => {
        setItems([...items, { productName: '', quantity: '1', price: '', total: '0.00' }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const calculateGrandTotal = () => {
        return items.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0).toFixed(2);
    };

    const handleSubmit = () => {
        if (!client || items.some(i => !i.productName || !i.price || parseFloat(i.price) <= 0)) {
            setModalMessage('Por favor, completa el nombre del cliente y asegúrate de que todos los productos tengan un nombre y un precio válido.');
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
                        <User className="text-gray-500 mr-3" />
                        <input type="text" placeholder="Nombre del Vendedor" value={seller} onChange={e => setSeller(e.target.value)} className="w-full bg-transparent focus:outline-none" />
                    </div>
                    <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                        <User className="text-gray-500 mr-3" />
                        <input type="text" placeholder="Nombre del Cliente" value={client} onChange={e => setClient(e.target.value)} className="w-full bg-transparent focus:outline-none" required/>
                    </div>
                    <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                        <Truck className="text-gray-500 mr-3" />
                        <select
                            value={distributor}
                            onChange={e => setDistributor(e.target.value)}
                            className="w-full bg-transparent focus:outline-none"
                            >
                            <option value="">Selecciona un distribuidor</option>
                            {distributors.map(dist => (
                                <option key={dist.id} value={dist.name}>{dist.name}</option>
                            ))}
                            </select>
                    </div>
                </div>

                <div className="mb-4">
                    {items.map((item, index) => (
                        <ProductRow key={index} index={index} item={item} onUpdate={handleUpdateItem} onRemove={handleRemoveItem} />
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

// View to show order summary and actions
const OrderSummary = ({ order, onShowReports, returnInfo }) => {
    const printRef = useRef();
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePdf = async (action = 'download') => {
        if (!printRef.current) {
             console.error("Print reference is not set.");
             return;
        }
        setIsGenerating(true);

        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const imgWidth = pdfWidth - 20; // with margin
        const imgHeight = imgWidth / ratio;
        
        let heightLeft = imgHeight;
        let position = 10; // top margin

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

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

        let message = `*Resumen de Pedido*\n\n`;
        //message += `El PDF del pedido ha sido descargado. Por favor, adjúntalo a este chat.\n\n`;
        message += `*Fecha:* ${new Date(order.date).toLocaleDateString()}\n`;
        message += `*Hora:* ${new Date(order.date).toLocaleTimeString()}\n`;
        message += `*Pedido ID:* ${order.id}\n`;
        message += `*Cliente:* ${order.client}\n`;
        message += `*Distribuidor:* ${order.distributor || 'N/A'}\n`;
        message += `*Total:* $${order.grandTotal}\n`;
        
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <>
            <div ref={printRef} className="p-4 md:p-8 bg-white rounded-xl shadow-lg print-area">
                <div className="relative flex items-center mb-6">
                    <img 
                        src="/LogoPets-1-1.png" 
                        alt="Logo de Pets Pharma" 
                        className="h-16 w-auto"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/160x60?text=Logo'; }}
                    />
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-800">
                     Resumen de Pedido
                    </h2>
                </div>
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

            <div className="mt-6 p-4 no-print">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => generatePdf('print')} disabled={isGenerating} className="flex items-center justify-center bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 disabled:bg-gray-400">
                        <Printer className="mr-2" /> {isGenerating ? 'Generando...' : 'Imprimir PDF'}
                    </button>
                    <button onClick={handleWhatsAppShare} disabled={isGenerating} className="flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 disabled:bg-green-300">
                        <Share2 className="mr-2" /> {isGenerating ? 'Generando...' : 'Enviar por WhatsApp'}
                    </button>
                    <button onClick={returnInfo.action} className="flex items-center justify-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                        {returnInfo.icon} {returnInfo.text}
                    </button>
                </div>
                 <div className="mt-4">
                    <button onClick={onShowReports} className="w-full flex items-center justify-center bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition duration-300">
                        <BarChart2 className="mr-2" /> Ver Reportes
                    </button>
                </div>
            </div>
            
        </>
    );
};

// View for sales reports
const ReportsView = ({ orders, onBack, onViewDetails }) => {
    const [filterDate, setFilterDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [filterYear, setFilterYear] = useState('');

    // Filtrado de pedidos por fecha, mes y año
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const orderDay = orderDate.toISOString().split('T')[0]; // yyyy-mm-dd
        const orderMonth = orderDate.getMonth() + 1; // 1-12
        const orderYear = orderDate.getFullYear();

        return (
            (!filterDate || orderDay === filterDate) &&
            (!filterMonth || orderMonth === parseInt(filterMonth)) &&
            (!filterYear || orderYear === parseInt(filterYear))
        );
    });

    const totalSales = filteredOrders.reduce((sum, order) => sum + parseFloat(order.grandTotal), 0);
    const totalOrders = filteredOrders.length;

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <BarChart2 className="mr-3 text-purple-500" /> Reporte de Ventas
                </h2>
                <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800">
                    <ArrowLeft size={18} className="mr-1" /> Volver
                </button>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="text-sm text-gray-600 block mb-1">Filtrar por Día:</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={e => setFilterDate(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-600 block mb-1">Filtrar por Mes:</label>
                    <select
                        value={filterMonth}
                        onChange={e => setFilterMonth(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    >
                        <option value="">Todos</option>
                        {[...Array(12)].map((_, i) => (
                            <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('es-MX', { month: 'long' })}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-600 block mb-1">Filtrar por Año:</label>
                    <input
                        type="number"
                        value={filterYear}
                        onChange={e => setFilterYear(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        placeholder="Ej. 2025"
                    />
                </div>
            </div>

            {/* Tarjetas resumen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-green-800">Ventas Totales</h3>
                    <p className="text-3xl font-bold text-green-900">${totalSales.toFixed(2)}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-blue-800">Pedidos Totales</h3>
                    <p className="text-3xl font-bold text-blue-900">{totalOrders}</p>
                </div>
            </div>

            {/* Tabla */}
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
                                    <button onClick={() => onViewDetails(order)} className="p-2 text-indigo-600 hover:text-indigo-800" title="Ver PDF del Pedido">
                                        <FileText size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">
                                    No se encontraron pedidos con los filtros seleccionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Main App Component
export default function App() {
    const [view, setView] = useState('form'); // 'form', 'summary', 'reports'
    const [previousView, setPreviousView] = useState('form');
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);

    // Load orders from localStorage on startup
    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem('salesOrders');
            if (savedOrders) {
                setOrders(JSON.parse(savedOrders));
            }
        } catch (error) {
            console.error("Error loading orders from localStorage:", error);
        }
    }, []);

    // Save orders to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('salesOrders', JSON.stringify(orders));
        } catch (error) {
            console.error("Error saving orders to localStorage:", error);
        }
    }, [orders]);

    const handleSaveOrder = (order) => {
        setOrders(prevOrders => [...prevOrders, order]);
        setCurrentOrder(order);
        setPreviousView('form');
        setView('summary');
    };

    const handleNewOrder = () => {
        setCurrentOrder(null);
        setView('form');
    };
    
    const handleShowReports = () => {
        setPreviousView(view);
        setView('reports');
    }

    const handleViewDetails = (order) => {
        setCurrentOrder(order);
        setPreviousView('reports');
        setView('summary');
    };

    const renderView = () => {
        switch (view) {
            case 'summary':
                let returnInfo;
                if (previousView === 'reports') {
                    returnInfo = { 
                        text: 'Volver a Reportes', 
                        action: () => setView('reports'),
                        icon: <ArrowLeft className="mr-2" />
                    };
                } else {
                    returnInfo = { 
                        text: 'Hacer Otro Pedido', 
                        action: handleNewOrder,
                        icon: <Plus className="mr-2" />
                    };
                }
                return <OrderSummary 
                    order={currentOrder} 
                    onShowReports={handleShowReports} 
                    returnInfo={returnInfo} 
                />;
            case 'reports':
                return <ReportsView 
                    orders={orders} 
                    onBack={handleNewOrder} 
                    onViewDetails={handleViewDetails}
                />;
            case 'form':
            default:
                return (
                    <>
                        <OrderForm onSaveOrder={handleSaveOrder} />
                        {orders.length > 0 && (
                             <div className="mt-4 text-center">
                                 <button onClick={handleShowReports} className="bg-transparent text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-100 transition duration-200">
                                     Ver Reporte de Ventas
                                 </button>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <>
            <style>{`
                /* This style block is not strictly necessary for local development if you use index.css for Tailwind, but it's kept for font import and print styles */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body { 
                    font-family: 'Inter', sans-serif;
                    background-color: #f0f4f8;
                }
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-area, .print-area * {
                        visibility: visible;
                    }
                    .print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        box-shadow: none;
                        border: none;
                    }
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <header className="text-center mb-8 no-print">
                    <img 
                        src="https://petspharma.com.mx/wp-content/uploads/2024/06/LogoPets-1-1.png" 
                        alt="Logo de Pets Pharma" 
                        className="h-20 w-auto mx-auto mb-4"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/200x80/e0e0e0/333?text=Pets+Pharma'; }}
                    />
                    <h1 className="text-4xl font-extrabold text-gray-800">Sistema de Pedidos</h1>
                    <p className="text-gray-500">Gestión de ventas y reportes simplificada.</p>
                </header>
                {renderView()}
            </main>
        </>
    );
}
