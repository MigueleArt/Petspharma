// OrderForm.jsx
import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, Truck, DollarSign, Plus, Trash2 } from 'lucide-react';

const ProductRow = ({ item, index, onUpdate, onRemove, productList }) => {
  const handleProductSelect = (productName) => {
    const product = productList.find((p) => p.name === productName);
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

export default function OrderForm({ onSaveOrder, products, clients, sellers, distributors, onAddClient }) {
  const [seller, setSeller] = useState("");
  const [client, setClient] = useState("");
  const [distributor, setDistributor] = useState("");
  const [items, setItems] = useState([{ productName: "", quantity: "1", price: "", total: "0.00" }]);
  const [discount, setDiscount] = useState(0);

  // Modal general
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Modal agregar cliente
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");

  const discountOptions = [0, 5, 10, 15, 20, 25, 30];

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

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * discount) / 100;
    return Math.max(0, subtotal - discountAmount).toFixed(2);
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
      discount,
      grandTotal: calculateGrandTotal(),
    };
    onSaveOrder(order);
  };

  const handleSaveNewClient = () => {
    if (!newClientName.trim()) return;
    const newClient = { id: Date.now(), name: newClientName.trim() };
    onAddClient(newClient); // 🔹 Lo añade al estado en App
    setClient(newClient.name); // Lo selecciona automáticamente
    setNewClientName("");
    setShowAddClientModal(false);
  };

  // Pre-calculamos el subtotal y el descuento para mostrarlos
  const subtotal = calculateSubtotal();
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = calculateGrandTotal();

  return (
    <>
      {/* Modal error */}
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

      {/* Modal agregar cliente */}
      {showAddClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-bold mb-4">Agregar Cliente</h3>
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Nombre del cliente"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowAddClientModal(false)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Cancelar</button>
              <button onClick={handleSaveNewClient} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
            </div>
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
            <div className="flex-grow relative">
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-transparent focus:outline-none pr-8"
              >
                <option value="">Selecciona cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddClientModal(true)}
              className="ml-2 text-blue-600 hover:text-blue-800"
              title="Agregar Cliente"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <Truck className="text-gray-500 mr-3" />
            <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className="w-full bg-transparent focus:outline-none">
              <option value="">Selecciona Distribuidor</option>
              {distributors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>

        {/* Lista de productos */}
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

        {/* Nueva sección de resumen de precios */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
          <div className="flex space-x-2 items-center mb-4 md:mb-0">
            <label className="font-medium">Descuento:</label>
            <select
              value={discount}
              onChange={(e) => setDiscount(parseInt(e.target.value))}
              className="p-2 border rounded-lg"
            >
              {discountOptions.map(opt => (
                <option key={opt} value={opt}>{opt}%</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {discount > 0 && (
              <>
                <div className="flex justify-between w-full max-w-[200px] text-sm text-gray-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between w-full max-w-[200px] text-red-500 font-semibold text-sm">
                  <span>Descuento ({discount}%):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between w-full max-w-[200px] text-xl font-bold text-gray-800 border-t-2 pt-2">
              <span>Total:</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center text-lg shadow-md"
        >
          Generar Pedido
        </button>
      </div>
    </>
  );
}
