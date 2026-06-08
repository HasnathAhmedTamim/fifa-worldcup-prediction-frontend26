"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthUser } from "@/lib/auth";

type AuthGuardProps = {
    children: ReactNode;
    requireAdmin?: boolean;
};

export const AuthGuard = ({ children, requireAdmin = false }: AuthGuardProps) => {
    const router = useRouter();
    const user = useAuthUser();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!user) {
            toast.error("Please login first");
            router.push("/login");
            return;
        }

        if (requireAdmin && user.role !== "admin") {
            toast.error("Admin access required");
            router.push("/");
        }
    }, [mounted, user, requireAdmin, router]);

    if (!mounted) {
        return (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
                Checking authentication...
            </div>
        );
    }

    if (requireAdmin && user.role !== "admin") {
        return (
            <div className="rounded-lg border p-6 text-center text-muted-foreground">
                Checking admin access...
            </div>
        );
    }

    return <>{children}</>;
};