import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import OrderForm from './components/OrderForm';
import OrderSummary from './components/OrderSummary';
import ReportsView from './components/ReportsView';
import ProductManagement from './components/ProductManagement';
import GenericManagement from './components/GenericManagement';
import SummaryLayout from './components/SummaryLayout';

import { products as initialProducts } from './data/productList';

const initialData = {
  products: initialProducts,
  clients: [{ id: 1, name: "Cliente Mostrador" }],
  sellers: [{ id: 1, name: "Vendedor Principal" }],
  distributors: [{ id: 1, name: "Pets Pharma" }],
  orders: [],
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [previousView, setPreviousView] = useState("login");

  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

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
        console.error("Error al cargar datos:", key, e);
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
    if (user) {
      saveData("products", products);
      saveData("clients", clients);
      saveData("sellers", sellers);
      saveData("distributors", distributors);
      saveData("orders", orders);
    }
  }, [products, clients, sellers, distributors, orders, user]);

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
      if (window.confirm(`¿Eliminar este ${itemName}?`)) {
        setState((prev) => prev.filter((item) => item.id !== id));
      }
    },
  });

  const productHandlers = createCrudHandlers(setProducts, "producto");
  const clientHandlers = createCrudHandlers(setClients, "cliente");
  const sellerHandlers = createCrudHandlers(setSellers, "vendedor");
  const distributorHandlers = createCrudHandlers(setDistributors, "distribuidor");

  const renderContent = () => {
    if (view === "login") return <Login onLogin={handleLogin} />;

    switch (view) {
      case "orderForm":
        return (
          <OrderForm
            onSaveOrder={handleSaveOrder}
            products={products}
            clients={clients}
            sellers={sellers}
            distributors={distributors}
            onAddClient={clientHandlers.handleAddItem}
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


  console.log("Estado actual de productos en App:", products);
  
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
          width: 800px;
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

        {/* Área oculta para PDF */}
        {currentOrder && (
          <div id="pdf-render-container" className="pdf-render-container">
            <SummaryLayout order={currentOrder} />
          </div>
        )}
      </main>
    </>
  );
}
