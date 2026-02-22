"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Save, Sparkles, Target, Utensils } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MealPlanner() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [output, setOutput] = useState("");
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [formData, setFormData] = useState({
        age: "",
        gender: "male",
        weight: "",
        goals: "",
    });

    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, [ws]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setOutput("");

        const { age, gender, weight, goals } = formData;
        const prompt = `Generate a personalized meal plan for a ${age} year old ${gender} with a weight of ${weight}kg who has fitness goals of ${goals}. Format the output nicely with markdown.`;

        const socket = new WebSocket('wss://backend.buildpicoapps.com/ask_ai_streaming_v2');
        setWs(socket);

        socket.addEventListener('open', () => {
            socket.send(
                JSON.stringify({
                    appId: "discussion-occur",
                    prompt: prompt,
                })
            );
        });

        socket.addEventListener('message', (event) => {
            setOutput((prev) => prev + event.data);
            setLoading(false); // Start showing data
        });

        socket.addEventListener('close', () => {
            setLoading(false);
            setWs(null);
        });

        socket.addEventListener('error', (error) => {
            console.error('WebSocket error', error);
            setLoading(false);
            alert("Oops, we ran into an error. Refresh the page and try again.");
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await fetch('/api/meal-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: output }),
            });

            if (!response.ok) {
                throw new Error("Failed to save meal plan");
            }
            alert("Meal plan saved successfully! You can view it in your profile.");
        } catch (error) {
            console.error(error);
            alert("Error saving meal plan");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Input Section */}
            <section className="bg-white shadow-soft rounded-3xl p-8 border border-slate-100 lg:col-span-4 h-fit sticky top-24">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center tracking-tight">
                        <span className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center mr-4 text-emerald-600 shadow-sm border border-emerald-100/50">
                            <Target className="w-5 h-5" />
                        </span>
                        Your Profile
                    </h2>
                    <p className="text-slate-500 mt-2 ml-14 text-sm">Fill in your physical details so our AI can tailor the perfect plan.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">Age</label>
                        <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm"
                            required
                            placeholder="e.g. 28"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">Gender</label>
                        <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm appearance-none cursor-pointer"
                            required
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">Weight (kg)</label>
                        <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none md:text-sm"
                            required
                            placeholder="e.g. 75"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-slate-700">Fitness Goals</label>
                        <textarea
                            value={formData.goals}
                            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none resize-none md:text-sm"
                            rows={3}
                            required
                            placeholder="e.g. I want to lose fat but maintain muscle mass while working out 3 days a week."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-slate-900 text-white py-4 px-6 rounded-2xl hover:bg-emerald-500 transition-all duration-300 font-bold shadow-md hover:shadow-glow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:hover:bg-slate-900 disabled:cursor-not-allowed flex justify-center items-center group"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin mr-2 w-5 h-5" /> Generating...</>
                        ) : (
                            <>Generate My Plan <Sparkles className="ml-2 w-4 h-4 text-emerald-400 group-hover:text-white transition-colors" /></>
                        )}
                    </button>
                </form>
            </section>

            {/* Output Section */}
            <section className="bg-white shadow-soft rounded-3xl p-8 border border-slate-100 lg:col-span-8 min-h-[600px] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-emerald-50 to-teal-50/20 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/2" />

                <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center tracking-tight">
                            <span className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center mr-4 text-teal-600 shadow-sm border border-teal-100/50">
                                <Sparkles className="w-5 h-5" />
                            </span>
                            Your Perfect Plan
                        </h2>
                        <p className="text-slate-500 mt-2 ml-14 text-sm">Powered by AI nutrition insights</p>
                    </div>
                    {output && !loading && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 px-4 py-2 rounded-xl flex items-center space-x-2 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50"
                            title="Save Plan"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span className="text-sm font-semibold">{saving ? "Saving..." : "Save"}</span>
                        </button>
                    )}
                </div>

                <div
                    ref={outputRef}
                    className="prose prose-slate prose-headings:text-slate-900 prose-a:text-emerald-600 hover:prose-a:text-emerald-500 max-w-none flex-grow bg-white/50 backdrop-blur-sm rounded-2xl overflow-y-auto max-h-[700px] whitespace-pre-wrap text-[15px] leading-relaxed pr-4 custom-scrollbar"
                >
                    {output ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {output}
                        </ReactMarkdown>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[400px] px-4 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Utensils className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready when you are</h3>
                            <p className="max-w-xs">Fill in your physical attributes and goals on the left to instantly generate your personalized dietary protocol.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
