import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardOverview from "@/components/features/DashboardOverview";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/dashboard");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <DashboardOverview userName={session.user?.name} />
        </div>
    );
}
