'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useHydrationStore } from '@/lib/hydration-store';
import { TODAY } from '@/lib/constants'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function HydrationPage() {
  const { targetMl, setTargetMl, getDailyTotal, getWeeklyData, editDailyTotal } = useHydrationStore();
  
  const currentDate = TODAY || new Date().toISOString().split('T')[0]; 
  const currentTotal = getDailyTotal(currentDate);
  const weeklyData = getWeeklyData(currentDate);

  // Format data for the chart (adds short day names like Mon, Tue)
  const formattedWeeklyData = weeklyData.map(d => {
    const dateObj = new Date(d.date);
    return {
      ...d,
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' })
    };
  });

  // Calculate statistics
  const total7Days = weeklyData.reduce((sum, day) => sum + day.amountMl, 0);
  const dailyAverage = Math.round(total7Days / 7);

  // States for forms
  const [editValue, setEditValue] = useState(currentTotal.toString());
  const [goalValue, setGoalValue] = useState(targetMl.toString());

  // Keep the edit input synced if the user adds water from the dashboard
  useEffect(() => {
    setEditValue(currentTotal.toString());
  }, [currentTotal]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(editValue);
    if (!isNaN(val) && val >= 0) {
      editDailyTotal(val, currentDate);
    }
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(goalValue);
    if (!isNaN(val) && val > 0) {
      setTargetMl(val);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4ade80] via-[#34d399] to-[#fde047] p-4 font-sans pb-20">
      <div className="max-w-md mx-auto mt-6">
        {/* Header */}
        <Link href="/" className="text-white/90 hover:text-white text-sm flex items-center gap-2 mb-6 font-medium">
          &larr; Dashboard
        </Link>
        
        <h1 className="text-4xl font-bold text-white mb-1">Hydration</h1>
        <p className="text-white/90 text-sm">Stay above {targetMl} ml</p>
        <p className="text-white/80 text-sm mb-8">Daily minimum: {targetMl} ml</p>

        {/* Fake Tabs to match Sodium layout */}
        <div className="flex bg-white/20 rounded-2xl p-1 mb-6 backdrop-blur-sm">
          <button className="flex-1 text-white/80 py-2 text-sm font-medium">Last 24 Hours</button>
          <button className="flex-1 bg-white text-emerald-600 py-2 text-sm font-bold rounded-xl shadow-sm">Last 7 Days</button>
          <button className="flex-1 text-white/80 py-2 text-sm font-medium">Last 30 Days</button>
        </div>

        {/* Chart & Stats Card */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl mb-6">
          {/* Stats Grid */}
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{total7Days.toLocaleString()} <span className="text-sm font-normal text-gray-500">ml</span></p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Daily Average</p>
              <p className="text-2xl font-bold text-gray-900">{dailyAverage.toLocaleString()} <span className="text-sm font-normal text-gray-500">ml</span></p>
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-sm">Daily consumption (ml)</p>

          {/* Chart */}
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedWeeklyData} margin={{ top: 20, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="dayName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  domain={[0, 'dataMax + 500']}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} ml`, 'Intake']}
                />
                {/* Dashed line representing the minimum floor. I used blue for water instead of red for limit. */}
                <ReferenceLine 
                  y={targetMl} 
                  stroke="#3b82f6" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ position: 'bottom', value: `Floor: ${targetMl} ml`, fill: '#3b82f6', fontSize: 12, dy: 5 }} 
                />
                <Bar dataKey="amountMl" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-500">
            <strong className="text-blue-500">Blue dashed line</strong> = daily floor ({targetMl} ml). Green bars represent your intake.
          </p>
        </div>

        {/* Editing & Settings Card */}
        <div className="bg-white rounded-[1.5rem] p-6 shadow-xl space-y-6">
          <form onSubmit={handleEditSubmit}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Edit Today's Total (ml)</label>
            <div className="flex gap-3">
              <input 
                type="number" 
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl transition-colors">
                Update
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">This overrides the logged water for today.</p>
          </form>

          <div className="h-px w-full bg-gray-100"></div>

          <form onSubmit={handleGoalSubmit}>
            <label className="block text-sm font-bold text-gray-700 mb-2">Daily Goal Minimum (ml)</label>
            <div className="flex gap-3">
              <input 
                type="number" 
                value={goalValue}
                onChange={(e) => setGoalValue(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white font-bold px-6 py-2 rounded-xl transition-colors">
                Save Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}