import { GuestGuard } from "@/components/shared/GuestGuard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
    return (
        <GuestGuard>
            <section className="flex min-h-[75vh] items-center justify-center">
                <div className="w-full">
                    <RegisterForm />
                </div>
            </section>
        </GuestGuard>
    );
}