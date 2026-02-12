
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, ChevronLeft, LayoutGrid, Home as HomeIcon, 
  Heart, Sun, PlusCircle, Sparkles, Cloud, ArrowLeft, Camera,
  QrCode, Share2, List as ListIcon, Link as LinkIcon,
  PlayCircle, FileText, ExternalLink, Globe, BookOpen, Edit,
  CloudUpload, CloudDownload, Save, RefreshCw, ShieldCheck, Download, Upload, Trash2,
  CheckCircle2, FilePlus, ImagePlus, User, Smartphone, Monitor
} from 'lucide-react';
import { MOCK_MATERIALS } from './data/mockData';
import { AgeGroup, DevelopmentField, TeachingMaterial, ViewState } from './types';
import { FIELD_ICONS, AGE_LABELS, FIELD_COLORS } from './constants';

const DB_KEY = 'VUON_HOA_MINH_DUC_V8_ULTRA';
const GARDEN_ID_KEY = 'MD_GARDEN_ID';

const CuteBee: React.FC = () => (
  <div className="bee-animate pointer-events-none">
    <svg width="50" height="50" viewBox="0 0 100 100" className="sm:w-[60px] sm:h-[60px]">
      <ellipse cx="50" cy="55" rx="30" ry="22" fill="#FACC15" stroke="#422006" strokeWidth="2.5" />
      <path d="M35 38 Q50 35 65 38" fill="none" stroke="#422006" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 55 Q50 52 70 55" fill="none" stroke="#422006" strokeWidth="5" strokeLinecap="round" />
      <path d="M35 70 Q50 67 65 70" fill="none" stroke="#422006" strokeWidth="4" strokeLinecap="round" />
      <g opacity="0.6">
        <ellipse cx="40" cy="35" rx="14" ry="10" fill="#E0F2FE" stroke="white" strokeWidth="1" transform="rotate(-30, 40, 35)" />
        <ellipse cx="60" cy="35" rx="14" ry="10" fill="#E0F2FE" stroke="white" strokeWidth="1" transform="rotate(30, 60, 35)" />
      </g>
      <circle cx="68" cy="50" r="3" fill="#422006" />
    </svg>
  </div>
);

const RealisticQRCode: React.FC<{ code: string }> = ({ code }) => (
  <div className="bg-white p-2 border border-gray-100 rounded-lg shadow-inner flex flex-col items-center">
    <div className="grid grid-cols-5 gap-0.5 w-12 h-12">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={`w-full h-full ${Math.random() > 0.4 ? 'bg-emerald-800' : 'bg-transparent'}`}></div>
      ))}
    </div>
    <span className="text-[7px] font-bold mt-1 text-emerald-600 uppercase tracking-tighter">{code}</span>
  </div>
);

