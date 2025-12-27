
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast, useAuth } from '../App';
import { Asset } from '../types';
import { fetchLivePrice } from '../services/PriceService';

const AssetDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [asset, setAsset] = useState<Partial<Asset> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isGuest = user?.role === 'guest';
    let foundAsset: Partial<Asset> | undefined;

    const loadData = async () => {
      if (isGuest) {
        const demoAssets: Partial<Asset>[] = [
          { id: 'demo1', ticker: 'BTC', name: 'Bitcoin (DEMO)', status: 'Holding', price: 92100, change: 2.1, quantity: 0.5, averageCost: 45000, entryDate: '2023-10-12', logo: 'https://ui-avatars.com/api/?name=BTC&background=f7931a&color=fff', type: 'Crypto' }
        ];
        foundAsset = demoAssets.find(a => a.id === id);
      } else {
        const saved = localStorage.getItem(`ts_assets_${user?.id}`);
        if (saved) {
          const assets: Partial<Asset>[] = JSON.parse(saved);
          foundAsset = assets.find(a => a.id === id);
        }
      }

      if (foundAsset) {
        // Refresh price on load
        try {
          const newPrice = await fetchLivePrice(foundAsset.ticker!, foundAsset.type!);
          if (newPrice > 0) {
            foundAsset.price = newPrice;
          }
        } catch (e) {
          console.warn("Could not refresh price automatically");
        }
        setAsset({ ...foundAsset });
      }
      setLoading(false);
    };

    loadData();
  }, [id, user]);

  if (loading) return null;

  if (!asset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">search_off</span>
        <h2 className="text-xl font-black uppercase mb-2">未找到该资产</h2>
        <p className="text-slate-500 text-sm mb-6">该资产可能已被删除或属于其他账户。</p>
        <button onClick={() => navigate('/portfolio')} className="px-8 py-3 bg-primary text-slate-900 rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">返回列表</button>
      </div>
    );
  }

  const pnlValue = asset.status === 'Holding' && asset.quantity && asset.averageCost 
    ? (asset.price! - asset.averageCost) * asset.quantity 
    : 0;
  
  const pnlPercent = asset.status === 'Holding' && asset.averageCost 
    ? ((asset.price! - asset.averageCost) / asset.averageCost) * 100 
    : 0;

  return (
    <div className="min-h-screen pt-12 pb-32 overflow-y-auto no-scrollbar">
      <header className="fixed top-0 left-0 right-0 z-40 w-full max-w-md mx-auto glass-panel bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-white/5 px-4 py-3 flex items-center justify-between shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center text-slate-800 dark:text-white rounded-full active:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black tracking-tight leading-none uppercase">{asset.ticker} / USD</h2>
            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${asset.status === 'Holding' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
              {asset.status === 'Holding' ? '持有' : '关注'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-bold text-slate-500">${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${asset.change! >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
              {asset.change! >= 0 ? '+' : ''}{asset.change}%
            </span>
          </div>
        </div>
        <button onClick={() => showToast('设置止损与警报功能开发中')} className="w-10 h-10 flex items-center justify-center text-slate-800 dark:text-white rounded-full">
          <span className="material-symbols-outlined text-primary text-xl">sync</span>
        </button>
      </header>

      <main className="p-4 space-y-6 pt-16 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="glass-panel p-6 bg-white/70 dark:bg-slate-800/70 rounded-3xl border border-white/50 shadow-soft flex flex-col items-center text-center">
          <img src={asset.logo} className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white dark:border-slate-700 mb-4" alt={asset.ticker} />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{asset.name}</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{asset.type} · {asset.ticker}</p>
        </div>

        <div className="glass-panel p-5 bg-white/70 dark:bg-slate-800/70 rounded-3xl border border-white/50 shadow-soft">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">盈亏分析 (Live)</h3>
            {asset.entryDate && <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">建仓于: {asset.entryDate}</span>}
          </div>
          
          <div className="grid grid-cols-2 gap-y-6">
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">未实现盈亏</p>
              <p className={`text-xl font-black tracking-tight ${pnlValue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {pnlValue >= 0 ? '+$' : '-$'}{Math.abs(pnlValue).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">回报率 (ROI)</p>
              <p className={`text-xl font-black tracking-tight ${pnlPercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
              </p>
            </div>
            
            <div>
              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">入场均价</p>
              <p className="text-lg font-black tracking-tight">
                {asset.averageCost ? `$${asset.averageCost.toLocaleString()}` : 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 font-black uppercase mb-1">持有量</p>
              <p className="text-lg font-black tracking-tight">
                {asset.quantity ? asset.quantity.toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-lg font-black tracking-tight leading-none uppercase">风险密度检查</h3>
          </div>
          
          <div 
            onClick={() => navigate(`/assessment?ticker=${asset.ticker}`)}
            className="glass-panel p-5 bg-white/70 dark:bg-slate-800/70 rounded-3xl border-l-4 border-primary relative overflow-hidden shadow-soft active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">fact_check</span>
                <h3 className="text-xs font-black uppercase tracking-widest">偏差检查 (Bias)</h3>
              </div>
              <span className="text-[9px] text-slate-400 font-black uppercase">重要</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              当前的实时盈亏是否影响了您的客观判断？执行一次复盘评估来确认您的原始交易逻辑。
            </p>
          </div>
        </section>
      </main>

      <div className="fixed bottom-24 left-0 right-0 z-40 px-6 flex justify-center">
        <button 
          onClick={() => navigate(`/assessment?ticker=${asset.ticker}`)}
          className="w-full max-w-xs h-14 bg-primary text-slate-900 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">analytics</span>
          <span>执行 {asset.ticker} 风险评估</span>
        </button>
      </div>
    </div>
  );
};

export default AssetDetail;
