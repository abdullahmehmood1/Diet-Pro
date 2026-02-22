import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Mail, Calendar } from "lucide-react";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/profile");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

            <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 max-w-2xl mx-auto">
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
                        <div>
                            <div className="text-sm font-medium text-gray-500">Email Address</div>
                            <div className="font-semibold text-gray-900">{session.user?.email}</div>
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
        </div>
    );
}
