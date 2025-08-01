import React, { useState } from 'react';
import Modal from './Modal';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function GenericManagement({ items, handlers, itemName }) {
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
        <h2 className="text-2xl font-bold text-gray-800">Gestión de {itemName}</h2>
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
}
