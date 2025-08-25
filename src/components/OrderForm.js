// OrderForm.jsx
import React, { useState, useMemo, useEffect } from 'react'; // Se añade useEffect
import { ShoppingCart, User as Plus, UserPlus, PackagePlus, Trash2 } from 'lucide-react';

// --- Constantes ---
// Mantenemos las opciones de descuento que son más estáticas.
const DISCOUNT_OPTIONS = [0, 5, 10, 15, 20, 25, 30];


// --- Componente para la Fila de Producto (sin cambios) ---
const ProductRow = ({ item, index, onUpdate, onRemove, productList }) => {
  const handleFieldChange = (field, value) => {
    onUpdate(index, field, value);
  };

  return (
    <div className="grid grid-cols-12 gap-2 p-2 bg-gray-50 rounded-lg mb-2 items-center border">
      <select
        value={item.productId}
        onChange={(e) => handleFieldChange('productId', e.target.value)}
        className="col-span-12 md:col-span-3 p-2 border rounded-md bg-white text-sm"
      >
        <option value="">Selecciona un producto</option>
        {productList.map((product) => (
          <option key={product.id} value={product.id}>
            {`${product.id} - ${product.name}`}
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        placeholder="Cant."
        value={item.quantity}
        onChange={(e) => handleFieldChange("quantity", parseInt(e.target.value) || 1)}
        className="col-span-3 md:col-span-1 p-2 border rounded-md text-center"
      />
      <input
        type="number"
        min="0"
        placeholder="Bonif."
        value={item.bonus}
        onChange={(e) => handleFieldChange("bonus", parseInt(e.target.value) || 0)}
        className="col-span-3 md:col-span-1 p-2 border rounded-md text-center"
      />
      <select
        value={item.discount}
        onChange={(e) => handleFieldChange('discount', parseInt(e.target.value))}
        className="col-span-6 md:col-span-2 p-2 border rounded-md bg-white text-sm"
      >
        {DISCOUNT_OPTIONS.map(d => <option key={d} value={d}>{d}%</option>)}
      </select>
      <div className="col-span-6 md:col-span-2 flex items-center justify-end font-medium text-gray-600 bg-gray-100 p-2 rounded-md">
        <span>${item.price.toFixed(2)}</span>
      </div>
      <div className="col-span-5 md:col-span-2 flex items-center justify-end font-bold text-gray-800">
        <span>${item.subtotal.toFixed(2)}</span>
      </div>
      <div className="col-span-1 flex justify-center">
        <button onClick={() => onRemove(index)} className="p-2 text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Componente Principal del Formulario ---
export default function OrderForm({ onSaveOrder, products, clients, sellers, distributors, onAddClient }) {
  
  // ==================================================================
  // CAMBIO 1: Generar la lista de laboratorios dinámicamente.
  // Usamos useMemo para que esta operación no se repita en cada render.
  // Se basa en el prop 'products' que viene desde App.js.
  // ==================================================================
  const availableLaboratories = useMemo(() => {
    if (!products || products.length === 0) return [];
    // Creamos un Set para obtener solo los nombres únicos de laboratorios
    const labs = new Set(products.map(p => p.laboratory).filter(Boolean));
    return [...labs]; // Convertimos el Set de nuevo a un Array
  }, [products]);

  // --- Estados del Formulario ---
  const [laboratory, setLaboratory] = useState("");
  const [seller, setSeller] = useState("");
  const [client, setClient] = useState("");
  const [distributorRepName, setDistributorRepName] = useState("");
  const [distributor, setDistributor] = useState("");
  const [items, setItems] = useState([{ 
    productId: "", productName: "", quantity: 1, bonus: 0, discount: 0, price: 0, subtotal: 0 
  }]);
  const [overallDiscount, setOverallDiscount] = useState(0);

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");

  // ==================================================================
  // CAMBIO 2: Seleccionar el primer laboratorio por defecto.
  // Usamos useEffect para que, cuando la lista de laboratorios disponibles
  // se cargue, se seleccione automáticamente el primero.
  // ==================================================================
  useEffect(() => {
    if (availableLaboratories.length > 0 && !laboratory) {
      setLaboratory(availableLaboratories[0]);
    }
  }, [availableLaboratories, laboratory]);

  // --- Lógica de filtrado y cálculos (optimizada con useMemo) ---
  const filteredProducts = useMemo(
    () => products.filter(p => p.laboratory === laboratory),
    [products, laboratory]
  );
  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.subtotal, 0),
    [items]
  );
  const grandTotal = useMemo(() => {
    const discountAmount = (subtotal * overallDiscount) / 100;
    return Math.max(0, subtotal - discountAmount);
  }, [subtotal, overallDiscount]);

  // --- Manejadores de eventos (sin cambios en su lógica interna) ---
  const handleUpdateItem = (index, field, value) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    item[field] = value;
    if (field === 'productId') {
      const product = filteredProducts.find(p => p.id === value);
      if (product) {
        item.productName = product.name;
        item.price = product.price;
      } else {
        item.productName = "";
        item.price = 0;
      }
    }
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    const itemDiscount = item.discount || 0;
    const discountAmount = price * (itemDiscount / 100);
    item.subtotal = (price - discountAmount) * quantity;
    newItems[index] = item;
    setItems(newItems);
  };
  const handleAddItem = () => {
    setItems([...items, { productId: "", productName: "", quantity: 1, bonus: 0, discount: 0, price: 0, subtotal: 0 }]);
  };
  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };
  const handleLabChange = (labName) => {
    setLaboratory(labName);
    setItems([{ productId: "", productName: "", quantity: 1, bonus: 0, discount: 0, price: 0, subtotal: 0 }]);
  };
  const handleSubmit = () => {
    if (!client || !seller || !distributor || items.some(i => !i.productId)) {
      setModalMessage("Por favor, completa todos los campos principales (representante, cliente, distribuidor) y asegúrate de que todos los productos estén seleccionados.");
      setShowModal(true);
      return;
    }
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      laboratory,
      seller,
      client,
      distributor,
      distributorRepName,
      items: items.filter(i => i.productId),
      overallDiscount,
      grandTotal: grandTotal.toFixed(2),
    };
    onSaveOrder(order);
  };
  const handleSaveNewClient = () => {
    if (!newClientName.trim()) return;
    const newClient = { id: Date.now(), name: newClientName.trim() };
    onAddClient(newClient); 
    setClient(newClient.name);
    setNewClientName("");
    setShowAddClientModal(false);
  };

  return (
    <>
      {/* Modales (sin cambios) */}
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
      {/* --- Contenido del Formulario --- */}
      <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <ShoppingCart className="mr-3 text-blue-500" /> Nuevo Pedido
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Laboratorio</label>
            {/* ================================================================== */}
            {/* CAMBIO 3: El selector ahora usa la lista dinámica.               */}
            {/* ================================================================== */}
            <select value={laboratory} onChange={(e) => handleLabChange(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50">
              <option value="" disabled>Seleccione un laboratorio</option>
              {availableLaboratories.map(lab => <option key={lab} value={lab}>{lab}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Representante / Promotor</label>
            <select value={seller} onChange={(e) => setSeller(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50">
              <option value="">Selecciona Representante</option>
              {sellers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <div className="flex items-center">
              <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50">
                <option value="">Selecciona cliente</option>
                {clients.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <button onClick={() => setShowAddClientModal(true)} className="ml-2 p-2 text-blue-600 hover:bg-blue-100 rounded-full" title="Agregar Cliente">
                <UserPlus size={20} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Representante Distribuidor</label>
            <input type="text" value={distributorRepName} onChange={(e) => setDistributorRepName(e.target.value)} placeholder="Nombre del representante" className="w-full p-2 border rounded-md bg-gray-50"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Distribuidor</label>
            <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className="w-full p-2 border rounded-md bg-gray-50">
              <option value="">Selecciona Distribuidor</option>
              {distributors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>

        {/* --- Lista de productos (sin cambios) --- */}
        <div className="mb-4">
          <div className="hidden md:grid grid-cols-12 gap-2 px-2 text-sm font-medium text-gray-500 uppercase mb-2">
            <div className="col-span-3">SKU Producto</div>
            <div className="col-span-1 text-center">Cant.</div>
            <div className="col-span-1 text-center">Bonif.</div>
            <div className="col-span-2 text-center">Descuento</div>
            <div className="col-span-2 text-right">Precio</div>
            <div className="col-span-2 text-right">Subtotal</div>
            <div className="col-span-1"></div>
          </div>
          {items.map((item, index) => (
            <ProductRow
              key={index}
              index={index}
              item={item}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
              productList={filteredProducts}
            />
          ))}
        </div>
        
        {/* El resto del JSX no necesita cambios */}
        <button onClick={handleAddItem} className="flex items-center text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg transition duration-200 mb-6">
          <PackagePlus size={18} className="mr-2" /> Agregar Producto
        </button>

        <div className="flex flex-col md:flex-row justify-end items-end mb-6">
            {/* ...sección de totales... */}
        </div>

        <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">
          Generar Pedido
        </button>
      </div>
    </>
  );
}