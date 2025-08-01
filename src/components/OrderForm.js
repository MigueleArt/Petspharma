import React, { useState } from 'react';
import { ShoppingCart, User as UserIcon, Truck, DollarSign, Plus, Trash2 } from 'lucide-react';

// ProductRow component is defined here as it's only used by OrderForm
const ProductRow = ({ item, index, onUpdate, onRemove, productList }) => {
  const handleProductSelect = (productName) => {
    const product = productList.find((p) => p.name === productName);
    let updatedItem;

    if (product) {
      const quantity = parseFloat(item.quantity) || 1;
      const price = product.price; // This will be a number
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

export default function OrderForm({ onSaveOrder, products, clients, sellers, distributors }) {
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
}
