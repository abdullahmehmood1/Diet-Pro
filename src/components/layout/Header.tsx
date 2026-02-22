import Link from 'next/link';
import { Leaf, User as UserIcon } from 'lucide-react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Header() {
    const session = await getServerSession(authOptions);

    return (
        <header className="fixed top-4 w-full z-50 px-4 transition-all duration-300">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 border border-white/40 shadow-soft rounded-2xl px-6 h-16 flex justify-between items-center transition-all">

                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2 rounded-xl text-white shadow-glow group-hover:scale-105 transition-transform">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                            DietPro
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-1">
                        {[
                            { name: 'Dashboard', href: '/dashboard' },
                            { name: 'Food Log', href: '/dashboard/food-log' },
                            { name: 'Meal Planner', href: '/dashboard/planner' },
                        ].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-slate-600 rounded-full hover:bg-slate-100/80 hover:text-emerald-600 transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {session ? (
                            <Link href="/profile" className="flex items-center space-x-3 group cursor-pointer hover:bg-slate-50 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-slate-200">
                                <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                    <UserIcon className="w-4 h-4 text-emerald-700" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{session.user?.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/login"
                                    className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-emerald-600 shadow-lg hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
