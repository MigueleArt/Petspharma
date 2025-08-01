import React from 'react';
import { Package, Users, Building, FilePlus, BarChart3, LogOut } from 'lucide-react';

export default function AdminPanel({ onLogout, onNavigate, currentView }) {
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
}