const SketchFlower: React.FC<{ 
  age?: AgeGroup; 
  color: string; 
  onClick: () => void;
  isCreative?: boolean;
  className?: string;
  stemHeight?: number;
}> = ({ age, color, onClick, isCreative, className, stemHeight = 100 }) => {
  const petalColors: Record<string, string> = {
    'yellow': 'fill-yellow-400', 'pink': 'fill-rose-400', 'purple': 'fill-purple-400',
    'green': 'fill-emerald-400', 'rose': 'fill-pink-300', 'blue': 'fill-sky-300',
    'orange': 'fill-orange-400', 'cyan': 'fill-cyan-300', 'red': 'fill-red-400'
  };

  return (
    <div className={`flex flex-col items-center cursor-pointer group transition-all duration-500 flower-animated ${className}`} onClick={onClick}>
      <div className="relative w-14 h-14 sm:w-18 sm:h-18 lg:w-22 lg:h-22 flex items-center justify-center transform group-hover:scale-110 group-active:scale-95 transition-all z-20">
        <svg viewBox="0 0 100 100" className="absolute w-full h-full drop-shadow-md petals-animated">
          <g>
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle key={deg} cx="50" cy="28" r="20" className={petalColors[color]} transform={`rotate(${deg}, 50, 50)`} stroke="white" strokeWidth="1.5" />
            ))}
          </g>
          <circle cx="50" cy="50" r="18" fill="white" />
        </svg>
        <div className="z-30 text-center flex flex-col items-center">
          {isCreative ? (
            <div className="flex flex-col items-center">
              <Camera className="w-4 h-4 text-gray-500" />
              <span className="text-[6px] sm:text-[7px] font-black text-gray-700 uppercase leading-none mt-1">Bé Sáng Tạo</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-gray-800 font-black text-[10px] sm:text-xs leading-none">{age?.replace('T', '')}</span>
              <span className="text-[5px] font-bold text-gray-400 uppercase">Tuổi</span>
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 -mt-2">
        <svg width="18" height={stemHeight} viewBox={`0 0 40 ${stemHeight}`} className="sm:w-5">
          <path d={`M20 0 Q${15 + Math.random()*10} ${stemHeight/2} 20 ${stemHeight}`} stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedField, setSelectedField] = useState<DevelopmentField | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<TeachingMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addType, setAddType] = useState<'TEACHER' | 'KID'>('TEACHER');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [gardenId, setGardenId] = useState(() => localStorage.getItem(GARDEN_ID_KEY) || '');
  
  const wordInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [materials, setMaterials] = useState<TeachingMaterial[]>(() => {
    const saved = localStorage.getItem(DB_KEY);
    return saved ? JSON.parse(saved) : MOCK_MATERIALS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(DB_KEY + '_FAV');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    name: '', ageGroup: '3-4T' as AgeGroup, field: DevelopmentField.NHAN_THUC,
    description: '', link: '', qrCode: '', type: 'video' as any
  });

  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(materials));
    // Tự động sao lưu lên "đám mây mô phỏng"
    if (gardenId) {
      localStorage.setItem(`CLOUD_BACKUP_${gardenId}`, JSON.stringify({ materials, favorites }));
    }
  }, [materials, favorites, gardenId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleRegisterGarden = () => {
    const id = prompt("Cô hãy nhập Mã Vườn của mình (Ví dụ: MINHDUC-COANH):");
    if (id) {
      const existing = localStorage.getItem(`CLOUD_BACKUP_${id}`);
      if (existing && confirm("Mã vườn này đã có dữ liệu. Cô có muốn tải về thiết bị này không?")) {
        const data = JSON.parse(existing);
        setMaterials(data.materials);
        setFavorites(data.favorites);
      }
      setGardenId(id);
      localStorage.setItem(GARDEN_ID_KEY, id);
      showToast(`Chào mừng cô đến với vườn hoa ${id}!`);
    }
  };

  const handleFileUpload = (type: 'word' | 'image') => {
    if (type === 'word') wordInputRef.current?.click();
    else imageInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'word' | 'image') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, link: `[Đã tải lên: ${file.name}]`, type: type });
      showToast(`Đã nhận file ${file.name}!`);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      if (currentView === 'FAVORITES') return favorites.includes(item.id);
      if (currentView === 'LIST' && !selectedAge && !selectedField && addType === 'TEACHER') return true;
      if (addType === 'KID' && !item.isKidProduct) return false;
      if (addType === 'TEACHER' && item.isKidProduct) return false;
      const matchesAge = selectedAge ? item.ageGroup === selectedAge : true;
      const matchesField = selectedField ? item.field === selectedField : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAge && matchesField && matchesSearch;
    });
  }, [materials, selectedAge, selectedField, searchQuery, addType, currentView, favorites]);

  const handleSave = () => {
    if (!formData.name) return showToast('Cô điền tên đã nhé!', 'error');
    let updated;
    if (currentView === 'EDIT_MATERIAL' && selectedMaterial) {
      updated = materials.map(m => m.id === selectedMaterial.id ? { ...m, ...formData } : m);
    } else {
      const newId = Date.now().toString();
      const newItem: TeachingMaterial = { 
        ...formData, 
        id: newId, 
        qrCode: `MD-${newId.slice(-4)}`,
        isKidProduct: addType === 'KID'
      };
      updated = [newItem, ...materials];
    }
    setMaterials(updated);
    setCurrentView('LIST');
    showToast('Bông hoa đã được lưu và đồng bộ!');
  };

  // Fix: Added missing deleteMaterial function
  const deleteMaterial = (id: string) => {
    if (window.confirm('Cô có chắc chắn muốn xóa "bông hoa" này không?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
      setFavorites(prev => prev.filter(f => f !== id));
      setSelectedMaterial(null);
      setCurrentView('LIST');
      showToast('Đã xóa học liệu thành công!');
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans">
      {/* THÔNG BÁO */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[200] animate-fadeIn">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border-2 ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white'}`}>
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-xs uppercase tracking-wider">{toast.message}</span>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 py-3 sticky top-0 z-[100] shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentView('HOME')} className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg active:scale-90 transition-all">
            <HomeIcon className="w-5 h-5" />
          </button>
          <div className="h-6 w-[1px] bg-emerald-100 mx-1"></div>
          <button onClick={() => { setCurrentView('LIST'); setAddType('TEACHER'); setSelectedAge(null); }} className={`p-2 sm:p-2.5 rounded-2xl flex items-center space-x-2 transition-all ${currentView === 'LIST' && addType === 'TEACHER' ? 'bg-emerald-100 text-emerald-700' : 'text-emerald-600 hover:bg-emerald-50'}`}>
            <ListIcon className="w-5 h-5" />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Thư viện</span>
          </button>
          <button onClick={() => setCurrentView('FAVORITES')} className={`p-2 sm:p-2.5 rounded-2xl flex items-center space-x-2 transition-all ${currentView === 'FAVORITES' ? 'bg-rose-100 text-rose-600' : 'text-rose-400 hover:bg-rose-50'}`}>
            <Heart className="w-5 h-5 fill-current" />
            <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Yêu thích</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={handleRegisterGarden} className="flex items-center space-x-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-all">
            <User className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase">{gardenId || 'Đăng nhập Vườn'}</span>
          </button>
          <button onClick={() => { setFormData({ name: '', ageGroup: '3-4T', field: DevelopmentField.NHAN_THUC, description: '', link: '', qrCode: '', type: 'video' }); setCurrentView('ADD_MATERIAL'); }} className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition-all">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-sky-50/20">
        {currentView === 'HOME' && (
          <div className="relative min-h-full flex flex-col items-center">
            {/* BACKGROUND ELEMENTS */}
            <Sun className="absolute top-12 right-12 text-yellow-400 w-16 h-16 sm:w-24 sm:h-24 animate-pulse opacity-50" />
            
            <div className="text-center pt-10 sm:pt-16 z-40 px-6 max-w-4xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-700 text-handdrawn uppercase tracking-tight leading-none mb-4">Vườn Hoa Tài Nguyên Số</h1>
              <p className="text-emerald-600 font-black text-handdrawn text-sm sm:text-lg lg:text-xl uppercase tracking-[0.2em]">Trường Mầm Non Minh Đức</p>
              {gardenId && <div className="mt-4 inline-block px-4 py-1.5 bg-white/80 border border-emerald-200 rounded-full text-emerald-600 font-black text-xs uppercase shadow-sm animate-bounce">Đã đồng bộ: {gardenId} ✨</div>}
            </div>

            {/* GARDEN GRID - BALANCED AND CENTERED */}
            <div className="flex-1 w-full max-w-5xl mx-auto relative z-30 flex items-end justify-center px-6 pb-[12vh]">
              <div className="grid grid-cols-4 sm:grid-cols-7 items-end justify-items-center gap-x-2 sm:gap-x-4 w-full">
                
                {/* NHÀ TRẺ - BÔNG 1 */}
                <SketchFlower color="yellow" age="24-36T" stemHeight={140} onClick={() => { setSelectedAge('24-36T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
                
                {/* MẦM - BÔNG 2 */}
                <SketchFlower color="pink" age="3-4T" stemHeight={100} onClick={() => { setSelectedAge('3-4T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
                
                {/* SÁNG TẠO CHUNG - BÔNG 3 */}
                <SketchFlower color="rose" isCreative stemHeight={160} onClick={() => { setAddType('KID'); setSelectedAge(null); setCurrentView('LIST'); }} />
                
                {/* CHỒI - BÔNG 4 */}
                <SketchFlower color="purple" age="4-5T" stemHeight={120} onClick={() => { setSelectedAge('4-5T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
                
                {/* SÁNG TẠO CHỒI - BÔNG 5 */}
                <SketchFlower color="cyan" age="4-5T" isCreative stemHeight={140} onClick={() => { setAddType('KID'); setSelectedAge('4-5T'); setCurrentView('LIST'); }} />
                
                {/* LÁ - BÔNG 6 */}
                <SketchFlower color="green" age="5-6T" stemHeight={130} onClick={() => { setSelectedAge('5-6T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
                
                {/* SÁNG TẠO LÁ - BÔNG 7 */}
                <SketchFlower color="orange" age="5-6T" isCreative stemHeight={105} onClick={() => { setAddType('KID'); setSelectedAge('5-6T'); setCurrentView('LIST'); }} />
                
              </div>
            </div>

            <div className="ground-hill"></div>
            <CuteBee />
          </div>
        )}

        {/* LIST VIEW */}
        {(currentView === 'LIST' || currentView === 'FAVORITES') && (
          <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
            <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div className="flex items-center">
                <button onClick={() => setCurrentView('HOME')} className="mr-4 p-3 bg-white rounded-2xl shadow-sm hover:bg-emerald-50 transition-all"><ChevronLeft className="w-6 h-6" /></button>
                <h2 className="text-2xl font-black text-gray-700 uppercase tracking-tight">
                  {currentView === 'FAVORITES' ? '💖 Bài dạy yêu thích' : addType === 'KID' ? '🎨 Bé Sáng Tạo' : selectedAge ? AGE_LABELS[selectedAge] : '📚 Kho học liệu'}
                </h2>
              </div>
              <div className="bg-emerald-100/50 px-4 py-2 rounded-2xl text-emerald-700 font-black text-xs uppercase tracking-widest border border-emerald-100">
                {filteredMaterials.length} Bài dạy
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMaterials.map(item => (
                <div key={item.id} onClick={() => { setSelectedMaterial(item); setCurrentView('DETAIL'); }} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-emerald-50 group flex flex-col">
                  <div className={`h-36 flex items-center justify-center relative ${FIELD_COLORS[item.field].split(' ')[0]}`}>
                    <div className="transform group-hover:scale-110 transition-all duration-500">
                      {React.cloneElement(FIELD_ICONS[item.field] as React.ReactElement, { className: 'w-12 h-12' })}
                    </div>
                    <button 
                      onClick={e => { e.stopPropagation(); setFavorites(prev => prev.includes(item.id) ? prev.filter(f => f!==item.id) : [...prev, item.id]); }} 
                      className={`absolute top-4 right-4 p-2.5 rounded-2xl transition-all shadow-sm ${favorites.includes(item.id) ? 'bg-rose-500 text-white' : 'bg-white/90 text-gray-300'}`}
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-black text-gray-700 text-base line-clamp-2 leading-tight mb-4">{item.name}</h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-500 uppercase">{item.ageGroup}</span>
                      <span className="text-[9px] font-black text-emerald-500 uppercase truncate max-w-[120px]">{item.field}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETAIL VIEW */}
        {currentView === 'DETAIL' && selectedMaterial && (
          <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
            <button onClick={() => setCurrentView('LIST')} className="mb-6 flex items-center text-emerald-600 font-black uppercase text-xs hover:underline"><ChevronLeft className="w-4 h-4 mr-1" /> Quay lại</button>
            <div className="bg-white rounded-[48px] shadow-2xl p-8 sm:p-12 border border-emerald-50 flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <div className="flex space-x-2 mb-6">
                  <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedMaterial.field}</span>
                  <span className="px-4 py-1.5 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedMaterial.ageGroup}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-700 mb-8 leading-tight">{selectedMaterial.name}</h2>
                <p className="text-gray-500 text-base sm:text-lg mb-10 leading-relaxed font-medium">{selectedMaterial.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  {selectedMaterial.link && (
                    <a href={selectedMaterial.link} target="_blank" className="px-10 py-5 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-emerald-700 active:scale-95 transition-all flex items-center space-x-3">
                      <PlayCircle className="w-6 h-6" />
                      <span>Xem Tài Liệu</span>
                    </a>
                  )}
                  <button onClick={() => { setFormData(selectedMaterial as any); setCurrentView('EDIT_MATERIAL'); }} className="p-5 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-all"><Edit className="w-6 h-6" /></button>
                  <button onClick={() => deleteMaterial(selectedMaterial.id)} className="p-5 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-100 transition-all"><Trash2 className="w-6 h-6" /></button>
                </div>
              </div>
              <div className="lg:w-64 flex flex-col items-center justify-center bg-gray-50 rounded-[40px] p-10 border border-gray-100">
                <RealisticQRCode code={selectedMaterial.qrCode} />
                <span className="text-[10px] font-black text-gray-400 mt-6 uppercase tracking-[0.3em] text-center">Mã QR Học Liệu</span>
              </div>
            </div>
          </div>
        )}

        {/* ADD/EDIT VIEW */}
        {(currentView === 'ADD_MATERIAL' || currentView === 'EDIT_MATERIAL') && (
          <div className="p-6 max-w-2xl mx-auto animate-fadeIn">
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-emerald-50">
              <div className="p-6 bg-emerald-600 text-white text-center">
                <h2 className="font-black uppercase text-sm tracking-[0.3em]">{currentView === 'ADD_MATERIAL' ? 'Gieo mầm bông hoa mới' : 'Chăm sóc học liệu'}</h2>
              </div>
              <div className="p-8 sm:p-10 space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Tên bài giảng / Sản phẩm của bé</label>
                  <input type="text" placeholder="..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-200 outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Độ tuổi</label>
                    <select value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value as any})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none">
                      {Object.keys(AGE_LABELS).map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Lĩnh vực</label>
                    <select value={formData.field} onChange={e => setFormData({...formData, field: e.target.value as any})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none">
                      {Object.values(DevelopmentField).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Mô tả bài học</label>
                  <textarea placeholder="..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold h-28 resize-none border-none outline-none" />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 ml-1">Đường dẫn tài liệu / Tải file</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={() => handleFileUpload('word')} className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-600 rounded-2xl border-2 border-dashed border-blue-200 hover:bg-blue-100 transition-all font-black text-xs uppercase">
                      <FilePlus className="w-5 h-5" />
                      <span>Tải file Word</span>
                    </button>
                    <button onClick={() => handleFileUpload('image')} className="flex items-center justify-center space-x-2 p-4 bg-rose-50 text-rose-600 rounded-2xl border-2 border-dashed border-rose-200 hover:bg-rose-100 transition-all font-black text-xs uppercase">
                      <ImagePlus className="w-5 h-5" />
                      <span>Tải ảnh bé</span>
                    </button>
                  </div>
                  <input type="file" ref={wordInputRef} className="hidden" accept=".doc,.docx" onChange={(e) => onFileChange(e, 'word')} />
                  <input type="file" ref={imageInputRef} className="hidden" accept="image/*" onChange={(e) => onFileChange(e, 'image')} />
                  
                  <input type="url" placeholder="Hoặc dán Link tài liệu (YouTube, Drive...)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl font-bold border-none outline-none" />
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={() => setCurrentView('LIST')} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-gray-200 transition-all">Hủy</button>
                  <button onClick={handleSave} className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Lưu & Đồng bộ</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AGE FIELDS SELECTION */}
        {currentView === 'AGE_FIELDS' && (
          <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
            <header className="flex items-center mb-10">
              <button onClick={() => setCurrentView('HOME')} className="mr-6 p-4 bg-white rounded-2xl shadow-sm hover:bg-emerald-50 transition-all"><ChevronLeft className="w-6 h-6" /></button>
              <h2 className="text-3xl font-black text-gray-700 uppercase tracking-tight">{AGE_LABELS[selectedAge!]}</h2>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(DevelopmentField).map(f => (
                <button 
                  key={f} 
                  onClick={() => { setSelectedField(f); setCurrentView('LIST'); }} 
                  className={`p-10 rounded-[48px] border-2 flex flex-col items-center justify-center group hover:shadow-2xl transition-all active:scale-95 ${FIELD_COLORS[f]}`}
                >
                  <div className="transform group-hover:scale-125 transition-all duration-500 mb-6">
                    {React.cloneElement(FIELD_ICONS[f] as React.ReactElement, { className: 'w-16 h-16' })}
                  </div>
                  <span className="text-xl font-black text-gray-700 uppercase tracking-widest text-center">{f}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER - DEVICE STATUS */}
      <footer className="bg-white border-t border-emerald-50 px-6 py-2 flex items-center justify-between text-[8px] font-black uppercase text-gray-300 tracking-[0.2em]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1"><Monitor className="w-2.5 h-2.5" /> <span>Laptop</span></div>
          <div className="flex items-center space-x-1"><Smartphone className="w-2.5 h-2.5" /> <span>Mobile</span></div>
        </div>
        <div>Vườn Hoa Tài Nguyên Số v8.0 • Mầm Non Minh Đức</div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .text-handdrawn { font-family: 'Quicksand', sans-serif; letter-spacing: -0.02em; }
        
        /* Đảm bảo tỉ lệ hoa luôn chuẩn */
        @media (max-width: 640px) {
          .flower-animated { transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
};

export default App;
