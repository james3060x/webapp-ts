
import React, { useState, useEffect } from 'react';
import { useToast, useAuth } from '../App';
import { TradeLog } from '../types';

const Journal: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';
  
  const [logs, setLogs] = useState<TradeLog[]>([]);

  useEffect(() => {
    if (isGuest) {
      setLogs([
        { id: '1', userId: 'guest', ticker: 'BTC', title: 'BTC 演示日志', timestamp: '2025/1/1', pnl: 8.5, pnlPercent: 8.5, status: 'WIN', assessment: '演示数据：保持客观。', operation: '持有', result: '演示', tags: ['#演示'] }
      ]);
    } else {
      const saved = localStorage.getItem(`ts_journal_${user?.id}`);
      if (saved) {
        setLogs(JSON.parse(saved));
      }
    }
  }, [user, isGuest]);

  const deleteLog = (id: string) => {
    if (isGuest) {
      showToast('演示数据无法删除');
      return;
    }
    const updatedLogs = logs.filter(l => l.id !== id);
    setLogs(updatedLogs);
    localStorage.setItem(`ts_journal_${user?.id}`, JSON.stringify(updatedLogs));
    showToast('日志已删除');
  };

  return (
    <div className="min-h-screen pt-12 pb-32 overflow-y-auto no-scrollbar">
      <header className="px-6 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black tracking-tight uppercase">复盘日志</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => showToast('过滤器功能开发中')} className="p-2 relative active:scale-90 transition-all">
            <span className="material-symbols-outlined text-slate-500">filter_list</span>
          </button>
        </div>
      </header>

      <div className="px-6 grid grid-cols-2 gap-3 mb-8">
        <div className="glass-panel p-4 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-white/50 shadow-soft">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">评估总数</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black">{logs.length}</span>
          </div>
        </div>
        <div className="glass-panel p-4 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-white/50 shadow-soft">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">最近活动</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-black truncate">{logs[0]?.ticker || '--'}</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 mb-12">
        {logs.length > 0 ? logs.map(log => (
          <div key={log.id} className="glass-panel p-5 bg-white/70 dark:bg-slate-800/70 rounded-2xl border border-white/50 shadow-soft relative overflow-hidden active:scale-[0.99] transition-all">
            <div className={`absolute top-0 left-0 w-1 h-full ${log.status === 'WIN' ? 'bg-emerald-400' : log.status === 'LOSS' ? 'bg-rose-400' : 'bg-primary'}`}></div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">analytics</span>
                </div>
                <div>
                  <h3 className="font-black text-base leading-none">{log.ticker}</h3>
                  <p className="text-[9px] text-slate-400 font-black uppercase mt-1">{log.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-black px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 uppercase tracking-wider">{log.operation}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}
                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 italic">
              "{log.assessment}"
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {log.tags.map(tag => (
                <span key={tag} className="text-[9px] font-black px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700/30 uppercase tracking-tighter">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )) : (
          <div className="py-20 text-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4">history_edu</span>
            <p className="text-xs font-black uppercase tracking-widest">暂无复盘记录</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;
