
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, useAuth } from '../App';
import { Asset } from '../types';
import { fetchLivePrice } from '../services/PriceService';

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';

  const [assets, setAssets] = useState<Partial<Asset>[]>(() => {
    if (isGuest) return [
      { id: 'demo1', ticker: 'BTC', name: 'Bitcoin (DEMO)', status: 'Holding', price: 92100, change: 2.1, quantity: 0.5, averageCost: 45000, entryDate: '2023-10-12', logo: 'https://ui-avatars.com/api/?name=BTC&background=f7931a&color=fff', type: 'Crypto' }
    ];
    const saved = localStorage.getItem(`ts_assets_${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newAsset, setNewAsset] = useState({
    ticker: '',
    name: '',
    status: 'Holding' as 'Holding' | 'Watching',
    type: 'Crypto' as 'Crypto' | 'US Stock' | 'HK Stock' | 'ETF',
    quantity: '',
    averageCost: '',
    currentPrice: '',
    entryDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!isGuest && user?.id) {
      localStorage.setItem(`ts_assets_${user.id}`, JSON.stringify(assets));
    }
  }, [assets, user, isGuest]);

  const handleFetchPrice = async () => {
    if (!newAsset.ticker) {
      showToast('请先输入标的代码');
      return;
    }
    setIsFetchingPrice(true);
    try {
      const price = await fetchLivePrice(newAsset.ticker, newAsset.type);
      if (price > 0) {
        setNewAsset(prev => ({ ...prev, currentPrice: price.toString() }));
        showToast(`已获取最新价格: $${price.toLocaleString()}`);
      } else {
        showToast('未能获取价格，请手动输入');
      }
    } catch (e) {
      showToast('获取价格失败');
    } finally {
      setIsFetchingPrice(false);
    }
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuest) {
      navigate('/auth');
      return;
    }
    if (!newAsset.ticker || !newAsset.name) {
      showToast('请填写代码和名称');
      return;
    }

    const qty = parseFloat(newAsset.quantity) || 0;
    const cost = parseFloat(newAsset.averageCost) || 0;
    const price = parseFloat(newAsset.currentPrice) || 0;

    const assetToAdd: Partial<Asset> = {
      id: Date.now().toString(),
      userId: user?.id,
      ticker: newAsset.ticker.toUpperCase(),
      name: newAsset.name,
      status: newAsset.status,
      type: newAsset.type,
      price: price || 100, // Fallback
      change: 0,
      quantity: qty,
      averageCost: cost,
      entryDate: newAsset.status === 'Holding' ? newAsset.entryDate : undefined,
      logo: `https://ui-avatars.com/api/?name=${newAsset.ticker}&background=random&color=fff`
    };

    setAssets([assetToAdd, ...assets]);
    setIsModalOpen(false);
    setNewAsset({ ticker: '', name: '', status: 'Holding', type: 'Crypto', quantity: '', averageCost: '', currentPrice: '', entryDate: new Date().toISOString().split('T')[0] });
    showToast(`${assetToAdd.ticker} 已存入数据库`);
  };

  const filteredAssets = assets.filter(a => 
    a.ticker?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-12 pb-32 px-6 overflow-y-auto no-scrollbar relative">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">投资组合</h1>
          {isGuest && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">演示模式 · 数据无法保存</p>}
        </div>
        <button 
          onClick={() => isGuest ? navigate('/auth') : setIsModalOpen(true)}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-slate-900 shadow-lg shadow-primary/20 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索资产名称或 Ticker..." 
          className="w-full pl-12 pr-4 h-12 bg-white/60 dark:bg-slate-800/60 border-none rounded-full glass-panel shadow-sm text-sm focus:ring-2 focus:ring-primary/50 dark:text-white"
        />
      </div>

      <div className="space-y-4">
        {filteredAssets.length > 0 ? filteredAssets.map(asset => (
          <div 
            key={asset.id} 
            onClick={() => navigate(`/asset/${asset.id}`)}
            className="glass-panel p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white/50 dark:border-white/5 shadow-soft transition-all active:scale-[0.98]"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <img src={asset.logo} className="w-12 h-12 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm" alt={asset.ticker} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 dark:text-white">{asset.ticker}</h3>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase border ${asset.status === 'Holding' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {asset.status === 'Holding' ? '持有' : '关注'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase truncate max-w-[120px]">{asset.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-sm text-slate-900 dark:text-white">${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <div className={`text-[10px] font-black ${asset.change! >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {asset.change! >= 0 ? '+' : ''}{asset.change}%
                </div>
              </div>
            </div>
            {asset.status === 'Holding' && asset.quantity! > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] text-slate-400 font-black uppercase">数量</p>
                    <p className="text-[10px] font-black">{asset.quantity}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-slate-400 font-black uppercase">成本</p>
                    <p className="text-[10px] font-black">${asset.averageCost?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[8px] text-slate-400 font-black uppercase">未实现盈亏</p>
                   <p className={`text-[10px] font-black ${asset.price! >= asset.averageCost! ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {asset.price! >= asset.averageCost! ? '+' : ''}
                    {Math.round(((asset.price! - asset.averageCost!) / asset.averageCost!) * 100)}%
                   </p>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="py-20 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-slate-200">inventory_2</span>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">列表为空，点击 + 开始</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-20 sm:items-center sm:p-0 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 px-6 pt-5 pb-8 text-left shadow-2xl transition-all w-full max-w-sm animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">录入新标的</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">代码 (Ticker)</label>
                  <div className="flex gap-2">
                    <input autoFocus type="text" className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white uppercase" value={newAsset.ticker} onChange={e => setNewAsset({...newAsset, ticker: e.target.value})} />
                    <button type="button" onClick={handleFetchPrice} className="shrink-0 w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary active:scale-90 transition-all">
                      <span className={`material-symbols-outlined ${isFetchingPrice ? 'animate-spin' : ''}`}>sync</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">标的名称</label>
                  <input type="text" className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">类别</label>
                  <select className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white appearance-none" value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value as any})}>
                    <option value="Crypto">加密货币</option>
                    <option value="US Stock">美股 (US)</option>
                    <option value="HK Stock">港股 (HK)</option>
                    <option value="ETF">ETF</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">状态</label>
                  <select className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white appearance-none" value={newAsset.status} onChange={e => setNewAsset({...newAsset, status: e.target.value as any})}>
                    <option value="Holding">持有中 (Holding)</option>
                    <option value="Watching">观察中 (Watching)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">当前市场价格 ($)</label>
                <input type="number" step="any" placeholder="0.00" className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" value={newAsset.currentPrice} onChange={e => setNewAsset({...newAsset, currentPrice: e.target.value})} />
              </div>

              {newAsset.status === 'Holding' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">持仓数量</label>
                      <input type="number" step="any" placeholder="0.00" className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" value={newAsset.quantity} onChange={e => setNewAsset({...newAsset, quantity: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">持仓均价</label>
                      <input type="number" step="any" placeholder="0.00" className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white" value={newAsset.averageCost} onChange={e => setNewAsset({...newAsset, averageCost: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">建仓时间</label>
                    <input type="date" className="w-full h-11 bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 text-sm font-bold dark:text-white block" value={newAsset.entryDate} onChange={e => setNewAsset({...newAsset, entryDate: e.target.value})} />
                  </div>
                </div>
              )}
              
              <button type="submit" className="w-full h-14 bg-primary text-slate-900 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4">确认入库</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
