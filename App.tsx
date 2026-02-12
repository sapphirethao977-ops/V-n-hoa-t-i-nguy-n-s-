
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ChevronLeft, LayoutGrid, Home as HomeIcon, 
  Heart, Sun, PlusCircle, Sparkles, Cloud, ArrowLeft, Camera,
  QrCode, Share2, List as ListIcon, Link as LinkIcon,
  PlayCircle, FileText, ExternalLink, Globe, BookOpen
} from 'lucide-react';
import { MOCK_MATERIALS } from './data/mockData';
import { AgeGroup, DevelopmentField, TeachingMaterial, ViewState } from './types';
import { FIELD_ICONS, AGE_LABELS, FIELD_COLORS } from './constants';

// KHÓA LƯU TRỮ VĨNH VIỄN - KHÔNG THAY ĐỔI
const MASTER_STORAGE_KEY = 'VUON_HOA_MINH_DUC_PERMANENT_STORAGE';
const MASTER_FAVORITES_KEY = 'VUON_HOA_MINH_DUC_FAVORITES';

const CuteBee: React.FC = () => (
  <div className="bee-animate pointer-events-none">
    <svg width="70" height="70" viewBox="0 0 100 100">
      <ellipse cx="50" cy="55" rx="30" ry="22" fill="#FACC15" stroke="#422006" strokeWidth="2.5" />
      <path d="M35 38 Q50 35 65 38" fill="none" stroke="#422006" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 55 Q50 52 70 55" fill="none" stroke="#422006" strokeWidth="6" strokeLinecap="round" />
      <path d="M35 70 Q50 67 65 70" fill="none" stroke="#422006" strokeWidth="5" strokeLinecap="round" />
      <g opacity="0.7">
        <ellipse cx="40" cy="35" rx="14" ry="10" fill="#E0F2FE" stroke="white" strokeWidth="1.5" transform="rotate(-30, 40, 35)" />
        <ellipse cx="60" cy="35" rx="14" ry="10" fill="#E0F2FE" stroke="white" strokeWidth="1.5" transform="rotate(30, 60, 35)" />
      </g>
      <circle cx="68" cy="50" r="3.5" fill="#422006" />
      <path d="M72 55 Q76 58 72 61" fill="none" stroke="#422006" strokeWidth="2" strokeLinecap="round" />
      <path d="M65 42 Q75 35 78 40" fill="none" stroke="#422006" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="78" cy="40" r="2" fill="#422006" />
      <path d="M22 55 L15 55" stroke="#422006" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

const CuteButterfly: React.FC = () => (
  <div className="butterfly-animate pointer-events-none">
    <svg width="70" height="70" viewBox="0 0 100 100">
      <path d="M50 50 Q30 20 10 40 Q10 60 50 55" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
      <path d="M50 50 Q70 20 90 40 Q90 60 50 55" fill="#F472B6" stroke="#BE185D" strokeWidth="1" />
      <path d="M50 50 Q35 75 20 65 Q15 55 50 55" fill="#FB923C" stroke="#C2410C" strokeWidth="1" />
      <path d="M50 50 Q65 75 80 65 Q85 55 50 55" fill="#FB923C" stroke="#C2410C" strokeWidth="1" />
      <rect x="48" y="35" width="4" height="35" rx="2" fill="#422006" />
      <circle cx="45" cy="32" r="1" fill="#422006" />
      <circle cx="55" cy="32" r="1" fill="#422006" />
    </svg>
  </div>
);

const RealisticQRCode: React.FC<{ code: string }> = ({ code }) => (
  <div className="bg-white p-2 border-2 border-gray-100 rounded-xl shadow-inner flex flex-col items-center">
    <div className="grid grid-cols-5 gap-1 w-16 h-16">
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} className={`w-full h-full rounded-[1px] ${Math.random() > 0.4 ? 'bg-gray-800' : 'bg-transparent'}`}></div>
      ))}
    </div>
    <span className="text-[8px] font-black mt-2 text-emerald-600 tracking-tighter">{code}</span>
  </div>
);

