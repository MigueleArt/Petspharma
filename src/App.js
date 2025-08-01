import React, { useState, useEffect } from 'react';
import Login from './components/Login';
//import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
//import AdminPanel from './components/AdminPanel';
import OrderForm from './components/OrderForm';
import OrderSummary from './components/OrderSummary';
import ReportsView from './components/ReportsView';
import ProductManagement from './components/ProductManagement';
import GenericManagement from './components/GenericManagement';

// Initial data to seed the application if localStorage is empty
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
    if (user) { // Only save data if a user is logged in and changes are made
        saveData("products", products);
        saveData("clients", clients);
        saveData("sellers", sellers);
        saveData("distributors", distributors);
        saveData("orders", orders);
    }
  }, [products, clients, sellers, distributors, orders, user]);

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
        .pdf-render-container {
          display: none;
          position: absolute;
          left: -9999px;
          top: auto;
          width: 800px; /* Fixed width for consistent PDF layout */
          background: white;
        }
        @media print {
          body * { visibility: hidden; }
          .pdf-render-container, .pdf-render-container * { visibility: visible; }
          .pdf-render-container { display: block; position: absolute; left: 0; top: 0; }
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
        
        {/* Hidden div for consistent PDF rendering */}
        {currentOrder && (
          <div id="pdf-render-container">
              <div className="p-8 bg-white">
                  <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Resumen de Pedido</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                      <div><strong>Cliente:</strong> {currentOrder.client || 'N/A'}</div>
                      <div className="text-right"><strong>Fecha:</strong> {new Date(currentOrder.date).toLocaleDateString()}</div>
                      <div><strong>Vendedor:</strong> {currentOrder.seller || 'N/A'}</div>
                      <div className="text-right"><strong>Hora:</strong> {new Date(currentOrder.date).toLocaleTimeString()}</div>
                      <div><strong>Distribuidor:</strong> {currentOrder.distributor || 'N/A'}</div>
                      <div className="text-right"><strong>ID Pedido:</strong> {currentOrder.id}</div>
                  </div>
                  <div className="border-t border-b border-gray-200 py-4 my-4">
                      <div className="grid grid-cols-5 gap-2 font-semibold text-gray-700 mb-2">
                          <div className="col-span-2">Producto</div>
                          <div>Cant.</div>
                          <div className="text-right">P. Unit.</div>
                          <div className="text-right">Total</div>
                      </div>
                      {currentOrder.items.map((item, index) => (
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
                          <div className="text-2xl font-bold text-gray-800">${currentOrder.grandTotal}</div>
                      </div>
                  </div>
                  <div className="text-center text-xs text-gray-400 mt-8">
                      <p>Gracias por su compra.</p>
                  </div>
              </div>
          </div>
        )}
      </main>
    </>
  );
}
