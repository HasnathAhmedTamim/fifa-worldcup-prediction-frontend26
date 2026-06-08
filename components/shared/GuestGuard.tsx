"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthUser } from "@/lib/auth";

export const GuestGuard = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const user = useAuthUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (user) {
            router.push("/");
        }
    }, [mounted, user, router]);

    if (!mounted) {
        return (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    if (user) {
        return (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
                Redirecting...
            </div>
        );
    }

    return <>{children}</>;
};