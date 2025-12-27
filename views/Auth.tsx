
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../App';
import { User } from '../types';

const Auth: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('111');
  const [password, setPassword] = useState('111');
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
      const newUser: User = {
        id: 'u_' + Date.now(),
        username: username || 'Trader',
        password: password || '111',
        role: 'member',
        avatar: `https://ui-avatars.com/api/?name=${username || 'T'}&background=3ebfea&color=fff`
      };
      showToast(`注册成功！账户: ${newUser.username}`);
      login(newUser);
      navigate('/dashboard');
    } else {
      // Logic for default user 111
      if (username === '111' && password === '111') {
        login({ 
          id: 'user_111', 
          username: 'Trader 111', 
          role: 'member', 
          avatar: 'https://ui-avatars.com/api/?name=111&background=3ebfea&color=fff' 
        });
        navigate('/dashboard');
      } else if (username === 'admin' && password === 'admin123') {
        login({ id: 'admin_1', username: 'Admin', role: 'member', avatar: 'https://ui-avatars.com/api/?name=Admin&background=333&color=fff' });
        navigate('/dashboard');
      } else {
        showToast('账号或密码错误 (尝试 111 / 111)');
      }
    }
  };

  const handleGuestEntry = () => {
    login({ id: 'guest_' + Date.now(), username: '访客', role: 'guest' });
    showToast('以访客身份进入 (数据不持久化)');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <header className="pt-12 pb-10">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-8 active:scale-90 transition-all text-slate-400">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
          {isRegister ? '创建您的\n交易系统' : '欢迎回来,\n交易员'}
        </h1>
        <p className="text-slate-500 text-sm font-bold mt-2 uppercase tracking-widest opacity-60">
          Professional Risk Framework
        </p>
      </header>

      <form onSubmit={handleAuth} className="space-y-5 flex-grow">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">用户名</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
            <input 
              type="text" 
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-soft text-sm font-bold focus:ring-2 focus:ring-primary/50 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">密码</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-soft text-sm font-bold focus:ring-2 focus:ring-primary/50 dark:text-white"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full h-15 bg-primary text-slate-900 rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4"
        >
          {isRegister ? '完成注册' : '立即登录'}
        </button>

        <div className="text-center py-4">
          <button 
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
          >
            {isRegister ? '已有账号? 去登录' : '没有账号? 立即注册'}
          </button>
        </div>
      </form>

      <div className="pb-10 space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">或者</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
        </div>
        <button 
          onClick={handleGuestEntry}
          className="w-full h-12 bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 active:scale-95 transition-all"
        >
          直接查看 (访客模式)
        </button>
      </div>
    </div>
  );
};

export default Auth;
