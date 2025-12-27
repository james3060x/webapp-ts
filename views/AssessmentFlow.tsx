
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../App';

const AssessmentFlow: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const currentTicker = searchParams.get('ticker') || 'General'; // 获取 URL 中的标的代码

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else {
      showToast(`${currentTicker} 评估报告已生成并存入日志`);
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="px-2 text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">正在评估: {currentTicker}</span>
              </div>
              <h2 className="text-3xl font-black tracking-tighter mb-2 leading-none">现金思维检查</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">重新评估您的入场逻辑，仿佛您现在持有现金。消除已持有头寸带来的心理偏见。</p>
            </div>
            <div className="glass-panel p-6 rounded-[2.5rem] bg-white/60 dark:bg-slate-800/60 shadow-glass border border-white/50">
              <div className="space-y-6">
                <p className="text-lg font-black text-center px-4">如果您现在没有任何 {currentTicker} 头寸，您会在此价位买入吗？</p>
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-900 rounded-full relative shadow-inner">
                  <button onClick={() => showToast('选择: 是')} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all">是的，我会买</button>
                  <button onClick={() => showToast('选择: 否')} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-primary bg-white dark:bg-slate-800 rounded-full shadow-lg active:scale-95 transition-all">不，我不会</button>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center">为什么选择“不”？</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['趋势破裂', '估值过高', '事件风险', '风险超标'].map((t, i) => (
                      <button 
                        key={t} 
                        onClick={() => showToast(`已记录: ${t}`)}
                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider border flex items-center justify-center gap-2 transition-all active:scale-95 ${i === 0 ? 'bg-primary border-primary text-slate-900 shadow-lg shadow-primary/20' : 'bg-white border-slate-100 text-slate-500'}`}
                      >
                        <span className="material-symbols-outlined text-base">{['trending_down', 'attach_money', 'warning', 'pie_chart'][i]}</span>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="px-2 text-center">
              <h2 className="text-3xl font-black tracking-tighter mb-2 leading-none">风险密度评估</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">诚实面对当下的 {currentTicker} 持仓比例，计算整体风险系数。</p>
            </div>
            <div className="glass-panel p-6 rounded-[2.5rem] bg-white/60 dark:bg-slate-800/60 shadow-glass border border-white/50 flex flex-col gap-8">
              <div className="space-y-4">
                <p className="text-base font-black text-center">是否偏离了初始风险假设？</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => showToast('已记录: 是')} className="h-14 rounded-2xl border border-slate-100 text-slate-400 font-black uppercase tracking-widest active:bg-slate-50 transition-all">是 (Yes)</button>
                  <button onClick={() => showToast('已记录: 否')} className="h-14 rounded-2xl bg-primary text-slate-900 font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">否 (No)</button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white/40 rounded-[2.5rem] glass-panel border border-white/50 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
              <span className="material-symbols-outlined text-5xl">auto_fix_high</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-2">正在分析 {currentTicker}</h3>
            <p className="text-slate-500 text-sm font-medium mb-8">正在基于市场波动率、RSI 指标及您的情绪反馈计算最优仓位方案...</p>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress-fast"></div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="px-6 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-500 shadow-sm active:scale-90 transition-all"><span className="material-symbols-outlined">close</span></button>
        <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">评估流程 · Wizard</h1>
        <div className="w-10"></div>
      </header>

      <div className="px-10 py-2">
        <div className="flex justify-between items-end mb-2 px-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">进度 {step} / {totalSteps}</span>
          <span className="text-[9px] font-black text-primary">{Math.round((step/totalSteps)*100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${(step/totalSteps)*100}%` }}></div>
        </div>
      </div>

      <main className="flex-1 px-4 pt-8 pb-32 overflow-y-auto no-scrollbar">
        {renderStep()}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 pt-0 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/90 to-transparent z-50">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button 
            onClick={handleNext}
            className="w-full h-14 bg-slate-900 dark:bg-primary text-white dark:text-slate-900 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-slate-900/20"
          >
            <span>{step === totalSteps ? '完成评估' : '下一步'}</span>
            <span className="material-symbols-outlined">{step === totalSteps ? 'check_circle' : 'arrow_forward'}</span>
          </button>
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest active:text-slate-600 transition-colors"
          >
            返回上一步
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentFlow;
