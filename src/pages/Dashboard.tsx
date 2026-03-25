import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { db } from '../firebase';
import { Flower, LogOut, Search, Trash2, FileText, Video, Image as ImageIcon, Link as LinkIcon, Cloud, Pencil, Upload, Settings, Filter, BarChart2, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';
import { collection, query, onSnapshot, addDoc, serverTimestamp, orderBy, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase';
import CategoryManager from '../components/CategoryManager';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

interface Category {
  id: string;
  name: string;
  color: string;
  authorUid: string;
  createdAt: any;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'image' | 'link';
  url: string;
  categoryId: string;
  authorUid: string;
  createdAt: any;
}

const Dashboard: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch Resources
    const qRes = query(collection(db, 'resources'), orderBy('createdAt', 'desc'));
    const unsubscribeRes = onSnapshot(qRes, (snapshot) => {
      const resData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(resData);
      setLoading(false);
    }, (error) => {
      setLoading(false);
      handleFirestoreError(error, OperationType.GET, 'resources');
    });

    // Fetch Categories
    const qCat = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const unsubscribeCat = onSnapshot(qCat, (snapshot) => {
      const catData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(catData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'categories');
    });

    return () => {
      unsubscribeRes();
      unsubscribeCat();
    };
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? r.type === filterType : true;
    const matchesCategory = filterCategory ? r.categoryId === filterCategory : true;
    return matchesSearch && matchesType && matchesCategory;
  });

  const quickAdd = (type: string) => {
    navigate(`/dashboard/add?type=${type}`);
  };

  const openDeleteModal = (resource: Resource) => {
    setResourceToDelete(resource);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await deleteDoc(doc(db, 'resources', resourceToDelete.id));
      setDeleteModalOpen(false);
      setResourceToDelete(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `resources/${resourceToDelete.id}`);
    }
  };

  return (
    <div className="min-h-screen garden-bg flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Clouds */}
      <Cloud className="absolute top-10 left-10 text-white/60 animate-float" size={80} />
      <Cloud className="absolute top-20 right-20 text-white/50 animate-float-delayed" size={120} />
      <Cloud className="absolute top-40 left-1/3 text-white/40 animate-float" size={60} />

      <header className="bg-white/60 backdrop-blur-md shadow-sm py-4 px-6 flex justify-between items-center border-b border-green-200/50 relative z-10">
        <div className="flex items-center space-x-2 text-green-700">
          <Flower size={24} className="animate-spin-slow" />
          <h1 className="text-xl font-bold tracking-tight">Vườn Hoa Tài Nguyên</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-green-800 bg-white/50 px-3 py-1 rounded-full border border-green-200">
            Xin chào, {user?.displayName || user?.email} ({role})
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 text-green-700 hover:text-red-600 transition-colors bg-white/50 px-3 py-1 rounded-full border border-green-200 hover:border-red-200 hover:bg-red-50"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium">Thoát</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10">
        {/* Quick Add Buttons - 5 Petal Style Buttons */}
        {(role === 'admin' || role === 'teacher') && (
          <div className="mb-12 animate-grow">
            <h3 className="text-xl font-bold text-green-900 mb-6 text-center">Gieo Hạt Nhanh</h3>
            <div className="flex flex-wrap justify-center gap-8">
              <QuickAddButton 
                icon={<FileText size={24} />} 
                label="Tài liệu" 
                color="bg-blue-400" 
                onClick={() => quickAdd('document')} 
              />
              <QuickAddButton 
                icon={<Video size={24} />} 
                label="Video" 
                color="bg-red-400" 
                onClick={() => quickAdd('video')} 
              />
              <QuickAddButton 
                icon={<ImageIcon size={24} />} 
                label="Hình ảnh" 
                color="bg-yellow-400" 
                onClick={() => quickAdd('image')} 
              />
              <QuickAddButton 
                icon={<LinkIcon size={24} />} 
                label="Liên kết" 
                color="bg-purple-400" 
                onClick={() => quickAdd('link')} 
              />
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 animate-grow">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-extrabold text-green-900 drop-shadow-sm">Kho Tài Nguyên</h2>
            <div className="flex space-x-2">
              {(role === 'admin' || role === 'teacher') && (
                <button 
                  onClick={() => setCategoryManagerOpen(true)}
                  className="p-2 bg-white/50 hover:bg-white rounded-full border border-green-200 text-green-700 transition-all shadow-sm hover:shadow-md"
                  title="Quản lý danh mục"
                >
                  <Settings size={20} />
                </button>
              )}
              <button 
                onClick={() => setShowStats(!showStats)}
                className={`p-2 rounded-full border transition-all shadow-sm hover:shadow-md ${showStats ? 'bg-green-600 text-white border-green-600' : 'bg-white/50 hover:bg-white border-green-200 text-green-700'}`}
                title="Thống kê khu vườn"
              >
                <BarChart2 size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-green-600 group-focus-within:text-green-800 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tài nguyên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-2.5 bg-white/60 backdrop-blur-sm border-2 border-green-100 rounded-full text-sm font-medium text-green-900 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Type Filter */}
            <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full border border-green-200 shadow-sm">
              <button 
                onClick={() => setFilterType(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${!filterType ? 'bg-green-600 text-white shadow-md' : 'text-green-800 hover:bg-green-100'}`}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setFilterType('document')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filterType === 'document' ? 'bg-blue-500 text-white shadow-md' : 'text-blue-800 hover:bg-blue-50'}`}
              >
                Tài liệu
              </button>
              <button 
                onClick={() => setFilterType('video')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filterType === 'video' ? 'bg-red-500 text-white shadow-md' : 'text-red-800 hover:bg-red-50'}`}
              >
                Video
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showStats && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <GardenStats resources={resources} categories={categories} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2 animate-grow">
            <div className="flex items-center text-green-800 mr-2">
              <Filter size={16} className="mr-1" />
              <span className="text-xs font-bold uppercase tracking-wider">Danh mục:</span>
            </div>
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all border-2 ${!filterCategory ? 'bg-green-100 border-green-600 text-green-900' : 'bg-white border-gray-100 text-gray-500 hover:border-green-200'}`}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all border-2 flex items-center space-x-2 ${filterCategory === cat.id ? 'bg-white shadow-md' : 'bg-white/50 border-transparent text-gray-500 hover:bg-white'}`}
                style={{ 
                  borderColor: filterCategory === cat.id ? cat.color : 'transparent',
                  color: filterCategory === cat.id ? cat.color : undefined
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        <Routes>
          <Route path="/" element={
            loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-20 text-green-800 bg-white/60 backdrop-blur-md rounded-3xl border-2 border-dashed border-green-300 animate-grow">
                <Flower size={48} className="mx-auto mb-4 text-green-400 animate-spin-slow" />
                <p className="text-lg font-medium">Chưa có tài nguyên nào. Hãy là người đầu tiên gieo hạt!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource, index) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    role={role} 
                    userUid={user?.uid} 
                    index={index} 
                    onDelete={openDeleteModal}
                    onView={setViewingResource}
                    categories={categories}
                  />
                ))}
              </div>
            )
          } />
          <Route path="/add" element={<ResourceForm mode="add" />} />
          <Route path="/edit/:id" element={<ResourceForm mode="edit" />} />
        </Routes>
      </main>

      {/* Resource Viewer Modal */}
      {viewingResource && (
        <ResourceViewer resource={viewingResource} onClose={() => setViewingResource(null)} />
      )}

      {/* Confirmation Modal */}
      {categoryManagerOpen && (
        <CategoryManager 
          userUid={user?.uid || ''} 
          onClose={() => setCategoryManagerOpen(false)} 
        />
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200 border-2 border-red-100">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 mx-auto">
              <Trash2 className="text-red-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Nhổ bỏ tài nguyên?</h3>
            <p className="text-gray-600 text-center mb-8">
              Bạn có chắc chắn muốn xóa <span className="font-bold text-red-600">"{resourceToDelete?.title}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickAddButton = ({ icon, label, color, onClick }: { icon: React.ReactNode, label: string, color: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center group transition-all transform hover:scale-110"
  >
    <div className="relative w-16 h-16 flex items-center justify-center mb-2">
      {/* 5 Petals */}
      <div className="absolute inset-0 animate-spin-slow group-hover:animate-spin">
        {[0, 72, 144, 216, 288].map((angle) => (
          <div 
            key={angle}
            className={`absolute w-6 h-6 rounded-full ${color} opacity-80 shadow-sm`}
            style={{ 
              transform: `rotate(${angle}deg) translateY(-18px)`,
              left: 'calc(50% - 12px)',
              top: 'calc(50% - 12px)'
            }}
          ></div>
        ))}
      </div>
      <div className="relative z-10 bg-white rounded-full p-2 shadow-md border-2 border-yellow-400 text-green-700">
        {icon}
      </div>
    </div>
    <span className="text-sm font-bold text-green-900">{label}</span>
  </button>
);

const FlowerIconWrapper = ({ children, colorClass }: { children: React.ReactNode, colorClass: string }) => (
  <div className="relative flex items-center justify-center w-16 h-16 group-hover:scale-110 transition-transform duration-300">
    {/* 5 Petals */}
    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
      {[0, 72, 144, 216, 288].map((angle) => (
        <div 
          key={angle}
          className={`absolute w-5 h-5 rounded-full ${colorClass} opacity-80`}
          style={{ 
            transform: `rotate(${angle}deg) translateY(-16px)`,
          }}
        ></div>
      ))}
    </div>
    {/* Center */}
    <div className="relative z-10 bg-yellow-100 rounded-full p-2 shadow-sm border-2 border-yellow-300">
      {children}
    </div>
  </div>
);

const GardenStats: React.FC<{ resources: Resource[], categories: Category[] }> = ({ resources, categories }) => {
  const categoryCounts = categories.map(cat => ({
    name: cat.name,
    count: resources.filter(r => r.categoryId === cat.id).length,
    color: cat.color
  })).filter(c => c.count > 0);

  // Growth data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const growthData = last7Days.map(date => {
    const count = resources.filter(r => {
      if (!r.createdAt) return false;
      const rDate = (r.createdAt as any).toDate ? (r.createdAt as any).toDate() : new Date(r.createdAt);
      return rDate.toISOString().split('T')[0] === date;
    }).length;
    return { date, count };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-grow">
      {/* Total Card */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border-2 border-green-100 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
          <TrendingUp size={32} />
        </div>
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-1">Tổng số hạt mầm</h3>
        <p className="text-4xl font-black text-green-900">{resources.length}</p>
        <p className="text-xs text-green-600 mt-2 font-medium">Tài nguyên đã được gieo</p>
      </div>

      {/* Category Distribution */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border-2 border-green-100 shadow-sm">
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-4 flex items-center">
          <PieChartIcon size={16} className="mr-2" />
          Phân bố luống hoa
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryCounts}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
              >
                {categoryCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {categoryCounts.map((cat, i) => (
            <div key={i} className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="text-[10px] font-bold text-gray-600">{cat.name}: {cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border-2 border-green-100 shadow-sm">
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-widest mb-4 flex items-center">
          <TrendingUp size={16} className="mr-2" />
          Sự phát triển (7 ngày qua)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthData}>
              <XAxis 
                dataKey="date" 
                hide 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => `Ngày: ${label}`}
              />
              <Bar 
                dataKey="count" 
                fill="#22C55E" 
                radius={[4, 4, 0, 0]} 
                name="Số lượng"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-[10px] font-bold text-green-600 mt-2 uppercase tracking-wider">Số lượng tài nguyên mới mỗi ngày</p>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, role, userUid, index, onDelete, onView, categories }: { resource: Resource, role: string | null, userUid: string | undefined, index: number, onDelete: (r: Resource) => void, onView: (r: Resource) => void, categories: Category[] }) => {
  const navigate = useNavigate();
  const category = categories.find(c => c.id === resource.categoryId);

  const getIcon = (type: string) => {
    switch(type) {
      case 'document': return <FileText className="text-blue-600" size={20} />;
      case 'video': return <Video className="text-red-600" size={20} />;
      case 'image': return <ImageIcon className="text-yellow-600" size={20} />;
      case 'link': return <LinkIcon className="text-purple-600" size={20} />;
      default: return <FileText className="text-gray-600" size={20} />;
    }
  };

  const getPetalColor = (type: string) => {
    switch(type) {
      case 'document': return 'bg-blue-400';
      case 'video': return 'bg-red-400';
      case 'image': return 'bg-yellow-400';
      case 'link': return 'bg-purple-400';
      default: return 'bg-gray-400';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(resource);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/dashboard/edit/${resource.id}`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For Canva links, open in a new tab immediately with autoplay to avoid iframe restrictions
    if (resource.url.includes('canva.com')) {
      const autoplayUrl = resource.url.includes('?') 
        ? `${resource.url}&autoplay=1` 
        : `${resource.url}?autoplay=1`;
      window.open(autoplayUrl, '_blank');
      return;
    }
    
    onView(resource);
  };

  const canManage = role === 'admin' || resource.authorUid === userUid;
  const delay = `${(index % 10) * 0.1}s`;

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-md border-2 border-white/50 p-6 hover:shadow-xl hover:-translate-y-2 transition-all relative group overflow-hidden animate-grow"
      style={{ animationDelay: delay }}
    >
      {/* Decorative corner vines */}
      <div className="absolute -top-4 -right-4 text-green-200 opacity-40 rotate-45 group-hover:rotate-90 transition-transform duration-700">
        <Flower size={100} />
      </div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <FlowerIconWrapper colorClass={getPetalColor(resource.type)}>
          {getIcon(resource.type)}
        </FlowerIconWrapper>
        
        {canManage && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleEdit}
              className="text-blue-500 hover:text-blue-700 p-2 bg-white rounded-full shadow-sm border border-gray-100"
              title="Chỉnh sửa"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 p-2 bg-white rounded-full shadow-sm border border-gray-100"
              title="Xóa"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 relative z-10" title={resource.title}>{resource.title}</h3>
        
        {/* Category Badge */}
        {category && (
          <div 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 border"
            style={{ backgroundColor: `${category.color}10`, color: category.color, borderColor: `${category.color}30` }}
          >
            <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: category.color }} />
            {category.name}
          </div>
        )}

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10 relative z-10">{resource.description}</p>
      </div>
      
      <button 
        onClick={handleView}
        className="inline-flex items-center text-sm font-bold text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors relative z-10"
      >
        Xem tài nguyên <LinkIcon size={14} className="ml-1" />
      </button>
    </div>
  );
};

