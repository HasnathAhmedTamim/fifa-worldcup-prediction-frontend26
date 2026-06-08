"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { toast } from "sonner";

import { updateMatchStatus } from "../services/adminApi";

import { Button } from "@/components/ui/button";

type MatchStatus = "pending" | "upcoming" | "live" | "completed" | "cancelled";

type Props = {
    matchId: number;
    currentStatus: string;
};

export const UpdateMatchStatusForm = ({ matchId, currentStatus }: Props) => {
    const queryClient = useQueryClient();

    const [status, setStatus] = useState<MatchStatus>(
        currentStatus as MatchStatus
    );

    const mutation = useMutation({
        mutationFn: updateMatchStatus,
        onSuccess: () => {
            toast.success("Match status updated successfully");

            queryClient.invalidateQueries({ queryKey: ["admin-matches"] });
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: ["matches-by-date"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update status");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutation.mutate({
            matchId,
            payload: {
                status,
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form-panel space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-secondary">
                    <Activity className="h-5 w-5 text-emerald-400" />
                </div>

                <div>
                    <p className="font-heading font-bold">Update Match Status</p>
                    <p className="text-xs text-muted-foreground">
                        Control prediction availability and match lifecycle.
                    </p>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                    Status
                </label>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MatchStatus)}
                    className="h-11 w-full rounded-2xl border bg-background/60 px-3 py-2 text-sm"
                >
                    <option value="pending">Pending</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <Button
                type="submit"
                disabled={mutation.isPending}
                className="smooth-button h-11 w-full rounded-2xl font-bold"
            >
                {mutation.isPending ? "Updating..." : "Update Status"}
            </Button>
        </form>
    );
};