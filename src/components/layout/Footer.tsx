import Link from 'next/link';
import { Leaf } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200/60 pt-16 pb-8 mt-auto">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center space-x-2 group">
                            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-1.5 rounded-lg text-white shadow-glow">
                                <Leaf className="w-4 h-4" />
                            </div>
                            <span className="text-xl font-bold text-slate-800 tracking-tight">
                                DietPro
                            </span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Your personal AI-powered dietitian. Start generating your perfect meal plans and tracking calories with unprecedented ease.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-500 flex flex-col">
                            <Link href="/dashboard/planner" className="hover:text-emerald-600 transition-colors w-max">Meal Planner</Link>
                            <Link href="/dashboard/food-log" className="hover:text-emerald-600 transition-colors w-max">Food Log</Link>
                            <Link href="/pricing" className="hover:text-emerald-600 transition-colors w-max">Pricing</Link>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 mb-4">Legal & Support</h4>
                        <ul className="space-y-3 text-sm text-slate-500 flex flex-col">
                            <Link href="/privacy" className="hover:text-emerald-600 transition-colors w-max">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-emerald-600 transition-colors w-max">Terms of Service</Link>
                            <Link href="/contact" className="hover:text-emerald-600 transition-colors w-max">Contact</Link>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-sm text-slate-400">
                        &copy; {new Date().getFullYear()} DietPro Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-slate-400">
                        <a href="#" className="hover:text-emerald-500 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Instagram</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