const ResourceViewer = ({ resource, onClose }: { resource: Resource, onClose: () => void }) => {
  const getEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    // Google Drive
    if (url.includes('drive.google.com/file/d/')) {
      return url.replace('/view', '/preview').replace('/edit', '/preview');
    }
    // Canva
    if (url.includes('canva.com/design/')) {
      // Extract design ID and ensure it's a view embed link with autoplay
      const designMatch = url.match(/canva\.com\/design\/([A-Z0-9_-]+)/i);
      if (designMatch && designMatch[1]) {
        return `https://www.canva.com/design/${designMatch[1]}/view?embed&autoplay=1`;
      }
      // Fallback if regex fails
      const baseUrl = url.split('?')[0];
      const finalBase = baseUrl.endsWith('/view') ? baseUrl : `${baseUrl}/view`;
      return `${finalBase}?embed&autoplay=1`;
    }
    // Heyzin
    if (url.includes('heyzine.com/flip-book/')) {
      return url; // Heyzin links are usually embeddable directly or need specific embed code
    }
    
    // Office documents (Word, Excel, PPT)
    const isOfficeDoc = /\.(doc|docx|xls|xlsx|ppt|pptx)$/i.test(url);
    if (isOfficeDoc) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
    }

    return url;
  };

  const renderContent = () => {
    const embedUrl = getEmbedUrl(resource.url);

    if (resource.type === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(resource.url)) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-100 rounded-xl overflow-hidden">
          <img 
            src={resource.url} 
            alt={resource.title} 
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (resource.type === 'video' && !resource.url.includes('youtube.com') && !resource.url.includes('youtu.be') && !resource.url.includes('drive.google.com')) {
      return (
        <div className="flex items-center justify-center h-full bg-black rounded-xl overflow-hidden">
          <video controls className="max-w-full max-h-full">
            <source src={resource.url} />
            Trình duyệt của bạn không hỗ trợ xem video trực tiếp.
          </video>
        </div>
      );
    }

    // Default to iframe for PDF, YouTube, Canva, Heyzin, etc.
    return (
      <iframe 
        src={embedUrl} 
        className="w-full h-full rounded-xl border-none bg-white"
        title={resource.title}
        allow="fullscreen; clipboard-write"
        allowFullScreen
      ></iframe>
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full h-full max-w-6xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-white/20">
        <div className="p-4 md:p-6 flex justify-between items-center border-b border-gray-100 bg-green-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-full shadow-sm text-green-600">
              <Flower size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{resource.title}</h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{resource.type}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-500 hover:text-green-600 hover:bg-white rounded-full transition-all"
              title="Mở trong tab mới"
            >
              <LinkIcon size={20} />
            </a>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-white rounded-full transition-all"
              title="Đóng"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 p-2 md:p-4 bg-gray-50">
          {renderContent()}
        </div>
        
        {resource.description && (
          <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Mô tả tài nguyên</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{resource.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResourceForm: React.FC<{ mode: 'add' | 'edit' }> = ({ mode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'document' | 'video' | 'image' | 'link'>('document');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [categoryId, setCategoryId] = useState('general');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('createdAt', 'asc'));
    const unsubscribeCat = onSnapshot(q, (snapshot) => {
      const catData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setCategories(catData);
    });

    if (mode === 'add') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('type');
      if (typeParam && ['document', 'video', 'image', 'link'].includes(typeParam)) {
        setType(typeParam as any);
      }
      setLoading(false);
    } else {
      // Fetch resource data for editing
      const fetchResource = async () => {
        const id = window.location.pathname.split('/').pop();
        if (!id) return;
        try {
          const docRef = doc(db, 'resources', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title);
            setDescription(data.description);
            setType(data.type);
            setUrl(data.url);
            setCategoryId(data.categoryId);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `resources/${id}`);
        } finally {
          setLoading(false);
        }
      };
      fetchResource();
    }

    return () => {
      if (unsubscribeCat) unsubscribeCat();
    };
  }, [mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && user) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Start pre-uploading immediately for speed
      setIsUploading(true);
      setUploadProgress(0);
      
      try {
        const fileRef = ref(storage, `resources/${user.uid}/${Date.now()}_${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(fileRef, selectedFile);
        
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, 
          (error) => {
            console.error("Upload error:", error);
            alert("Lỗi khi tải tệp lên. Vui lòng thử lại.");
            setIsUploading(false);
          }, 
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setUrl(downloadUrl);
            setIsUploading(false);
            setUploadProgress(100);
          }
        );
      } catch (error) {
        console.error("Setup upload error:", error);
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (isUploading) {
      alert('Vui lòng đợi tệp tải lên hoàn tất.');
      return;
    }
    
    // Validation: if type is document, image, or video, we need either a file or a URL
    if ((type === 'document' || type === 'image' || type === 'video') && !file && !url) {
      alert('Vui lòng chọn tệp hoặc nhập đường dẫn.');
      return;
    }

    // Validation: if type is link, we need a URL
    if (type === 'link' && !url) {
      alert('Vui lòng nhập đường dẫn.');
      return;
    }

    setIsSubmitting(true);
    try {
      // url is already set by handleFileChange (pre-upload) or manual input
      const finalUrl = url;

      if (mode === 'add') {
        await addDoc(collection(db, 'resources'), {
          title,
          description,
          type,
          url: finalUrl,
          categoryId,
          authorUid: user.uid,
          createdAt: serverTimestamp()
        });
      } else {
        const id = window.location.pathname.split('/').pop();
        if (!id) return;
        await updateDoc(doc(db, 'resources', id), {
          title,
          description,
          type,
          url: finalUrl,
          categoryId,
          updatedAt: serverTimestamp()
        });
      }
      navigate('/dashboard');
    } catch (error) {
      handleFirestoreError(error, mode === 'add' ? OperationType.CREATE : OperationType.UPDATE, 'resources');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;

  return (
    <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border-2 border-white/50 p-8 animate-grow relative overflow-hidden">
      <Flower className="absolute -top-10 -right-10 text-green-100 opacity-50 rotate-45" size={200} />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-green-900 flex items-center">
          <Flower className="mr-2 text-green-600" size={24} />
          {mode === 'add' ? 'Gieo Hạt Mới' : 'Chỉnh Sửa Tài Nguyên'}
        </h2>
        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">Hủy</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-sm font-bold text-green-800 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            required 
            maxLength={200}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 outline-none transition-colors"
            placeholder="VD: Giáo án Toán lớp 1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-green-800 mb-1">Mô tả</label>
          <textarea 
            maxLength={1000}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 outline-none h-24 resize-none transition-colors"
            placeholder="Mô tả ngắn gọn về tài nguyên này..."
          ></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-green-800 mb-1">Loại tài nguyên <span className="text-red-500">*</span></label>
            <select 
              value={type}
              onChange={e => setType(e.target.value as any)}
              className="w-full px-4 py-3 bg-white/80 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 outline-none transition-colors"
            >
              <option value="document">Tài liệu (PDF, Word...)</option>
              <option value="video">Video</option>
              <option value="image">Hình ảnh</option>
              <option value="link">Liên kết web</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-green-800 mb-1">Danh mục <span className="text-red-500">*</span></label>
            <select 
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 outline-none transition-colors"
            >
              <option value="general">Chung</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {(type === 'document' || type === 'image' || type === 'video') ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-green-800 mb-1">
                Tải tệp lên {type === 'image' ? '(Hình ảnh)' : type === 'video' ? '(Video)' : '(PDF, Word...)'}
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  onChange={handleFileChange}
                  accept={type === 'image' ? "image/*" : type === 'video' ? "video/*" : ".pdf,.doc,.docx"}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-3 bg-green-50 border-2 border-dashed border-green-200 rounded-xl cursor-pointer hover:bg-green-100 transition-colors text-green-700 font-medium"
                >
                  <Upload size={20} className="mr-2" />
                  {file ? file.name : 'Chọn tệp từ máy tính'}
                </label>
              </div>
              
              {isUploading && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-green-700 font-bold mb-1">
                    <span>Đang tải lên...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-green-600 h-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {file && !isUploading && uploadProgress === 100 && (
                <div className="mt-2 flex items-center text-xs text-green-600 font-bold">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Tệp đã sẵn sàng để lưu!
                </div>
              )}
            </div>
            
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-green-200"></div>
              <span className="flex-shrink mx-4 text-green-500 text-sm font-bold uppercase tracking-wider">Hoặc</span>
              <div className="flex-grow border-t border-green-200"></div>
            </div>

            <div>
              <label className="block text-sm font-bold text-green-800 mb-1">Đường dẫn (URL)</label>
              <input 
                type="url" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 outline-none transition-colors"
                placeholder="https://..."
              />
              <p className="text-xs text-green-600 mt-1 font-medium">Link Google Drive, YouTube, Canva, Heyzin, hoặc trang web bất kỳ.</p>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-bold text-green-800 mb-1">Đường dẫn (URL) <span className="text-red-500">*</span></label>
            <input 
              type="url" 
              required 
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 border-2 border-green-100 rounded-xl focus:ring-0 focus:border-green-400 outline-none transition-colors"
              placeholder="https://..."
            />
            <p className="text-xs text-green-600 mt-1 font-medium">Gắn mọi liên kết hữu ích (Heyzin, Canva, Website...).</p>
          </div>
        )}
        
        <div className="pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-md transition-all transform hover:-translate-y-0.5 ${isSubmitting || isUploading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'}`}
          >
            {isSubmitting ? 'Đang lưu...' : isUploading ? 'Đang tải tệp...' : mode === 'add' ? 'Lưu Tài Nguyên' : 'Cập Nhật Tài Nguyên'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
