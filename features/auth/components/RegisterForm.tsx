"use client";

import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerSchema, RegisterFormValues } from "../schemas/authSchema";
import { registerUser } from "../services/authApi";
import { saveAuthStorage } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const RegisterForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            const result = await registerUser(values);

            saveAuthStorage(result.token, result.user);

            toast.success("Account created successfully");
            router.push("/");
        } catch (error: any) {
            const message = error.response?.data?.message || "Registration failed";

            toast.error(message);

            setError("root", {
                message,
            });
        }
    };

    return (
        <Card className="mx-auto max-w-md overflow-hidden rounded-[2rem] border bg-card/80 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="h-1.5 brand-gradient" />

            <CardHeader className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl border bg-secondary">
                    <UserPlus className="h-6 w-6 text-emerald-400" />
                </div>

                <div>
                    <CardTitle className="font-heading text-3xl font-black">
                        Join the league
                    </CardTitle>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Create an account and start predicting World Cup matches.
                    </p>
                </div>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {errors.root?.message && (
                        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                            {errors.root.message}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Name
                        </label>
                        <Input
                            placeholder="Your name"
                            className="soft-input h-12"
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Email
                        </label>
                        <Input
                            placeholder="you@example.com"
                            className="soft-input h-12"
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground">
                            Password
                        </label>
                        <Input
                            type="password"
                            placeholder="******"
                            className="soft-input h-12"
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="smooth-button h-12 w-full rounded-2xl font-bold"
                        disabled={isSubmitting}
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};