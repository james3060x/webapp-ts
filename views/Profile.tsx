
import React, { useRef } from 'react';
import { useToast, useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isGuest = user?.role === 'guest';

  const handleExport = () => {
    if (isGuest) {
      showToast('访客模式无数据可导出');
      return;
    }
    const assetData = localStorage.getItem(`ts_assets_${user?.id}`) || '[]';
    const journalData = localStorage.getItem(`ts_journal_${user?.id}`) || '[]';
    
    const exportData = {
      user: { id: user?.id, username: user?.username },
      assets: JSON.parse(assetData),
      journal: JSON.parse(journalData),
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tradesystem_data_${user?.username}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('数据已导出为 JSON');
  };

  const handleImportClick = () => {
    if (isGuest) {
      showToast('访客模式不支持导入，请登录');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.assets) {
          localStorage.setItem(`ts_assets_${user?.id}`, JSON.stringify(data.assets));
        }
        if (data.journal) {
          localStorage.setItem(`ts_journal_${user?.id}`, JSON.stringify(data.journal));
        }
        showToast('数据导入成功！页面将刷新');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        showToast('无效的 JSON 文件');
      }
    };
    reader.readAsText(file);
  };

  const sections = [
    { title: '账户设置', icon: 'person', onClick: () => isGuest ? navigate('/auth') : showToast('即将上线') },
    { title: '导出数据 (JSON)', icon: 'download', onClick: handleExport },
    { title: '导入数据 (JSON)', icon: 'upload', onClick: handleImportClick },
    { title: '资金管理规则', icon: 'account_balance_wallet', onClick: () => showToast('即将上线') },
  ];

  return (
    <div className="min-h-screen pt-12 pb-32 overflow-y-auto no-scrollbar">
      <header className="px-6 flex items-center justify-center relative mb-8">
        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">系统设置</h1>
      </header>

      <div className="flex flex-col items-center mb-10 px-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-2xl overflow-hidden ring-4 ring-primary/10">
            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=3ebfea&color=fff`} alt="Profile" />
          </div>
          {isGuest && (
            <div className="absolute -bottom-2 -right-2 bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
              <span className="material-symbols-outlined text-sm">no_accounts</span>
            </div>
          )}
        </div>
        <div className="mt-5 text-center">
          <h2 className="text-2xl font-black tracking-tight leading-none uppercase">{user?.username}</h2>
          <p className="text-slate-500 text-[10px] font-black mt-2 opacity-60 tracking-[0.2em] uppercase">
            {isGuest ? '访客账户 · 功能受限' : '专业账户 · 数据同步已开启'}
          </p>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {isGuest && (
          <button 
            onClick={() => navigate('/auth')}
            className="w-full bg-primary p-5 rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-slate-900">
                <span className="material-symbols-outlined filled">login</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 uppercase">立即登录/注册</p>
                <p className="text-[10px] font-bold text-slate-900/60 uppercase">保存您的交易数据至云端</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-900">chevron_right</span>
          </button>
        )}

        <div className="glass-panel bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-soft overflow-hidden border border-white/50">
          {sections.map((item, i) => (
            <React.Fragment key={item.title}>
              <button 
                onClick={item.onClick}
                className="w-full flex items-center justify-between p-4 py-5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-800 dark:text-slate-200">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">{item.title}</span>
                </div>
                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
              </button>
              {i < sections.length - 1 && <div className="h-px bg-slate-100/50 dark:bg-slate-700/50 mx-4"></div>}
            </React.Fragment>
          ))}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".json" 
          onChange={handleFileImport}
        />

        <button 
          onClick={() => { logout(); navigate('/'); }}
          className="w-full h-15 bg-white/70 dark:bg-slate-800/70 rounded-3xl shadow-soft flex items-center justify-center border border-white/50 group active:scale-[0.98] transition-all py-5"
        >
          <span className="text-rose-500 font-black text-xs uppercase tracking-[0.3em] group-hover:scale-105 transition-transform">
            {isGuest ? '离开系统' : '退出当前账号'}
          </span>
        </button>

        <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.5em] py-8 opacity-40">TradeSystem Engine v1.4.0-auth</p>
      </div>
    </div>
  );
};

export default Profile;
