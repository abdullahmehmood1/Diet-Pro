"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Apple, ArrowRight, Calendar, Utensils, Flame } from "lucide-react";

interface DashboardStats {
    calories: number;
    protein: number;
    recentLogs: {
        id: string;
        name: string;
        calories: number;
        loggedAt: string;
    }[];
}

export default function DashboardOverview({ userName }: { userName?: string | null }) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard/stats");
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Welcome back, {userName?.split(' ')[0] || 'User'}!</h1>
                    <p className="text-slate-500 mt-2 text-lg">Here is your daily nutrition overview.</p>
                </div>
                <Link href="/dashboard/planner" className="bg-slate-900 text-white px-6 py-3.5 rounded-full font-semibold hover:bg-emerald-500 transition-all duration-300 shadow-md hover:shadow-glow-lg hover:-translate-y-0.5 flex items-center group w-full md:w-auto justify-center">
                    Generate New Plan <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Stat Card 1 */}
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                        <Flame className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Calories Today</div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {loading ? "..." : stats?.calories || 0} <span className="text-base font-medium text-slate-400">kcal</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                        <Utensils className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Protein Consumed</div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            {loading ? "..." : stats?.protein || 0} <span className="text-base font-medium text-slate-400">g</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-500">
                        <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-500 mb-1">Day Streak</div>
                        <div className="text-3xl font-bold text-slate-900 tracking-tight">
                            3 <span className="text-base font-medium text-slate-400">days</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-soft border border-slate-100 h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900">Recent Meals</h2>
                        <Link href="/dashboard/food-log" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors">View All</Link>
                    </div>
                    {loading ? (
                        <div className="text-slate-400 text-center py-4 text-sm font-medium animate-pulse">Loading meals...</div>
                    ) : stats?.recentLogs.length === 0 ? (
                        <div className="text-slate-400 text-center py-10 font-medium">No meals logged yet today.</div>
                    ) : (
                        <div className="space-y-3">
                            {stats?.recentLogs.map(log => (
                                <div key={log.id} className="flex justify-between items-center p-3 hover:bg-slate-50/80 rounded-2xl transition cursor-default">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                                            <Apple className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <span className="font-semibold text-slate-700">{log.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">{log.calories} kcal</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-glow-lg p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center space-x-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
                            <Activity className="w-3 h-3" />
                            <span>Pro Tip</span>
                        </div>
                        <h2 className="text-3xl font-extrabold mb-4 leading-tight">Optimize Your <br /> Recovery</h2>
                        <p className="text-emerald-50/90 mb-8 text-lg font-medium max-w-sm">
                            Tracking your protein intake is crucial for muscle recovery and satiety. Aim for 20-30g per meal.
                        </p>
                    </div>
                    <Link href="/dashboard/planner" className="relative z-10 bg-white text-emerald-700 text-center py-4 rounded-xl font-bold hover:bg-slate-50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
                        Generate Optimal Plan
                    </Link>
                </div>
            </div>
        </div>
    );
}
