"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Utensils, Flame, Activity } from "lucide-react";

interface LogEntry {
    id: string;
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    loggedAt: string;
}

export default function FoodLog() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/food-log");
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/food-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    calories: parseInt(formData.calories),
                    protein: formData.protein ? parseInt(formData.protein) : undefined,
                    carbs: formData.carbs ? parseInt(formData.carbs) : undefined,
                    fats: formData.fats ? parseInt(formData.fats) : undefined,
                }),
            });

            if (res.ok) {
                setFormData({ name: "", calories: "", protein: "", carbs: "", fats: "" });
                setShowForm(false);
                fetchLogs();
            }
        } catch (error) {
            console.error("Failed to add log", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        try {
            const res = await fetch(`/api/food-log/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setLogs(logs.filter((log) => log.id !== id));
            }
        } catch (error) {
            console.error("Failed to delete log", error);
        }
    };

    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);

    return (
        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Card */}
            <div className="lg:col-span-4">
                <div className="bg-white rounded-3xl shadow-soft p-8 border border-slate-100 sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 tracking-tight flex items-center">
                        <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center mr-4 text-orange-500 shadow-sm border border-orange-100/50">
                            <Flame className="w-5 h-5" />
                        </div>
                        Daily Summary
                    </h2>

                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                        <div className="text-6xl font-extrabold text-slate-900 tracking-tighter mb-2">{totalCalories}</div>
                        <div className="text-slate-500 font-medium text-sm uppercase tracking-wider">Calories Consumed</div>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`w-full py-4 px-6 rounded-2xl transition-all duration-300 flex justify-center items-center font-bold group ${showForm
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                                : 'bg-slate-900 text-white hover:bg-emerald-500 shadow-md hover:shadow-glow-lg hover:-translate-y-0.5'
                            }`}
                    >
                        <Plus className={`mr-2 w-5 h-5 transition-transform ${showForm ? 'rotate-45' : 'group-hover:rotate-90'}`} />
                        {showForm ? 'Cancel Entry' : 'Add New Meal'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
                {/* Add Entry Form */}
                {showForm && (
                    <div className="bg-white rounded-3xl shadow-soft p-8 border border-emerald-100 animate-in slide-in-from-top-4 fade-in duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2" />

                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                            <Activity className="w-5 h-5 text-emerald-500 mr-2" />
                            Log New Entry
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-slate-700">Food Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm"
                                    required
                                    placeholder="e.g. Grilled Chicken Salad with Avocado"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                                <div className="col-span-2 md:col-span-1 border-r-0 md:border-r border-slate-100 pr-0 md:pr-4">
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">Calories</label>
                                    <input
                                        type="number"
                                        value={formData.calories}
                                        onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                                        className="w-full p-3.5 bg-orange-50/50 border border-orange-100 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all outline-none md:text-sm text-orange-900 font-medium placeholder:text-orange-300"
                                        required
                                        placeholder="kcal"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">Protein</label>
                                    <input
                                        type="number"
                                        value={formData.protein}
                                        onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm"
                                        placeholder="g"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">Carbs</label>
                                    <input
                                        type="number"
                                        value={formData.carbs}
                                        onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm"
                                        placeholder="g"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-semibold text-slate-700">Fats</label>
                                    <input
                                        type="number"
                                        value={formData.fats}
                                        onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm"
                                        placeholder="g"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all font-bold shadow-md hover:shadow-glow-lg flex items-center justify-center space-x-2"
                                >
                                    <span>Save Entry</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Log List */}
                <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Entries</h2>
                        <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200/60">
                            {logs.length} {logs.length === 1 ? 'meal' : 'meals'} today
                        </span>
                    </div>

                    <div className="bg-white">
                        {loading ? (
                            <div className="p-12 text-center">
                                <Activity className="w-8 h-8 text-emerald-500 animate-pulse mx-auto mb-4" />
                                <div className="text-sm font-medium text-slate-400">Loading your meals...</div>
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="p-16 text-center flex flex-col items-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <Utensils className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-700 mb-2">No meals logged yet</h3>
                                <p className="text-slate-500 max-w-sm">Keep track of your nutrition by adding your first meal of the day.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <li key={log.id} className="p-6 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center group">
                                        <div className="mb-4 sm:mb-0">
                                            <div className="font-bold text-lg text-slate-900 mb-1">{log.name}</div>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                                <span className="inline-flex items-center text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-md">
                                                    {log.calories} kcal
                                                </span>
                                                {(log.protein || log.carbs || log.fats) && <span className="text-slate-300">•</span>}
                                                {log.protein && <span>{log.protein}g P</span>}
                                                {log.carbs && <span>{log.carbs}g C</span>}
                                                {log.fats && <span>{log.fats}g F</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start">
                                            <div className="text-xs font-medium text-slate-400 sm:mr-6 bg-slate-100 px-3 py-1 rounded-full">
                                                {new Date(log.loggedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(log.id)}
                                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
                                                title="Delete Entry"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
