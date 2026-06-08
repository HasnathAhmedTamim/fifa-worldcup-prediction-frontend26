import { GuestGuard } from "@/components/shared/GuestGuard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <GuestGuard>
            <section className="flex min-h-[75vh] items-center justify-center">
                <div className="w-full">
                    <LoginForm />
                </div>
            </section>
        </GuestGuard>
    );
}