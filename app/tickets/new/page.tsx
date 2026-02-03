import TicketForm from "@/components/TicketForm";

export default function NewTicketPage() {
    return (
        <div className="min-h-screen bg-stone-100 dark:bg-stone-950 py-10">
            <div className="container mx-auto px-4">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white mb-2">E-Solutions Manager</h1>
                    <p className="text-stone-600 dark:text-stone-400">Sistema de Gestión de Reparaciones</p>
                </header>

                <TicketForm />
            </div>
        </div>
    );
}
