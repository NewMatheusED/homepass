import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-10">
            <div className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_0%,hsl(var(--primary)/0.18),transparent)]" />

            <div className="relative flex flex-col items-center">
                <Link href="/" className="flex items-center gap-2">
                    <ApplicationLogo className="h-10 w-10 fill-current text-primary" />
                    <span className="text-lg font-semibold tracking-tight text-foreground">
                        homepass
                    </span>
                </Link>

                <div className="mt-8 w-full overflow-hidden rounded-xl border border-border bg-card px-6 py-6 shadow-glow sm:w-96 sm:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
