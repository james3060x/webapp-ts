
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../App';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <div className="relative flex h-screen w-full flex-col justify-between p-6 bg-gradient-to-b from-[#f0eee9] to-[#e0f7fa] dark:from-[#1a1a1a] dark:to-[#0f1516]">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/40 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 z-10">
        <div className="relative group active:scale-95 transition-transform duration-300">
          <div className="absolute -inset-1 bg-gradient-to-tr from-white/60 to-transparent rounded-3xl blur opacity-70 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative w-32 h-32 rounded-3xl bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] flex items-center justify-center overflow-hidden">
            <img 
              className="opacity-80 w-full h-full object-cover mix-blend-overlay"
              src="https://picsum.photos/200/200?blur=2" 
              alt="Brand" 
            />
            <span className="material-symbols-outlined absolute text-5xl text-slate-800 dark:text-white drop-shadow-sm">
              balance
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold tracking-tight">交易系统</h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">三思而后行。</p>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4 pb-12 z-10">
        <button 
          onClick={() => navigate('/auth')}
          className="relative w-full h-14 rounded-full bg-primary hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/25 text-slate-900 text-lg font-bold flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>立即开始</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button 
          onClick={() => showToast('请登录后在设置中导出/导入数据')}
          className="w-full h-12 rounded-full text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-white/30 dark:hover:bg-white/10 transition-colors active:scale-[0.98]"
        >
          数据迁移 (JSON)
        </button>
        <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest pt-2">
          不预测价格 · 仅为风险框架
        </p>
      </div>
    </div>
  );
};

export default Landing;
