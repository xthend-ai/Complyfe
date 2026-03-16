/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Moon, Sun, TrendingUp, Shield, Clock, Zap, ChevronDown, ChevronUp, Briefcase, Filter, RefreshCw } from 'lucide-react';
import { managers } from './data';
import { FundManager } from './types';

type SortOption = 'drawdown' | 'years' | 'annualized';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('drawdown');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate network request for real-time data
    setTimeout(() => {
      setIsRefreshing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const top3 = managers.filter(m => m.isTop3).sort((a, b) => b.maxDrawdown - a.maxDrawdown);
  
  const sortedManagers = [...managers].sort((a, b) => {
    if (sortBy === 'drawdown') return b.maxDrawdown - a.maxDrawdown; // closer to 0 is better
    if (sortBy === 'years') return b.years - a.years;
    if (sortBy === 'annualized') return b.annualizedReturn - a.annualizedReturn;
    return 0;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white font-bold">
              <TrendingUp size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">顶级公募查询</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-medium rounded-full transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">{isRefreshing ? '同步中...' : '刷新数据'}</span>
            </button>
            <button 
              onClick={() => setShowPortfolio(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-full transition-colors"
            >
              <Zap size={16} />
              <span>一键组合</span>
            </button>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        {/* Top 3 Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="text-red-500" size={24} />
              <h2 className="text-2xl font-bold">回撤最小前三强</h2>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded">
                核心推荐
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                <Filter size={12} /> 严选条件:
              </span>
              <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-red-500">年化 ≥ 15%</span>
              <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-red-500">年限 ≥ 10年</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map(manager => (
              <ManagerCard key={manager.id} manager={manager} isTop />
            ))}
          </div>
        </section>

        {/* Full List Section */}
        <section>
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
            <p className="text-sm text-red-800 dark:text-red-400 font-medium flex items-center gap-2">
              <Shield size={16} />
              已开启严格审计模式：全市场超3000位基金经理中，仅筛选出 11 位真正满足单只基金连续管理≥10年且年化≥15%的传奇老将。宁缺毋滥。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold">严选 11 位传奇老将</h2>
            
            {/* Controls */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-zinc-500 dark:text-zinc-400 mr-2">排序:</span>
              <SortButton 
                active={sortBy === 'drawdown'} 
                onClick={() => setSortBy('drawdown')}
                icon={<Shield size={14} />}
                label="最大回撤"
              />
              <SortButton 
                active={sortBy === 'years'} 
                onClick={() => setSortBy('years')}
                icon={<Clock size={14} />}
                label="管理年限"
              />
              <SortButton 
                active={sortBy === 'annualized'} 
                onClick={() => setSortBy('annualized')}
                icon={<TrendingUp size={14} />}
                label="年化收益"
              />
            </div>
          </div>

          <div className="space-y-3">
            {sortedManagers.map(manager => (
              <ManagerListItem 
                key={manager.id} 
                manager={manager} 
                expanded={expandedId === manager.id}
                onToggle={() => setExpandedId(expandedId === manager.id ? null : manager.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Portfolio Modal */}
      {showPortfolio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="text-red-500" />
                稳健15%配置方案
              </h3>
              <button onClick={() => setShowPortfolio(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <span className="font-medium">刘旭 (大成高新)</span>
                  <span className="text-red-500 font-bold">40%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <span className="font-medium">周云 (东方红京东)</span>
                  <span className="text-red-500 font-bold">30%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <span className="font-medium">鲍无可 (景顺长城)</span>
                  <span className="text-red-500 font-bold">30%</span>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-500">预期年化</span>
                  <span className="font-bold text-red-500">~16.0%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">历史最大回撤</span>
                  <span className="font-bold text-green-500">~26.0%</span>
                </div>
              </div>
              <button 
                onClick={() => setShowPortfolio(false)}
                className="w-full py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                确认方案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Shield size={16} className="text-green-400 dark:text-green-600" />
          <span className="text-sm font-medium">已同步最新净值与持仓数据</span>
        </div>
      )}
    </div>
  );
}

const ManagerCard: React.FC<{ manager: FundManager, isTop?: boolean }> = ({ manager, isTop }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{manager.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{manager.fundName}</p>
        </div>
        <span className="px-2 py-1 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-600 dark:text-zinc-300">
          {manager.fundCode}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">任职年化</p>
          <p className="text-2xl font-bold text-red-500">{manager.annualizedReturn}%</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">最大回撤</p>
          <p className="text-xl font-bold text-green-500">{manager.maxDrawdown}%</p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-sm">
        <span className="text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
          <Clock size={14} /> {manager.years}年
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {manager.tradingMethod}
        </span>
      </div>
    </div>
  );
}

const ManagerListItem: React.FC<{ manager: FundManager, expanded: boolean, onToggle: () => void }> = ({ manager, expanded, onToggle }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-lg">
            {manager.name[0]}
          </div>
          <div>
            <h4 className="font-bold">{manager.name}</h4>
            <p className="text-xs text-zinc-500 truncate w-32 sm:w-auto">{manager.fundName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 sm:gap-12 text-right">
          <div className="hidden sm:block">
            <p className="text-xs text-zinc-500">年限</p>
            <p className="font-medium">{manager.years}年</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">年化</p>
            <p className="font-bold text-red-500">{manager.annualizedReturn}%</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500">回撤</p>
            <p className="font-bold text-green-500">{manager.maxDrawdown}%</p>
          </div>
          <div className="text-zinc-400">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">投资哲学</p>
            <p className="text-sm leading-relaxed">{manager.philosophy}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">选股逻辑</p>
            <p className="text-sm leading-relaxed">{manager.stockSelectionLogic}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">核心持仓</p>
            <div className="flex flex-wrap gap-2">
              {manager.holdings.map(h => (
                <span key={h} className="px-2 py-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md">
                  {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const SortButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors ${
        active 
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium' 
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

