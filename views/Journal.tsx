
import React from 'react';
import { useToast } from '../App';

const Journal: React.FC = () => {
  const { showToast } = useToast();
  const logs = [
    { id: '1', ticker: 'BTC', title: 'BTC 突破', time: '今天，上午10:42', pnl: 8.5, status: 'WIN', steps: [
      { type: '评估', text: '在阻力位附近检测到高波动性。', active: false },
      { type: '操作', text: '做多 2 倍杠杆', active: true },
      { type: '结果', text: '目标达成，完美执行计划。', active: false, done: true },
    ], tags: ['#纪律性', '#突破策略'] },
    { id: '2', ticker: 'TSLA', title: 'TSLA 反转', time: '昨天，下午2:15', pnl: -4.2, status: 'LOSS', steps: [
      { type: '评估', text: '价格快速波动，害怕错过。', active: false },
      { type: '操作', text: '过早做空入场', active: true },
      { type: '结果', text: '立即止损。', active: false, done: true },
    ], tags: ['#不耐心', '#仓位过大'] },
  ];

  return (
    <div className="min-h-screen pt-12 pb-32 overflow-y-auto no-scrollbar">
      <header className="px-6 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tight">回顾</h1>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => showToast('过滤器选项')}
            className="p-2 relative active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-slate-500">filter_list</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <div 
            onClick={() => showToast('个人资料详情')}
            className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden shadow-sm cursor-pointer active:scale-90 transition-all"
          >
            <img src="https://ui-avatars.com/api/?name=Trader&background=random" alt="User" />
          </div>
        </div>
      </header>

      <div className="px-6 flex gap-3 overflow-x-auto no-scrollbar mb-6">
        <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-9 px-5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap">所有资产</button>
        {['盈利', '亏损', '加密', '美股'].map(f => (
          <button 
            key={f} 
            onClick={() => showToast(`筛选 ${f}`)}
            className="bg-white/60 dark:bg-slate-800/60 h-9 px-5 rounded-full text-xs font-black text-slate-500 dark:text-slate-400 border border-white/50 dark:border-white/5 whitespace-nowrap uppercase tracking-widest active:scale-95 transition-all"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="px-6 grid grid-cols-2 gap-3 mb-6">
        <div className="glass-panel p-4 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-white/50 shadow-soft">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">胜率</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black">68%</span>
            <span className="text-[10px] font-black text-emerald-500">↑ 2%</span>
          </div>
        </div>
        <div className="glass-panel p-4 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-white/50 shadow-soft">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">平均盈亏比</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black">2.4</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6 mb-12">
        {logs.map(log => (
          <div key={log.id} className="glass-panel p-5 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-white/50 shadow-soft relative overflow-hidden active:scale-[0.99] transition-all">
            <div className={`absolute top-0 left-0 w-1 h-full ${log.status === 'WIN' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.ticker === 'BTC' ? 'bg-orange-100 text-orange-500' : 'bg-red-100 text-red-500'} shadow-inner`}>
                  <span className="material-symbols-outlined">{log.ticker === 'BTC' ? 'currency_bitcoin' : 'electric_car'}</span>
                </div>
                <div>
                  <h3 className="font-black text-base leading-none">${log.ticker} {log.title.split(' ')[1]}</h3>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-1">{log.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-base font-black leading-none ${log.status === 'WIN' ? 'text-emerald-600' : 'text-rose-600'}`}>{log.pnl > 0 ? '+' : ''}{log.pnl}%</p>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-1 inline-block ${log.status === 'WIN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {log.status}
                </span>
              </div>
            </div>

            <div className="relative pl-3 pb-2">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-700"></div>
              <div className="space-y-4">
                {log.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative z-10">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ring-4 ring-white dark:ring-slate-800 ${step.active ? 'bg-primary shadow-glow animate-pulse' : step.done ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <div className="flex-1">
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${step.active ? 'text-primary' : 'text-slate-400'}`}>{step.type}</p>
                      <p className={`text-xs ${step.active ? 'font-black text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'} leading-relaxed`}>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              {log.tags.map(tag => (
                <span key={tag} className="text-[9px] font-black px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/30 uppercase tracking-tighter">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => showToast('撰写回顾功能即将上线')}
        className="fixed bottom-24 right-6 z-30 bg-slate-900 dark:bg-primary text-white dark:text-slate-900 px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-primary/20"
      >
        <span className="material-symbols-outlined text-xl">edit_square</span>
        <span className="font-black text-xs uppercase tracking-widest">撰写回顾</span>
      </button>
    </div>
  );
};

export default Journal;
