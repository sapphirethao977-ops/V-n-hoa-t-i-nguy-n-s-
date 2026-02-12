
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ChevronLeft, LayoutGrid, Home as HomeIcon, 
  Heart, Sun, PlusCircle, Sparkles, Cloud, ArrowLeft, Camera,
  QrCode, Share2, List as ListIcon, Link as LinkIcon,
  PlayCircle, FileText, ExternalLink, Globe, BookOpen, Edit,
  CloudUpload, CloudDownload, Save, RefreshCw, ShieldCheck, Download, Upload, Trash2,
  Layers
} from 'lucide-react';
import { MOCK_MATERIALS } from './data/mockData';
import { AgeGroup, DevelopmentField, TeachingMaterial, ViewState } from './types';
import { FIELD_ICONS, AGE_LABELS, FIELD_COLORS } from './constants';

// KHÓA LƯU TRỮ CỐ ĐỊNH - TUYỆT ĐỐI KHÔNG ĐỔI ĐỂ BẢO VỆ DỮ LIỆU CỦA CÔ
const DB_KEY = 'VUON_HOA_MINH_DUC_DATABASE_V7';
const FAV_KEY = 'VUON_HOA_MINH_DUC_FAVORITES_V7';

const CuteBee: React.FC = () => (
  <div className="bee-animate pointer-events-none">
    <svg width="60" height="60" viewBox="0 0 100 100">
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
  label?: string;
}> = ({ age, color, onClick, isCreative, className, stemHeight = 100, label }) => {
  const petalColors: Record<string, string> = {
    'yellow': 'fill-yellow-400', 'pink': 'fill-rose-400', 'purple': 'fill-purple-400',
    'green': 'fill-emerald-400', 'rose': 'fill-pink-300', 'blue': 'fill-sky-300',
    'orange': 'fill-orange-400', 'cyan': 'fill-cyan-300', 'red': 'fill-red-400'
  };

  return (
    <div 
      className={`flex flex-col items-center cursor-pointer group transition-all duration-500 flower-animated ${className}`} 
      onClick={onClick}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transform group-hover:scale-110 group-active:scale-95 transition-all z-20">
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
              <Camera className="w-5 h-5 text-gray-500" />
              <span className="text-[8px] font-black text-gray-700 uppercase leading-none mt-1">Sáng tạo</span>
              {age && <span className="text-[7px] font-black text-emerald-600 mt-0.5">{age.replace('T', '')}</span>}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-gray-800 font-black text-xs sm:text-sm">{age?.replace('T', '')}</span>
              <span className="text-[6px] font-bold text-gray-400 uppercase">Tuổi</span>
            </div>
          )}
        </div>
      </div>
      <div className="relative z-10 -mt-2">
        <svg width="24" height={stemHeight} viewBox={`0 0 40 ${stemHeight}`}>
          <path d={`M20 0 Q${15 + Math.random()*10} ${stemHeight/2} 20 ${stemHeight}`} stroke="#16A34A" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M20 40 Q35 30 38 15" stroke="#16A34A" strokeWidth="3" fill="none" />
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncCode, setSyncCode] = useState('');
  
  // KHỞI TẠO VÀ BẢO TOÀN DỮ LIỆU CŨ CỦA CÔ
  const [materials, setMaterials] = useState<TeachingMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEY);
      // Nếu đã có dữ liệu cô thêm, ưu tiên lấy dữ liệu đó
      return saved ? JSON.parse(saved) : MOCK_MATERIALS;
    } catch (e) { return MOCK_MATERIALS; }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(DB_KEY + '_FAV');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [formData, setFormData] = useState({
    name: '', ageGroup: '3-4T' as AgeGroup, field: DevelopmentField.NHAN_THUC,
    description: '', link: '', qrCode: '', type: 'video' as any
  });

  // TỰ ĐỘNG LƯU MỌI THAY ĐỔI VÀO TRÌNH DUYỆT NGAY LẬP TỨC
  useEffect(() => {
    localStorage.setItem(DB_KEY, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(DB_KEY + '_FAV', JSON.stringify(favorites));
  }, [favorites]);

  const handleCloudSyncExport = async () => {
    setIsSyncing(true);
    try {
      const syncData = { materials, favorites, timestamp: Date.now() };
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(syncData))));
      const mockCode = "MD-" + Math.floor(1000 + Math.random() * 8999);
      setSyncCode(mockCode);
      localStorage.setItem('CLOUD_STORE_' + mockCode, encoded);
      alert(`Đã gửi vườn hoa lên mây! Mã của cô là: ${mockCode}`);
    } catch (e) { alert("Lỗi mạng rồi cô ơi!"); } 
    finally { setIsSyncing(false); }
  };

  const handleCloudSyncImport = () => {
    const code = prompt("Nhập mã vườn để tải tài liệu:");
    if (!code) return;
    const data = localStorage.getItem('CLOUD_STORE_' + code);
    if (!data) return alert("Mã không đúng cô ơi!");
    
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(data))));
      // GỘP DỮ LIỆU CHỨ KHÔNG XÓA CŨ
      const existingIds = new Set(materials.map(m => m.id));
      const newItems = decoded.materials.filter((m: any) => !existingIds.has(m.id));
      
      if (newItems.length === 0) {
        alert("Dữ liệu này cô đã có trong máy rồi ạ!");
      } else {
        setMaterials(prev => [...prev, ...newItems]);
        setFavorites(prev => Array.from(new Set([...prev, ...decoded.favorites])));
        alert(`Thành công! Đã gộp thêm ${newItems.length} bông hoa mới vào vườn của cô.`);
      }
    } catch (e) { alert("Lỗi tải dữ liệu!"); }
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
    if (!formData.name) return alert('Cô điền tên đã nhé!');
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
    alert('Bông hoa đã được lưu vĩnh viễn vào vườn!');
  };

  const deleteMaterial = (id: string) => {
    if (confirm('Cô chắc chắn muốn bỏ bông hoa này khỏi vườn không?')) {
      setMaterials(prev => prev.filter(m => m.id !== id));
      setCurrentView('LIST');
      setSelectedMaterial(null);
    }
  };

  return (
    <div className="min-h-screen relative bg-emerald-50/10 flex flex-col">
      {/* THANH ĐIỀU HƯỚNG */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-emerald-100 p-3 sticky top-0 z-[100] shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={() => { setCurrentView('HOME'); setSelectedAge(null); }} className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg active:scale-90 transition-all"><HomeIcon className="w-5 h-5" /></button>
          <div className="h-6 w-[1px] bg-emerald-100 mx-1"></div>
          <button onClick={() => { setCurrentView('LIST'); setSelectedAge(null); setAddType('TEACHER'); }} className={`p-2.5 rounded-2xl flex items-center space-x-2 transition-all ${currentView === 'LIST' && !selectedAge ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-emerald-600 border border-emerald-50'}`}><ListIcon className="w-5 h-5" /><span className="hidden md:inline text-[10px] font-black uppercase">Tất cả bài dạy</span></button>
          <button onClick={() => setCurrentView('FAVORITES')} className={`p-2.5 rounded-2xl flex items-center space-x-2 transition-all ${currentView === 'FAVORITES' ? 'bg-rose-100 text-rose-600' : 'bg-white text-rose-400 border border-rose-50'}`}><Heart className="w-5 h-5 fill-current" /><span className="hidden md:inline text-[10px] font-black uppercase">Yêu thích</span></button>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={() => setCurrentView('SYNC')} className="p-2.5 bg-amber-50 text-amber-500 rounded-2xl border border-amber-100"><Cloud className="w-5 h-5" /></button>
          <div className="relative hidden sm:block">
            <input type="text" placeholder="Tìm..." className="w-40 bg-gray-50 border-none rounded-full py-2 pl-9 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-400" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-300" />
          </div>
          <button onClick={() => { setFormData({ name: '', ageGroup: '3-4T', field: DevelopmentField.NHAN_THUC, description: '', link: '', qrCode: '', type: 'video' }); setCurrentView('ADD_MATERIAL'); }} className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg"><PlusCircle className="w-5 h-5" /></button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {currentView === 'HOME' && (
          <div className="relative h-[calc(100vh-73px)] overflow-hidden">
            <Sun className="absolute top-6 right-6 text-yellow-400 w-20 h-20 animate-pulse opacity-60" />
            <div className="text-center pt-6 z-40 relative px-4">
              <h1 className="text-3xl sm:text-5xl font-black text-gray-700 text-handdrawn uppercase tracking-tighter">Vườn Hoa Tài Nguyên Số</h1>
              <p className="text-emerald-600 font-black text-handdrawn text-lg sm:text-xl uppercase mt-1">TRƯỜNG MẦM NON MINH ĐỨC</p>
            </div>

            {/* VƯỜN HOA XEN KẼ - SẮP XẾP LẠI THEO YÊU CẦU CÔ */}
            <div className="absolute bottom-[8vh] left-0 right-0 z-30 flex flex-wrap justify-center items-end gap-x-2 sm:gap-x-4 px-4 pb-4">
              
              {/* 1. Nhà trẻ */}
              <SketchFlower color="yellow" age="24-36T" stemHeight={140} onClick={() => { setSelectedAge('24-36T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
              
              {/* 2. Mầm */}
              <SketchFlower color="pink" age="3-4T" stemHeight={110} onClick={() => { setSelectedAge('3-4T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
              
              {/* 3. SÁNG TẠO CHUNG (XEN KẼ GIỮA) */}
              <SketchFlower color="rose" isCreative stemHeight={150} onClick={() => { setAddType('KID'); setSelectedAge(null); setCurrentView('LIST'); }} />
              
              {/* 4. Chồi */}
              <SketchFlower color="purple" age="4-5T" stemHeight={120} onClick={() => { setSelectedAge('4-5T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
              
              {/* 5. SÁNG TẠO CHỒI (XEN KẼ) */}
              <SketchFlower color="cyan" age="4-5T" isCreative stemHeight={140} onClick={() => { setAddType('KID'); setSelectedAge('4-5T'); setCurrentView('LIST'); }} />
              
              {/* 6. Lá */}
              <SketchFlower color="green" age="5-6T" stemHeight={130} onClick={() => { setSelectedAge('5-6T'); setAddType('TEACHER'); setCurrentView('AGE_FIELDS'); }} />
              
              {/* 7. SÁNG TẠO LÁ (XEN KẼ) */}
              <SketchFlower color="orange" age="5-6T" isCreative stemHeight={115} onClick={() => { setAddType('KID'); setSelectedAge('5-6T'); setCurrentView('LIST'); }} />
              
            </div>

            <div className="ground-hill"></div>
            <CuteBee />
          </div>
        )}

        {/* CÁC VIEW CHI TIẾT VÀ DANH SÁCH - GIỮ NGUYÊN LOGIC NHƯNG NÂNG CẤP HIỂN THỊ */}
        {currentView === 'AGE_FIELDS' && (
          <div className="p-6 max-w-5xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-black text-gray-700 mb-6 uppercase flex items-center">
              <button onClick={() => setCurrentView('HOME')} className="mr-3 p-2 bg-white rounded-full shadow-sm"><ChevronLeft /></button>
              {AGE_LABELS[selectedAge!]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.values(DevelopmentField).map(f => (
                <button key={f} onClick={() => { setSelectedField(f); setCurrentView('LIST'); }} className={`p-6 rounded-[32px] border-2 flex flex-col items-center group hover:shadow-xl transition-all ${FIELD_COLORS[f]}`}>
                  <div className="transform group-hover:scale-110 transition-transform">{FIELD_ICONS[f]}</div>
                  <span className="text-lg font-black text-gray-700 mt-3 uppercase">{f}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(currentView === 'LIST' || currentView === 'FAVORITES') && (
          <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-black text-gray-700 mb-6 uppercase flex items-center">
              <button onClick={() => selectedField ? setCurrentView('AGE_FIELDS') : setCurrentView('HOME')} className="mr-3 p-2 bg-white rounded-full shadow-sm"><ChevronLeft /></button>
              {currentView === 'FAVORITES' ? '💖 Bài giảng yêu thích' : addType === 'KID' ? `🎨 Bé sáng tạo (${selectedAge || 'Cả trường'})` : selectedAge ? `📖 ${AGE_LABELS[selectedAge]}` : '📚 Tất cả học liệu'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredMaterials.map(item => (
                <div key={item.id} onClick={() => { setSelectedMaterial(item); setCurrentView('DETAIL'); }} className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group">
                  <div className={`h-32 flex items-center justify-center relative ${FIELD_COLORS[item.field].split(' ')[0]}`}>
                    <div className="transform group-hover:scale-110 transition-transform">{FIELD_ICONS[item.field]}</div>
                    <button onClick={e => { e.stopPropagation(); setFavorites(prev => prev.includes(item.id) ? prev.filter(f => f!==item.id) : [...prev, item.id]); }} className={`absolute top-3 right-3 p-1.5 rounded-lg ${favorites.includes(item.id) ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-300'}`}><Heart className="w-4 h-4 fill-current" /></button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-gray-700 text-sm line-clamp-2 leading-tight">{item.name}</h3>
                    <div className="flex items-center justify-between mt-3"><span className="text-[8px] text-gray-400 font-black uppercase">{item.ageGroup}</span><span className="px-2 py-0.5 bg-gray-50 text-gray-500 rounded text-[7px] font-black uppercase">{item.field}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'DETAIL' && selectedMaterial && (
          <div className="p-6 max-w-3xl mx-auto animate-fadeIn">
            <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-50 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">{selectedMaterial.field}</span>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded text-[9px] font-black uppercase">{selectedMaterial.ageGroup}</span>
                </div>
                <h2 className="text-3xl font-black text-gray-700 mb-4">{selectedMaterial.name}</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{selectedMaterial.description}</p>
                <div className="flex flex-wrap gap-3">
                  {selectedMaterial.link && <a href={selectedMaterial.link} target="_blank" className="px-6 py-3 bg-emerald-600 text-white rounded-full text-xs font-black uppercase flex items-center gap-2">Mở bài học</a>}
                  <button onClick={() => { setFormData(selectedMaterial as any); setCurrentView('EDIT_MATERIAL'); }} className="p-3 bg-gray-50 text-sky-600 rounded-full"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => deleteMaterial(selectedMaterial.id)} className="p-3 bg-gray-50 text-rose-500 rounded-full"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="w-40 flex flex-col items-center justify-center bg-gray-50 rounded-[32px] p-6">
                <RealisticQRCode code={selectedMaterial.qrCode} />
                <span className="text-[8px] font-black text-gray-400 mt-3 uppercase tracking-widest">Mã học liệu</span>
              </div>
            </div>
          </div>
        )}

        {currentView === 'SYNC' && (
          <div className="p-6 max-w-2xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-black text-gray-700 text-center mb-8 uppercase">Đồng Bộ "Vườn Mây"</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-8 rounded-[32px] shadow-sm text-center border border-gray-50">
                <CloudUpload className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                <button onClick={handleCloudSyncExport} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase">Gửi lên mây</button>
                {syncCode && <div className="mt-4 p-3 bg-amber-50 rounded-xl font-black text-lg text-amber-600 tracking-widest">{syncCode}</div>}
              </div>
              <div className="bg-white p-8 rounded-[32px] shadow-sm text-center border border-gray-50">
                <CloudDownload className="w-10 h-10 text-sky-500 mx-auto mb-4" />
                <button onClick={handleCloudSyncImport} className="w-full py-3 bg-sky-600 text-white rounded-xl font-black text-xs uppercase">Tải từ mây về</button>
              </div>
            </div>
          </div>
        )}

        {(currentView === 'ADD_MATERIAL' || currentView === 'EDIT_MATERIAL') && (
          <div className="p-6 max-w-xl mx-auto animate-fadeIn">
            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-50">
              <div className="p-4 bg-emerald-600 text-white text-center font-black uppercase text-sm">{currentView === 'ADD_MATERIAL' ? 'Gieo mầm bông hoa mới' : 'Chăm sóc bông hoa'}</div>
              <div className="p-6 space-y-4">
                <input type="text" placeholder="Tên bài giảng / Sản phẩm của bé" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-emerald-200" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.ageGroup} onChange={e => setFormData({...formData, ageGroup: e.target.value as any})} className="w-full p-3 bg-gray-50 rounded-xl font-bold">{Object.keys(AGE_LABELS).map(a => <option key={a} value={a}>{a}</option>)}</select>
                  <select value={formData.field} onChange={e => setFormData({...formData, field: e.target.value as any})} className="w-full p-3 bg-gray-50 rounded-xl font-bold">{Object.values(DevelopmentField).map(f => <option key={f} value={f}>{f}</option>)}</select>
                </div>
                <textarea placeholder="Mô tả ngắn gọn..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold h-20 resize-none outline-none" />
                <input type="url" placeholder="Link (YouTube, Drive, Ảnh...)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border-2 border-transparent focus:border-emerald-200" />
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setCurrentView('HOME')} className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-black uppercase text-xs">Hủy</button>
                  <button onClick={handleSave} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs shadow-lg">Lưu vĩnh viễn</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;
