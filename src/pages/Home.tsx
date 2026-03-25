import React from 'react';
import { Link } from 'react-router-dom';
import { Flower, BookOpen, Video, Image as ImageIcon, Link as LinkIcon, Cloud } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen garden-bg text-gray-800 font-sans overflow-hidden relative">
      {/* Decorative Clouds */}
      <Cloud className="absolute top-12 left-10 text-white/60 animate-float" size={80} />
      <Cloud className="absolute top-24 right-20 text-white/50 animate-float-delayed" size={120} />
      <Cloud className="absolute top-40 left-1/3 text-white/40 animate-float" size={60} />

      <header className="bg-white/60 backdrop-blur-md shadow-sm py-4 px-6 flex justify-between items-center relative z-10 border-b border-green-200/50">
        <div className="flex items-center space-x-2 text-green-700">
          <Flower size={28} className="animate-spin-slow" />
          <h1 className="text-2xl font-bold tracking-tight">Vườn Hoa Tài Nguyên Số</h1>
        </div>
        <nav>
          <Link to="/login" className="text-green-800 hover:text-green-900 font-medium px-4 py-2 rounded-full hover:bg-white/50 transition-colors">
            Đăng nhập
          </Link>
          <Link to="/dashboard" className="ml-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block">
            Vào Vườn Hoa
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
        <div className="animate-grow">
          <h2 className="text-5xl font-extrabold text-green-800 mb-6 leading-tight drop-shadow-sm">
            Khám phá Kho Tàng Kiến Thức <br/> Dành Cho Giáo Viên
          </h2>
          <p className="text-xl text-green-900/80 mb-12 max-w-3xl mx-auto font-medium">
            Nơi lưu trữ, chia sẻ và tìm kiếm các tài nguyên học tập số chất lượng cao. 
            Cùng nhau xây dựng một cộng đồng giáo dục vững mạnh và sáng tạo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <FeatureCard 
            icon={<BookOpen size={32} className="text-blue-600" />}
            title="Tài liệu giáo án"
            description="Hàng ngàn giáo án, bài giảng điện tử phong phú."
            colorClass="bg-blue-100 border-blue-200"
            delay="0s"
          />
          <FeatureCard 
            icon={<Video size={32} className="text-red-600" />}
            title="Video bài giảng"
            description="Video hướng dẫn trực quan, sinh động."
            colorClass="bg-red-100 border-red-200"
            delay="0.1s"
          />
          <FeatureCard 
            icon={<ImageIcon size={32} className="text-yellow-600" />}
            title="Hình ảnh minh họa"
            description="Thư viện hình ảnh chất lượng cao cho bài giảng."
            colorClass="bg-yellow-100 border-yellow-200"
            delay="0.2s"
          />
          <FeatureCard 
            icon={<LinkIcon size={32} className="text-purple-600" />}
            title="Liên kết hữu ích"
            description="Tổng hợp các trang web, công cụ hỗ trợ giảng dạy."
            colorClass="bg-purple-100 border-purple-200"
            delay="0.3s"
          />
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, colorClass, delay }: { icon: React.ReactNode, title: string, description: string, colorClass: string, delay: string }) => (
  <div 
    className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg border-2 border-white/50 flex flex-col items-center text-center hover:shadow-xl transition-all hover:-translate-y-2 animate-grow relative overflow-hidden group"
    style={{ animationDelay: delay }}
  >
    {/* Decorative flower in corner */}
    <Flower className="absolute -top-4 -right-4 text-green-100 opacity-50 rotate-45 group-hover:rotate-90 transition-transform duration-700" size={80} />
    
    <div className={`mb-6 p-4 rounded-full ${colorClass} shadow-inner relative z-10`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3 relative z-10">{title}</h3>
    <p className="text-gray-600 relative z-10">{description}</p>
  </div>
);

export default Home;
