import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { Flower, Cloud } from 'lucide-react';

const Login: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <div className="min-h-screen garden-bg flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Clouds */}
      <Cloud className="absolute top-12 left-10 text-white/60 animate-float" size={80} />
      <Cloud className="absolute top-24 right-20 text-white/50 animate-float-delayed" size={120} />
      
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center border-2 border-white/50 relative z-10 animate-grow">
        <div className="flex justify-center mb-6 text-green-600">
          <Flower size={64} className="animate-spin-slow" />
        </div>
        <h2 className="text-3xl font-extrabold text-green-900 mb-2">Đăng nhập</h2>
        <p className="text-green-800/80 mb-8 font-medium">Vào Vườn Hoa Tài Nguyên Số</p>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-green-100 text-gray-700 font-bold py-3 px-4 rounded-2xl hover:bg-green-50 hover:border-green-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-6 h-6" />
          <span>Đăng nhập với Google</span>
        </button>
        
        <div className="mt-8 text-sm text-green-800/60 font-medium">
          Chỉ dành cho giáo viên và quản trị viên được cấp quyền.
        </div>
      </div>
    </div>
  );
};

export default Login;
