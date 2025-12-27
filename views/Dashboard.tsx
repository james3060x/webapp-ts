
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, useAuth } from '../App';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';

  const handleRestrictedAction = (path: string) => {
    if (isGuest) {
      navigate('/auth');
    } else {
      navigate(path);
    }
  };

  const startNewAssessment = () => {
    if (isGuest) {
      navigate('/auth');
      return;
    }
    // Prompt for ticker or just go to portfolio to pick one
    const assetsRaw = localStorage.getItem(`ts_assets_${user?.id}`);
    const assets = assetsRaw ? JSON.parse(assetsRaw) : [];
    
    if (assets.length === 0) {
      showToast('请先在“资产”页面添加一个标的');
      navigate('/portfolio');
    } else {
      showToast('请选择一个资产进行风险评估');
      navigate('/portfolio');
    }
  };

  return (
    <div className="relative min-h-screen pb-32 pt-10 px-6 overflow-y-auto no-scrollbar">
      <header className="flex justify-between items-start mb-8">
        <div>
          <p className="text-primary text-xs font-black tracking-[0.2em] uppercase opacity-80 mb-1">系统中心</p>
          <h1 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight leading-none">
            {isGuest ? '访客' : '早上好'}，<br /><span className="text-primary/80 uppercase">{user?.username}</span>
          </h1>
        </div>
        <button 
          onClick={startNewAssessment}
          className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/60 border border-white dark:border-slate-700 py-2.5 px-4 rounded-full shadow-sm glass-panel active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
          <span className="text-xs font-black uppercase tracking-wider">新评估</span>
        </button>
      </header>

      {isGuest && (
        <div 
          onClick={() => navigate('/auth')}
          className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-500 cursor-pointer active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-amber-500">warning</span>
          <div className="flex-1">
            <p className="text-[11px] font-black text-amber-700 dark:text-amber-400 leading-tight uppercase tracking-widest mb-1">
              您当前以访客身份浏览
            </p>
            <p className="text-[9px] font-bold text-amber-600/70 dark:text-amber-400/60 uppercase">点击此处立即注册，开启数据云端同步功能</p>
          </div>
          <span className="material-symbols-outlined text-amber-400">arrow_forward</span>
        </div>
      )}

      <section className="grid grid-cols-2 gap-4 mb-8">
        <div 
          onClick={() => showToast('账户风险报告生成中')}
          className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl glass-panel border border-white/50 dark:border-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined filled text-xl">speed</span>
          </div>
          <p className="text-2xl font-black">{isGuest ? 'N/A' : 'Moderate'}</p>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">总体风险敞口</p>
        </div>
        <div 
          onClick={() => showToast('流动性分析功能开发中')}
          className="bg-white/70 dark:bg-slate-800/70 p-5 rounded-2xl glass-panel border border-white/50 dark:border-white/5 active:scale-95 transition-all cursor-pointer"
        >
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <span className="material-symbols-outlined filled text-xl">account_balance_wallet</span>
          </div>
          <p className="text-2xl font-black">{isGuest ? '100%' : '15%'}</p>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">现金缓冲比例</p>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-black tracking-tight uppercase">强制复盘提醒</h3>
          <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{isGuest ? '1' : '2'} 待处理</span>
        </div>
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-rose-100 dark:border-rose-900/30 relative overflow-hidden group shadow-soft">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 dark:bg-rose-900/10 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10 flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-orange-500">currency_bitcoin</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h4 className="font-black text-lg leading-none">Bitcoin</h4>
                  <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black">BTC/USD</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase mb-4">
                  <span className="material-symbols-outlined text-sm">warning</span> 心理止损阈值已触及
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleRestrictedAction('/assessment?ticker=BTC')} 
                    className="flex-1 bg-primary text-slate-900 h-11 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    开始复盘
                  </button>
                  <button onClick={() => showToast('已延后 4 小时')} className="w-11 h-11 border border-slate-100 dark:border-slate-700 rounded-full flex items-center justify-center text-slate-400 active:bg-slate-50 transition-colors"><span className="material-symbols-outlined text-lg">snooze</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 glass-panel bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-4 rounded-2xl flex gap-3 shadow-sm mb-6">
        <span className="material-symbols-outlined text-orange-500 shrink-0">tips_and_updates</span>
        <div>
          <h4 className="text-sm font-black uppercase tracking-tight">智能建议</h4>
          <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
            {isGuest ? '登录后，系统将自动识别并分析您的投资组合中是否存在过度关联的风险敞口。' : '检测到资产关联度过高，建议对科技板块头寸执行一次“客观化练习”。'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
