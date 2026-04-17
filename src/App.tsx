/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Briefcase, 
  MapPin, 
  Users, 
  BarChart3, 
  Filter, 
  RotateCcw,
  Star,
  Layers,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateMockData } from './data/mockData';
import { KPICard } from './components/KPICard';
import { PreferredToolChart, PreferencePieChart, SatisfactionChart, TrendLineChart, RegionStackedChart } from './components/PollCharts';
import { DataTable } from './components/DataTable';
import { WordCloud } from './components/WordCloud';
import { PollResponse } from './types';

export default function App() {
  const [rawData] = useState<PollResponse[]>(() => generateMockData(300));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'data' | 'insights'>('dashboard');
  
  // Filters
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedAge, setSelectedAge] = useState<string>('All');
  
  const regions = useMemo(() => ['All', ...Array.from(new Set(rawData.map(d => d.region)))], [rawData]);
  const ageGroups = useMemo(() => ['All', ...Array.from(new Set(rawData.map(d => d.ageGroup)))], [rawData]);

  const filteredData = useMemo(() => {
    return rawData.filter(d => {
      const regionMatch = selectedRegion === 'All' || d.region === selectedRegion;
      const ageMatch = selectedAge === 'All' || d.ageGroup === selectedAge;
      return regionMatch && ageMatch;
    });
  }, [rawData, selectedRegion, selectedAge]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return { total: 0, top: 'N/A', avg: 0, regions: 0 };
    
    const counts: Record<string, number> = {};
    let sumSat = 0;
    const rSet = new Set<string>();
    
    filteredData.forEach(d => {
      counts[d.preferredTool] = (counts[d.preferredTool] || 0) + 1;
      sumSat += d.satisfaction;
      rSet.add(d.region);
    });

    const top = Object.entries(counts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';
    
    return {
      total: filteredData.length,
      top,
      avg: (sumSat / filteredData.length).toFixed(2),
      regions: rSet.size
    };
  }, [filteredData]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white border-r border-line flex flex-col shrink-0">
        <div className="p-8 border-b border-line">
          <h1 className="font-serif italic text-2xl font-black tracking-tighter leading-tight">
            PollVis<span className="text-black/30">.01</span>
          </h1>
          <p className="col-label mt-1">Data Processing Unit</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
              activeTab === 'dashboard' ? "bg-ink text-white font-medium" : "hover:bg-black/5 opacity-70 hover:opacity-100"
            )}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Mission Control</span>
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
              activeTab === 'data' ? "bg-ink text-white font-medium" : "hover:bg-black/5 opacity-70 hover:opacity-100"
            )}
          >
            <Database className="w-4 h-4" />
            <span>Raw Dataset</span>
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200",
              activeTab === 'insights' ? "bg-ink text-white font-medium" : "hover:bg-black/5 opacity-70 hover:opacity-100"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Insight Report</span>
          </button>
        </nav>

        <div className="p-6 border-t border-line bg-black/5">
          <div className="flex items-center gap-2 mb-4 opacity-50">
            <Filter className="w-3 h-3 " />
            <span className="col-label">Global Filters</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="col-label block mb-1">Region</label>
              <select 
                value={selectedRegion} 
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-transparent border-b border-line py-1 text-xs mono-value focus:outline-none focus:border-ink transition-colors"
              >
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="col-label block mb-1">Age Segment</label>
              <select 
                value={selectedAge} 
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full bg-transparent border-b border-line py-1 text-xs mono-value focus:outline-none focus:border-ink transition-colors"
              >
                {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <button 
              onClick={() => { setSelectedRegion('All'); setSelectedAge('All'); }}
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-ink/40 hover:text-ink transition-colors mt-4"
            >
              <RotateCcw className="w-3 h-3" /> Reset Controls
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        {/* Header Bar */}
        <header className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-line px-8 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 text-[10px] col-label">
              <span>System</span>
              <span className="opacity-30">/</span>
              <span>Visualizer</span>
              <span className="opacity-30">/</span>
              <span className="text-ink opacity-100 uppercase">{activeTab}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] col-label">System Status</span>
              <span className="text-[10px] mono-value text-green-600 font-bold">OPERATIONAL</span>
            </div>
            <div className="h-8 w-px bg-line" />
            <div className="text-[10px] mono-value opacity-50">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </header>

        <section className="p-8 pb-16 space-y-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
                  <KPICard label="Total Responses" value={stats.total} icon={Users} subValue="Ingested Records" />
                  <KPICard label="Primary Tool" value={stats.top} icon={Briefcase} subValue="Mode Selection" />
                  <KPICard label="Average Satisfaction" value={stats.avg} icon={Star} subValue="Out of 5.0" />
                  <KPICard label="Active Regions" value={stats.regions} icon={MapPin} subValue="Coverage Area" />
                </div>

                {/* Primary Chart Group */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-line p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="col-label">Market Share by Tool</h3>
                      <BarChart3 className="w-4 h-4 opacity-20" />
                    </div>
                    <PreferredToolChart data={filteredData} />
                  </div>
                  <div className="bg-white border border-line p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="col-label">Satisfaction Distribution</h3>
                      <Layers className="w-4 h-4 opacity-20" />
                    </div>
                    <SatisfactionChart data={filteredData} />
                  </div>
                </div>

                {/* Secondary Chart Group */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white border border-line p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="col-label">Submission Volume (90 Days)</h3>
                      <TrendingUp className="w-4 h-4 opacity-20" />
                    </div>
                    <TrendLineChart data={filteredData} />
                  </div>
                  <div className="bg-white border border-line p-6">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="col-label">Tool Composition</h3>
                      <RotateCcw className="w-4 h-4 opacity-20" />
                    </div>
                    <PreferencePieChart data={filteredData} />
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-white border border-line p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="col-label">Regional Preference Matrix</h3>
                    <MapPin className="w-4 h-4 opacity-20" />
                  </div>
                  <RegionStackedChart data={filteredData} />
                </div>
              </motion.div>
            )}

            {activeTab === 'data' && (
              <motion.div 
                key="data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Record Explorer</h2>
                    <p className="col-label">Raw survey data synchronized with current filters</p>
                  </div>
                  <div className="mono-value text-xs bg-ink text-white px-3 py-1">
                    TOTAL ROWS: {filteredData.length}
                  </div>
                </div>
                <DataTable data={filteredData} />
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div 
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-line p-8 space-y-4">
                      <h2 className="font-serif italic text-3xl">Executive Insight Summary</h2>
                      <div className="h-px bg-line w-24" />
                      <div className="prose prose-sm max-w-none text-ink/80 space-y-4">
                        <p>Based on our analysis of <span className="mono-value font-bold">{stats.total}</span> verified responses, several key patterns have emerged across tools and regions.</p>
                        <div className="bg-bg p-4 border-l-4 border-ink italic">
                          "The data suggests a strong correlation between simplified toolchains and higher satisfaction ratings across all tracked regions."
                        </div>
                        <ul className="space-y-3 list-none p-0">
                          <li className="flex gap-4">
                            <span className="mono-value text-blue-600 font-bold">01/</span>
                            <span><strong className="text-ink">Domination of {stats.top}:</strong> Currently holding a significant lead in preference within the filtered segment.</span>
                          </li>
                          <li className="flex gap-4">
                            <span className="mono-value text-blue-600 font-bold">02/</span>
                            <span><strong className="text-ink">Satisfaction Ceiling:</strong> The average rating of {stats.avg} indicates consistent performance but room for UX optimizations in high-friction demographics.</span>
                          </li>
                          <li className="flex gap-4">
                            <span className="mono-value text-blue-600 font-bold) opacity-100">03/</span>
                            <span><strong className="text-ink">Regional Variance:</strong> Fragmented usage across {stats.regions} regions requires localized support strategies.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-ink text-white p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <MessageSquare className="w-4 h-4 text-blue-400" />
                        <span className="col-label text-white/60">Semantic Analysis</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">Feedback Trends</h3>
                      <p className="text-xs opacity-60 leading-relaxed mb-6">Automated extraction of high-frequency keywords from text comments.</p>
                      <div className="bg-white/10 p-4 rounded-sm">
                        <div className="space-y-3">
                          {['Intuitive', 'Better documentation', 'Faster', 'Community'].map(w => (
                            <div key={w} className="flex justify-between items-center border-b border-white/10 pb-2">
                              <span className="mono-value text-[10px]">{w}</span>
                              <div className="h-1.5 w-16 bg-white/5 overflow-hidden">
                                <div className="h-full bg-blue-400 w-2/3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <Layers className="w-4 h-4 opacity-40" />
                    <h3 className="col-label">Qualitative Sentiment Cloud</h3>
                  </div>
                  <WordCloud feedback={filteredData.map(d => d.feedback)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

