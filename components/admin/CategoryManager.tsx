
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { DbCategory, ApiResponse } from '../../types';
import { Plus, Edit, Trash2, Search, X, Loader, Save, Coffee, ShoppingBasket, Utensils } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DbCategory | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<DbCategory>>({
    name: '',
    type: 'coffee'
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.categories.list();
      if (response.status === 'success' && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category?: DbCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        type: 'coffee'
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await api.categories.delete(id);
        if (response.status === 'success') {
          setCategories(prev => prev.filter(c => c.id !== id));
        }
      } catch (error) {
        alert("Failed to delete category");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Fix for Error: Property 'data' does not exist on type 'ApiResponse<DbCategory> | { status: string; message: string; }'
        const response = await api.categories.update(editingCategory.id, formData) as ApiResponse<DbCategory>;
        if (response.status === 'success' && response.data) {
          const updated = response.data;
          setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
        }
      } else {
        // Fix for Error: Property 'data' does not exist on type 'ApiResponse<DbCategory> | { status: string; message: string; }'
        const response = await api.categories.create(formData as any) as ApiResponse<DbCategory>;
        if (response.status === 'success' && response.data) {
          setCategories(prev => [...prev, response.data!]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'coffee': return <Coffee size={16} className="text-amber-700" />;
      case 'restaurant': return <Utensils size={16} className="text-red-600" />;
      case 'minimart': return <ShoppingBasket size={16} className="text-blue-600" />;
      default: return <Coffee size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'coffee': return 'Coffee Shop';
      case 'restaurant': return 'Restaurant';
      case 'minimart': return 'Mini Mart';
      default: return type;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
           <p className="text-gray-500">Organize your products into categories.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-brand-blue" size={32} />
             </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 rounded-full bg-gray-100">
                              {getTypeIcon(category.type)}
                           </div>
                           <span className="text-sm text-gray-700">{getTypeLabel(category.type)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleOpenModal(category)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                  placeholder="e.g. Hot Drinks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'restaurant'})}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      formData.type === 'restaurant' 
                        ? 'border-red-500 bg-red-50 text-red-700' 
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Utensils size={20} className="mb-1" />
                    <span className="text-xs font-medium">Restaurant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'coffee'})}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      formData.type === 'coffee' 
                        ? 'border-amber-500 bg-amber-50 text-amber-700' 
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Coffee size={20} className="mb-1" />
                    <span className="text-xs font-medium">Coffee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'minimart'})}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                      formData.type === 'minimart' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <ShoppingBasket size={20} className="mb-1" />
                    <span className="text-xs font-medium">Mart</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-800 flex items-center gap-2"
                >
                  <Save size={18} />
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
