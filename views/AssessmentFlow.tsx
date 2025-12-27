
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast, useAuth } from '../App';
import { TradeLog, Asset } from '../types';

const AssessmentFlow: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTicker = searchParams.get('ticker') || 'General';

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isSaving, setIsSaving] = useState(false);

  // Assessment State
  const [answers, setAnswers] = useState({
    cashMindset: '',
    riskCheck: '',
    emotion: '',
    action: ''
  });

  const saveAssessment = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);

    try {
      // 1. Create the TradeLog entry
      const newLog: TradeLog = {
        id: 'log_' + Date.now(),
        userId: user.id,
        ticker: currentTicker,
        title: `${currentTicker} 风险执行报告`,
        timestamp: new Date().toLocaleString('zh-CN'),
        pnl: 0,
        pnlPercent: 0,
        status: 'FLAT',
        assessment: `现金思维: ${answers.cashMindset}. 风险状态: ${answers.riskCheck}. 情绪驱动: ${answers.emotion}.`,
        operation: answers.action,
        result: `已执行: ${answers.action}`,
        tags: [answers.cashMindset === '买入' ? '#看涨偏差' : '#客观中性', '#风控执行']
      };

      // 2. Save to Journal
      const existingLogsRaw = localStorage.getItem(`ts_journal_${user.id}`);
      const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
      localStorage.setItem(`ts_journal_${user.id}`, JSON.stringify([newLog, ...existingLogs]));

      // 3. ACTUAL EXECUTION: Update Portfolio based on Action
      const assetsRaw = localStorage.getItem(`ts_assets_${user.id}`);
      if (assetsRaw) {
        let assets: Asset[] = JSON.parse(assetsRaw);
        const assetIndex = assets.findIndex(a => a.ticker === currentTicker);
        
        if (assetIndex !== -1) {
          const asset = assets[assetIndex];
          
          if (answers.action === '全额止损') {
            // Remove from holding or mark as watching with 0 quantity
            assets[assetIndex] = { ...asset, quantity: 0, status: 'Watching', lastReview: new Date().toISOString() };
            showToast(`已执行清仓: ${currentTicker}`);
          } else if (answers.action === '减仓/止盈') {
            // Simulate 50% reduction
            assets[assetIndex] = { ...asset, quantity: asset.quantity * 0.5, lastReview: new Date().toISOString() };
            showToast(`已减仓 50%: ${currentTicker}`);
          } else if (answers.action === '继续补仓') {
            // Simulate 20% increase
            assets[assetIndex] = { ...asset, quantity: asset.quantity * 1.2, lastReview: new Date().toISOString() };
            showToast(`已执行补仓: ${currentTicker}`);
          } else {
            assets[assetIndex] = { ...asset, lastReview: new Date().toISOString() };
          }
          
          localStorage.setItem(`ts_assets_${user.id}`, JSON.stringify(assets));
        }
      }

      showToast(`评估完成，执行记录已存入日志`);
      navigate('/journal');
    } catch (error) {
      showToast('保存失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else saveAssessment();
  };

  const setAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setTimeout(() => handleNext(), 300);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="px-2 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">第一阶段: 偏误剥离</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-2 leading-none">现金思维检查</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">如果您现在手握现金且无持仓，您会按当前价格买入 {currentTicker} 吗？</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setAnswer('cashMindset', '买入')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${answers.cashMindset === '买入' ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
              >
                <span className="material-symbols-outlined text-4xl text-emerald-500">add_shopping_cart</span>
                <span className="font-black uppercase tracking-widest">是的，我会买入</span>
              </button>
              <button 
                onClick={() => setAnswer('cashMindset', '不买')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${answers.cashMindset === '不买' ? 'bg-primary/10 border-primary' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
              >
                <span className="material-symbols-outlined text-4xl text-rose-500">block</span>
                <span className="font-black uppercase tracking-widest">不，我绝对不会</span>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="px-2 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 leading-none">心理承载力评估</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">当前的波动是否已引起生理性不适（失眠、频繁刷屏）？</p>
            </div>
            <div className="space-y-4">
              {['心如止水，按计划执行', '有些心慌，但能控制', '极度焦虑，无法冷静'].map((option) => (
                <button 
                  key={option}
                  onClick={() => setAnswer('riskCheck', option)}
                  className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-left font-bold flex justify-between items-center group active:scale-[0.98] transition-all"
                >
                  <span>{option}</span>
                  <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="px-2 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 leading-none">情绪主导分析</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">当前的判断，是基于数据还是基于“回本”的渴望？</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['贪婪/FOMO', '不甘心/报复', '恐惧/逃避', '逻辑/纪律'].map((option) => (
                <button 
                  key={option}
                  onClick={() => setAnswer('emotion', option)}
                  className="h-28 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 font-black uppercase tracking-tighter flex flex-col items-center justify-center gap-2 active:scale-95 transition-all text-xs text-center px-2"
                >
                  <span>{option}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
             <div className="px-2 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 leading-none">执行最终决策</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">基于客观框架，现在必须采取的操作是：</p>
            </div>
            <div className="space-y-4">
              {['维持现状', '减仓/止盈', '全额止损', '继续补仓'].map((option) => (
                <button 
                  key={option}
                  onClick={() => setAnswer('action', option)}
                  disabled={isSaving}
                  className="w-full p-5 rounded-3xl bg-slate-900 text-white dark:bg-primary dark:text-slate-900 font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSaving ? '正在执行...' : option}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-500 shadow-sm active:scale-90 transition-all"><span className="material-symbols-outlined">close</span></button>
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">风险指令舱 · {currentTicker}</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-10 py-2">
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">步骤 {step} / {totalSteps}</span>
          <span className="text-[9px] font-black text-primary">{Math.round((step/totalSteps)*100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${(step/totalSteps)*100}%` }}></div>
        </div>
      </div>

      <main className="flex-1 px-4 pt-8 pb-32 overflow-y-auto no-scrollbar">
        {renderStep()}
      </main>
    </div>
  );
};

export default AssessmentFlow;
