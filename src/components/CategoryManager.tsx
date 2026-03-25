import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Flower, Plus, Trash2, Pencil, X, Save } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface Category {
  id: string;
  name: string;
  color: string;
  authorUid: string;
  createdAt: any;
}

interface CategoryManagerProps {
  userUid: string;
  onClose: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ userUid, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#10b981'); // Default green
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(cats);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'categories');
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'categories'), {
        name: newName.trim(),
        color: newColor,
        authorUid: userUid,
        createdAt: serverTimestamp()
      });
      setNewName('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'categories');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      await updateDoc(doc(db, 'categories', id), {
        name: editName.trim(),
        color: editColor,
        updatedAt: serverTimestamp()
      });
      setEditingId(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `categories/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này? Các tài nguyên thuộc danh mục này sẽ không bị xóa nhưng sẽ mất phân loại.')) return;

    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `categories/${id}`);
    }
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color);
  };

  const colors = [
    '#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6'
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-white/20">
        <div className="p-6 flex justify-between items-center border-b border-green-50 bg-green-50/30">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-full text-white shadow-md">
              <Flower size={20} />
            </div>
            <h3 className="text-xl font-bold text-green-900">Quản lý Luống hoa</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full transition-colors text-green-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Add New Category */}
          <form onSubmit={handleAdd} className="mb-8 p-4 bg-green-50/50 rounded-3xl border border-green-100">
            <label className="block text-xs font-bold text-green-800 uppercase tracking-wider mb-2 ml-1">Gieo mầm mới</label>
            <div className="space-y-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Tên danh mục..."
                className="w-full px-4 py-2.5 bg-white border-2 border-green-100 rounded-2xl focus:border-green-400 outline-none transition-all text-sm font-medium"
                maxLength={50}
              />
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${newColor === c ? 'border-green-600 scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newName.trim()}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Plus size={18} />
                <span>Thêm danh mục</span>
              </button>
            </div>
          </form>

          {/* List Categories */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-green-800 uppercase tracking-wider mb-2 ml-1">Danh sách hiện tại</label>
            {categories.length === 0 ? (
              <p className="text-center py-4 text-gray-400 text-sm italic">Chưa có danh mục nào.</p>
            ) : (
              categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  {editingId === cat.id ? (
                    <div className="flex-1 flex flex-col space-y-2 mr-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 border-2 border-green-400 rounded-xl outline-none text-sm font-medium"
                        autoFocus
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {colors.map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`w-5 h-5 rounded-full border transition-transform ${editColor === c ? 'border-black scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-bold text-gray-800">{cat.name}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    {editingId === cat.id ? (
                      <>
                        <button onClick={() => handleUpdate(cat.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors">
                          <Save size={18} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEditing(cat)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                          <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 text-center">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Hệ thống quản lý vườn hoa tài nguyên</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
