import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Calendar, ClipboardList } from "lucide-react";
import prisma from "@/lib/prisma";
import MealPlanRenderer from "@/components/features/MealPlanRenderer";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login?callbackUrl=/profile");
    }

    const mealPlans = await prisma.mealPlan.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Details */}
                <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 lg:col-span-1 h-fit">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <User className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{session.user?.name}</h2>
                        <p className="text-gray-500">{session.user?.email}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <Mail className="w-5 h-5 text-gray-400 mr-4" />
                            <div className="overflow-hidden">
                                <div className="text-sm font-medium text-gray-500">Email Address</div>
                                <div className="font-semibold text-gray-900 truncate">{session.user?.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <Calendar className="w-5 h-5 text-gray-400 mr-4" />
                            <div>
                                <div className="text-sm font-medium text-gray-500">Member Since</div>
                                <div className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <form action="/api/auth/signout" method="POST">
                            <button type="submit" className="text-red-500 font-medium hover:text-red-600 transition">Sign Out</button>
                        </form>
                    </div>
                </div>

                {/* Saved Meal Plans */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center mb-6">
                        <ClipboardList className="w-6 h-6 text-emerald-600 mr-3" />
                        <h2 className="text-2xl font-bold text-slate-800">Saved Meal Plans</h2>
                    </div>

                    {mealPlans.length === 0 ? (
                        <div className="bg-white shadow-sm border border-slate-100 rounded-2xl p-12 text-center text-slate-500">
                            <p>You haven't saved any meal plans yet.</p>
                            <a href="/" className="text-emerald-600 hover:underline mt-2 inline-block font-medium">Generate your first plan!</a>
                        </div>
                    ) : (
                        mealPlans.map((plan) => (
                            <div key={plan.id} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-[24px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3 px-2">
                                        <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                            Saved on {new Date(plan.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <MealPlanRenderer content={plan.content} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