const SketchFlower: React.FC<{ 
  age?: AgeGroup; 
  color: string; 
  onClick: () => void;
  isCreative?: boolean;
  className?: string;
  stemHeight?: number;
  delay?: number;
}> = ({ age, color, onClick, isCreative, className, stemHeight = 100, delay = 0 }) => {
  const petalColors: Record<string, string> = {
    'yellow': 'fill-yellow-400',
    'pink': 'fill-rose-400',
    'purple': 'fill-purple-400',
    'green': 'fill-emerald-400',
    'rose': 'fill-pink-300',
    'blue': 'fill-sky-300',
    'orange': 'fill-orange-400',
    'cyan': 'fill-cyan-300',
    'red': 'fill-red-400'
  };

  return (
    <div 
      className={`flex flex-col items-center cursor-pointer group transition-all duration-300 flower-animated ${className}`} 
      onClick={onClick}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center transform group-hover:scale-110 transition-transform z-20">
        <svg viewBox="0 0 100 100" className="absolute w-full h-full drop-shadow-md petals-animated" style={{ animationDelay: `${delay * 0.5}s` }}>
          <g>
            {[0, 72, 144, 216, 288].map((deg) => (
              isCreative ? (
                <path 
                  key={deg}
                  d="M50 50 Q40 25 50 10 Q60 25 50 50"
                  className={petalColors[color]}
                  transform={`rotate(${deg}, 50, 50)`}
                  stroke="white"
                  strokeWidth="1"
                />
              ) : (
                <circle 
                  key={deg}
                  cx="50" cy="28" r="20"
                  className={petalColors[color]}
                  transform={`rotate(${deg}, 50, 50)`}
                  stroke="white"
                  strokeWidth="1.5"
                />
              )
            ))}
          </g>
          <circle cx="50" cy="50" r="18" fill="white" stroke="#F3F4F6" strokeWidth="1" />
          <circle cx="50" cy="50" r="12" fill="#FEF08A" opacity="0.4" />
        </svg>
        <div className="z-30 text-center flex flex-col items-center select-none">
          {isCreative ? (
            <div className="flex flex-col items-center">
               <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 mb-0.5" />
               <span className="text-[6px] sm:text-[7px] font-black text-rose-400 uppercase leading-none">Sáng tạo</span>
            </div>
          ) : (
            <>
              <span className="text-gray-800 font-black text-xs sm:text-sm leading-none">{age === '24-36T' ? '24-36' : age?.replace('T', '')}</span>
              <span className="text-gray-500 font-bold text-[7px] sm:text-[8px] tracking-tight uppercase leading-none mt-1">{age === '24-36T' ? 'Tháng' : 'Tuổi'}</span>
            </>
          )}
        </div>
      </div>
      
      <div className="relative z-10 -mt-2">
        <svg width="30" height={stemHeight} viewBox={`0 0 40 ${stemHeight}`}>
          <path 
            d={`M20 0 Q${20} ${stemHeight/2} 20 ${stemHeight}`} 
            stroke="#16A34A" 
            strokeWidth="4" 
            fill="none" 
            strokeLinecap="round" 
          />
          <path d="M20 20 Q5 5 5 35 Q15 40 20 20" fill="#22C55E" />
          <path d="M20 45 Q35 30 35 60 Q25 65 20 45" fill="#4ADE80" />
        </svg>
      </div>
    </div>
  );
};

