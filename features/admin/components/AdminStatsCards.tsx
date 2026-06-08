"use client";

import { useQuery } from "@tanstack/react-query";
import {
    CalendarCheck,
    CalendarClock,
    CircleDashed,
    Trophy,
    UserRound,
    Vote,
} from "lucide-react";
import { getAdminStats } from "../services/adminApi";

import { Card, CardContent } from "@/components/ui/card";

type AdminStats = {
    total_users: number;
    total_matches: number;
    total_predictions: number;
    completed_matches: number;
    upcoming_matches: number;
    pending_matches: number;
    pending_knockout_matches: number;
};

export const AdminStatsCards = () => {
    const { data, isLoading, isError } = useQuery<AdminStats>({
        queryKey: ["admin-stats"],
        queryFn: getAdminStats,
    });

    if (isLoading) {
        return (
            <div className="dark-panel p-6 text-center text-muted-foreground">
                Loading admin stats...
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="rounded-3xl border border-destructive/40 bg-card/80 p-6 text-center text-destructive">
                Failed to load admin stats.
            </div>
        );
    }

    const cards = [
        {
            title: "Users",
            value: data.total_users,
            icon: UserRound,
            helper: "Registered players",
        },
        {
            title: "Matches",
            value: data.total_matches,
            icon: Trophy,
            helper: "Total fixtures",
        },
        {
            title: "Predictions",
            value: data.total_predictions,
            icon: Vote,
            helper: "Submitted picks",
        },
        {
            title: "Completed",
            value: data.completed_matches,
            icon: CalendarCheck,
            helper: "Results updated",
        },
        {
            title: "Upcoming",
            value: data.upcoming_matches,
            icon: CalendarClock,
            helper: "Prediction open",
        },
        {
            title: "Pending KO",
            value: data.pending_knockout_matches,
            icon: CircleDashed,
            helper: "Teams not set",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <Card key={card.title} className="modern-card">
                        <CardContent className="p-5">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border bg-secondary">
                                    <Icon className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>

                            <p className="text-sm font-semibold text-muted-foreground">
                                {card.title}
                            </p>

                            <p className="mt-2 font-heading text-3xl font-black">
                                {card.value}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                {card.helper}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};