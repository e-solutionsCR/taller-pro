import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1 bg-muted/30 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