const getLinkSourceInfo = (url: string) => {
  if (!url) return { name: 'Học liệu', icon: <ExternalLink className="w-5 h-5" />, color: 'bg-emerald-600' };
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return { name: 'YouTube', icon: <PlayCircle className="w-5 h-5" />, color: 'bg-red-600' };
  }
  if (lowerUrl.includes('drive.google.com')) {
    return { name: 'Google Drive', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-600' };
  }
  if (lowerUrl.includes('canva.com')) {
    return { name: 'Canva', icon: <Globe className="w-5 h-5" />, color: 'bg-indigo-500' };
  }
  if (lowerUrl.includes('heyzin.com')) {
    return { name: 'Heyzin Flipbook', icon: <BookOpen className="w-5 h-5" />, color: 'bg-amber-600' };
  }
  return { name: 'Liên kết', icon: <ExternalLink className="w-5 h-5" />, color: 'bg-emerald-600' };
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedField, setSelectedField] = useState<DevelopmentField | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<TeachingMaterial | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [addType, setAddType] = useState<'TEACHER' | 'KID'>('TEACHER');
  
  // Nạp dữ liệu BAN ĐẦU từ localStorage ngay khi mở App
  const [materials, setMaterials] = useState<TeachingMaterial[]>(() => {
    try {
      const saved = localStorage.getItem(MASTER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : MOCK_MATERIALS;
    } catch (e) {
      console.error("Lỗi khi đọc dữ liệu:", e);
      return MOCK_MATERIALS;
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(MASTER_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    ageGroup: '3-4T' as AgeGroup,
    field: DevelopmentField.NHAN_THUC,
    description: '',
    link: '',
    type: 'video' as 'video' | 'image' | 'file' | 'audio' | 'word' | 'excel' | 'pdf'
  });

  // TỰ ĐỘNG LƯU PHỤ TRỢ (Khi state thay đổi)
  useEffect(() => {
    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem(MASTER_FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter(item => {
      if (addType === 'KID' && !item.isKidProduct) return false;
      if (addType === 'TEACHER' && item.isKidProduct) return false;
      const matchesAge = selectedAge ? item.ageGroup === selectedAge : true;
      const matchesField = selectedField ? item.field === selectedField : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesAge && matchesField && matchesSearch;
    });
  }, [materials, selectedAge, selectedField, searchQuery, addType]);

  const favoriteMaterials = useMemo(() => {
    return materials.filter(item => favorites.includes(item.id));
  }, [materials, favorites]);

  const goHome = () => { 
    setCurrentView('HOME'); 
    setSelectedAge(null); 
    setSelectedField(null); 
    setSelectedMaterial(null); 
    setAddType('TEACHER');
  };

  // HÀM LƯU QUAN TRỌNG: Lưu ngay lập tức
  const handleSaveMaterial = () => {
    if (!formData.name || !formData.description) {
      alert('Cô ơi, vui lòng điền đủ Tên và Mô tả ạ!');
      return;
    }

    const newId = Date.now().toString();
    const newMaterial: TeachingMaterial = {
      ...formData,
      id: newId,
      qrCode: `MD-${newId.slice(-4)}-${formData.field.slice(0, 2).toUpperCase()}`,
      isKidProduct: addType === 'KID'
    };

    const updatedMaterials = [newMaterial, ...materials];
    
    // 1. Cập nhật giao diện (State)
    setMaterials(updatedMaterials);
    
    // 2. LƯU VĨNH VIỄN VÀO BỘ NHỚ NGAY LẬP TỨC
    localStorage.setItem(MASTER_STORAGE_KEY, JSON.stringify(updatedMaterials));
    
    alert('Thành công! Bài dạy đã được lưu vĩnh viễn vào bộ nhớ của máy này.');
    
    // Reset form
    setFormData({
      name: '',
      ageGroup: '3-4T',
      field: DevelopmentField.NHAN_THUC,
      description: '',
      link: '',
      type: 'video'
    });
    
    setCurrentView('LIST');
  };

  const handleShare = (material: TeachingMaterial) => {
    const shareUrl = `${window.location.origin}/material/${material.id}`;
    if (navigator.share) {
      navigator.share({ title: material.name, text: material.description, url: shareUrl }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Đã sao chép liên kết!');
    }
  };

  const renderNavigation = () => (
    <div className="bg-white/90 backdrop-blur-md border-b border-emerald-100 p-3 sticky top-0 z-[100] shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button onClick={goHome} className={`p-2.5 rounded-2xl shadow-lg transition-all flex items-center space-x-2 ${currentView === 'HOME' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-100'}`}>
          <HomeIcon className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-black uppercase">Trang chủ</span>
        </button>
        <button onClick={() => { setSelectedAge(null); setSelectedField(null); setAddType('TEACHER'); setCurrentView('LIST'); }} className={`p-2.5 rounded-2xl shadow-lg transition-all flex items-center space-x-2 ${currentView === 'LIST' && addType === 'TEACHER' ? 'bg-sky-600 text-white' : 'bg-white text-sky-600 border border-sky-100'}`}>
          <ListIcon className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-black uppercase">Bài dạy</span>
        </button>
        <button onClick={() => setCurrentView('FAVORITES')} className={`p-2.5 rounded-2xl shadow-lg transition-all flex items-center space-x-2 ${currentView === 'FAVORITES' ? 'bg-rose-500 text-white' : 'bg-white text-rose-500 border border-rose-100'}`}>
          <Heart className={`w-5 h-5 ${currentView === 'FAVORITES' ? 'fill-white' : ''}`} />
          <span className="hidden md:inline text-xs font-black uppercase">Yêu thích</span>
        </button>
      </div>
      <div className="flex items-center space-x-3 flex-1 justify-end">
        <div className="relative w-full max-w-[140px] sm:max-w-xs">
          <input type="text" placeholder="Tìm kiếm..." className="w-full bg-white border border-emerald-100 rounded-full py-2 pl-9 pr-4 text-xs font-bold focus:ring-2 focus:ring-emerald-400 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-emerald-400" />
        </div>
        <button onClick={() => { setAddType('TEACHER'); setCurrentView('ADD_MATERIAL'); }} className="p-2.5 bg-emerald-500 text-white rounded-2xl shadow-lg flex items-center space-x-2 hover:bg-emerald-600 transition-all">
          <PlusCircle className="w-5 h-5" />
          <span className="hidden sm:inline text-xs font-black uppercase">Gieo mầm</span>
        </button>
      </div>
    </div>
  );

  const renderHomeView = () => {
    // 8 BÔNG HOA XEN KẼ VÀ ĐUNG ĐƯA
    const flowers = [
      { type: 'age', age: '24-36T', color: 'yellow', stem: 150, delay: 0 },
      { type: 'creative', color: 'rose', stem: 110, delay: 0.8 },
      { type: 'age', age: '3-4T', color: 'pink', stem: 140, delay: 1.6 },
      { type: 'creative', color: 'orange', stem: 120, delay: 0.4 },
      { type: 'age', age: '4-5T', color: 'purple', stem: 165, delay: 1.2 },
      { type: 'creative', color: 'cyan', stem: 105, delay: 2.0 },
      { type: 'age', age: '5-6T', color: 'green', stem: 135, delay: 0.6 },
      { type: 'creative', color: 'red', stem: 155, delay: 1.4 },
    ];

    return (
      <div className="relative h-[calc(100vh-73px)] overflow-hidden">
        <Sun className="absolute top-6 right-6 text-yellow-400 w-24 h-24 fill-yellow-100 opacity-90 blur-[1px] animate-pulse" />
        <Cloud className="absolute top-12 left-12 text-white w-28 h-28 fill-white opacity-60" />
        <CuteBee />
        <CuteButterfly />

        <div className="text-center pt-8 pb-2 relative z-40 px-4 select-none">
          <h1 className="text-4xl sm:text-6xl font-black text-gray-700 tracking-tighter text-handdrawn uppercase">Vườn Hoa Tài Nguyên Số</h1>
          <h2 className="text-2xl sm:text-4xl font-bold text-emerald-600 tracking-wide text-handdrawn mt-1 uppercase">TRƯỜNG MẦM NON MINH ĐỨC</h2>
          <div className="mt-2 w-32 h-1.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Vườn hoa 8 bông xếp xen kẽ, tất cả đều đung đưa trong gió */}
        <div className="absolute bottom-[10vh] left-0 right-0 z-30 flex flex-wrap justify-center items-end px-2 sm:px-10 gap-x-1 sm:gap-x-4 lg:gap-x-6 max-w-7xl mx-auto">
          {flowers.map((f, idx) => (
            <SketchFlower 
              key={idx}
              isCreative={f.type === 'creative'}
              age={f.age as AgeGroup}
              color={f.color}
              stemHeight={f.stem}
              delay={f.delay}
              onClick={() => {
                if (f.type === 'age') {
                  setSelectedAge(f.age as AgeGroup);
                  setAddType('TEACHER');
                  setCurrentView('AGE_FIELDS');
                } else {
                  setAddType('KID');
                  setSelectedAge(null);
                  setCurrentView('LIST');
                }
              }}
            />
          ))}
        </div>

        <div className="ground-hill"></div>
        <div className="fixed bottom-6 right-6 z-[100]">
          <button onClick={() => { setAddType('KID'); setCurrentView('ADD_MATERIAL'); }} className="bg-rose-500 text-white p-4 rounded-full shadow-2xl flex flex-col items-center border-4 border-white hover:scale-110 transition-all group">
            <Camera className="w-8 h-8 mb-1 group-hover:rotate-12" />
            <span className="text-[9px] font-black tracking-tighter uppercase">SP của trẻ</span>
          </button>
        </div>
      </div>
    );
  };

  const renderAgeFieldsView = () => (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto animate-fadeIn">
      <div className="flex items-center space-x-3 mb-8">
        <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-emerald-100 rounded-full transition-colors">
          <ChevronLeft className="w-8 h-8 text-emerald-600" />
        </button>
        <h2 className="text-3xl font-black text-gray-700 tracking-tight">{selectedAge ? AGE_LABELS[selectedAge] : ''}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(DevelopmentField).map((field) => (
          <button key={field} onClick={() => { setSelectedField(field); setCurrentView('LIST'); }} className={`flex flex-col items-center p-8 rounded-[40px] border-4 transition-all hover:scale-105 shadow-xl ${FIELD_COLORS[field]}`}>
            <div className="mb-4 transform group-hover:rotate-12 transition-transform">{FIELD_ICONS[field]}</div>
            <span className="text-xl font-black text-gray-700">{field}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <button onClick={() => selectedField ? setCurrentView('AGE_FIELDS') : setCurrentView('HOME')} className="p-2 hover:bg-emerald-100 rounded-full transition-colors">
            <ChevronLeft className="w-8 h-8 text-emerald-600" />
          </button>
          <div><h2 className="text-3xl font-black text-gray-700 uppercase tracking-tighter">{addType === 'KID' ? 'Sáng tạo của bé' : 'Kho bài dạy của cô'}</h2></div>
        </div>
      </div>
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-gray-200">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">Gieo mầm ngay cô nhé...</p>
          <button onClick={goHome} className="mt-4 text-emerald-600 font-black underline uppercase">Về trang chủ</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMaterials.map((item) => (
            <div key={item.id} onClick={() => { setSelectedMaterial(item); setCurrentView('DETAIL'); }} className="group bg-white rounded-[32px] overflow-hidden shadow-lg border-2 border-transparent hover:border-emerald-200 transition-all hover:-translate-y-2 cursor-pointer flex flex-col">
              <div className={`h-40 relative flex items-center justify-center ${FIELD_COLORS[item.field].split(' ')[0]}`}>
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl">{FIELD_ICONS[item.field]}</div>
                 <button onClick={(e) => toggleFavorite(e, item.id)} className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-md transition-all ${favorites.includes(item.id) ? 'bg-rose-500 text-white' : 'bg-white text-gray-300 hover:text-rose-400'}`}>
                   <Heart className={`w-5 h-5 ${favorites.includes(item.id) ? 'fill-white' : ''}`} />
                 </button>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.field} • {item.ageGroup}</span>
                <h3 className="text-lg font-black text-gray-700 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">{item.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{item.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                   <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${item.isKidProduct ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>{item.isKidProduct ? 'Sáng tạo' : 'Học liệu'}</span>
                   <span className="text-[10px] font-black text-emerald-600">CHI TIẾT →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavoritesView = () => (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex items-center space-x-3 mb-8">
        <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-emerald-100 rounded-full transition-colors"><ChevronLeft className="w-8 h-8 text-emerald-600" /></button>
        <h2 className="text-3xl font-black text-rose-600 tracking-tight uppercase flex items-center"><Heart className="w-8 h-8 mr-2 fill-rose-600" /> Yêu thích của cô</h2>
      </div>
      {favoriteMaterials.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-rose-100"><Heart className="w-16 h-16 text-rose-200 mx-auto mb-4" /><p className="text-xl font-bold text-gray-400 uppercase tracking-widest">Cô chưa có bài yêu thích ạ</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteMaterials.map((item) => (
            <div key={item.id} onClick={() => { setSelectedMaterial(item); setCurrentView('DETAIL'); }} className="group bg-white rounded-[32px] overflow-hidden shadow-lg border-2 border-transparent hover:border-rose-200 transition-all hover:-translate-y-2 cursor-pointer flex flex-col">
              <div className={`h-40 relative flex items-center justify-center ${FIELD_COLORS[item.field].split(' ')[0]}`}>
                 <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-xl">{FIELD_ICONS[item.field]}</div>
                 <button onClick={(e) => toggleFavorite(e, item.id)} className="absolute top-4 right-4 p-2.5 rounded-xl shadow-md bg-rose-500 text-white"><Heart className="w-5 h-5 fill-white" /></button>
              </div>
              <div className="p-5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.field}</span>
                <h3 className="text-lg font-black text-gray-700 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDetailView = () => {
    if (!selectedMaterial) return null;
    const linkInfo = getLinkSourceInfo(selectedMaterial.link);
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto animate-fadeIn">
        <button onClick={() => setCurrentView('LIST')} className="flex items-center space-x-2 text-emerald-600 font-black uppercase text-xs mb-6 hover:translate-x-[-5px] transition-transform"><ArrowLeft className="w-4 h-4" /> <span>Quay lại</span></button>
        <div className="bg-white rounded-[48px] overflow-hidden shadow-2xl border-4 border-white">
          <div className={`p-8 sm:p-12 ${FIELD_COLORS[selectedMaterial.field].split(' ')[0]}`}>
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm">{FIELD_ICONS[selectedMaterial.field]}</div>
                  <span className="px-4 py-1.5 bg-white text-emerald-600 rounded-full text-[10px] font-black uppercase">{selectedMaterial.field}</span>
                  <span className="px-4 py-1.5 bg-white text-sky-600 rounded-full text-[10px] font-black uppercase">{AGE_LABELS[selectedMaterial.ageGroup]}</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-gray-700 mb-6">{selectedMaterial.name}</h2>
                <p className="text-lg text-gray-600 font-medium mb-8">{selectedMaterial.description}</p>
                <div className="flex flex-wrap gap-4">
                  {selectedMaterial.link && <a href={selectedMaterial.link} target="_blank" rel="noopener noreferrer" className={`px-8 py-4 ${linkInfo.color} text-white rounded-full font-black uppercase tracking-widest flex items-center space-x-3 hover:scale-105 transition-all shadow-xl`}>{linkInfo.icon}<span>Mở học liệu</span></a>}
                  <button onClick={() => handleShare(selectedMaterial)} className="p-4 bg-white text-gray-700 rounded-full shadow-lg border-2 border-gray-50 flex items-center hover:bg-gray-50 transition-all"><Share2 className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="w-full md:w-64 flex flex-col items-center">
                <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-emerald-100 flex flex-col items-center"><RealisticQRCode code={selectedMaterial.qrCode} /><span className="text-[10px] font-black text-gray-400 mt-4 uppercase">MÃ TRUY CẬP</span><div className="mt-4 p-2 bg-emerald-50 rounded-xl"><QrCode className="w-6 h-6 text-emerald-600" /></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAddMaterialView = () => (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto animate-fadeIn flex items-center justify-center min-h-full">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-4 border-emerald-50 w-full max-h-[85vh] flex flex-col">
        <div className={`p-6 sm:p-8 ${addType === 'TEACHER' ? 'bg-emerald-600' : 'bg-rose-500'} text-white text-center shrink-0`}>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 border-4 border-white/40">{addType === 'TEACHER' ? <PlusCircle className="w-8 h-8" /> : <Camera className="w-8 h-8" />}</div>
          <h2 className="text-2xl font-black uppercase">{addType === 'TEACHER' ? 'Gieo mầm bài dạy' : 'Lưu sản phẩm của bé'}</h2>
          <p className="text-xs opacity-90 font-bold mt-1">Lưu trữ vĩnh viễn không lo mất bài cô nhé!</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
          <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-1">Tên nội dung</label><input type="text" placeholder="Nhập tên..." value={formData.name} onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-400 font-bold transition-all" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-1">Độ tuổi</label><select value={formData.ageGroup} onChange={(e) => setFormData(prev => ({...prev, ageGroup: e.target.value as AgeGroup}))} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold">{Object.entries(AGE_LABELS).map(([key, label]) => (<option key={key} value={key}>{label}</option>))}</select></div>
            <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-1">Lĩnh vực</label><select value={formData.field} onChange={(e) => setFormData(prev => ({...prev, field: e.target.value as DevelopmentField}))} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold">{Object.values(DevelopmentField).map((f) => (<option key={f} value={f}>{f}</option>))}</select></div>
          </div>
          <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-1">Mô tả</label><textarea rows={3} placeholder="Ghi chú thêm..." value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-400 font-bold resize-none" /></div>
          <div className="space-y-2"><label className="text-xs font-black text-gray-400 uppercase ml-1">Link học liệu</label><div className="relative"><input type="url" placeholder="YouTube, Drive, Canva..." value={formData.link} onChange={(e) => setFormData(prev => ({...prev, link: e.target.value}))} className="w-full p-4 pl-12 bg-gray-50 border-2 border-gray-100 rounded-2xl font-bold text-emerald-600" /><LinkIcon className="absolute left-4 top-4 text-gray-300 w-5 h-5" /></div></div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
          <button onClick={goHome} className="flex-1 p-4 bg-white border-2 border-gray-200 text-gray-400 rounded-2xl font-black uppercase text-sm">Hủy</button>
          <button onClick={handleSaveMaterial} className={`flex-1 p-4 ${addType === 'TEACHER' ? 'bg-emerald-600' : 'bg-rose-500'} text-white rounded-2xl font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all text-sm`}>Lưu ngay</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-emerald-50/10 flex flex-col">
      {renderNavigation()}
      <main className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar ${currentView === 'HOME' ? 'overflow-hidden' : ''}`}>
        {currentView === 'HOME' && renderHomeView()}
        {currentView === 'AGE_FIELDS' && renderAgeFieldsView()}
        {currentView === 'LIST' && renderListView()}
        {currentView === 'FAVORITES' && renderFavoritesView()}
        {currentView === 'DETAIL' && renderDetailView()}
        {currentView === 'ADD_MATERIAL' && renderAddMaterialView()}
      </main>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
