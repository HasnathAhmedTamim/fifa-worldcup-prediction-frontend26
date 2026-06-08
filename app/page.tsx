import { MatchListByDate } from "@/features/matches/components/MatchListByDate";
import { BadgeCheck, Medal, TrendingDown, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="dark-panel subtle-grid relative overflow-hidden p-6 md:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-28 left-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-secondary/50 px-4 py-2 text-sm font-semibold text-muted-foreground">
              <Trophy className="h-4 w-4 text-emerald-400" />
              FIFA World Cup 2026 Prediction League
            </div>

            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-black tracking-tight md:text-6xl">
                Predict every match.
                <br />
                Beat your friends.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Submit your scores before kickoff, track your points after
                results are updated, and climb the leaderboard with every
                correct prediction.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl border bg-background/40 p-4">
                <BadgeCheck className="mb-3 h-5 w-5 text-emerald-400" />
                <p className="font-bold">Exact Score</p>
                <p className="text-sm text-muted-foreground">+5 points</p>
              </div>

              <div className="rounded-3xl border bg-background/40 p-4">
                <Medal className="mb-3 h-5 w-5 text-amber-400" />
                <p className="font-bold">Correct Winner</p>
                <p className="text-sm text-muted-foreground">+3 points</p>
              </div>

              <div className="rounded-3xl border bg-background/40 p-4">
                <TrendingDown className="mb-3 h-5 w-5 text-red-400" />
                <p className="font-bold">Wrong Pick</p>
                <p className="text-sm text-muted-foreground">-1 point</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border bg-background/40 p-5">
            <p className="text-sm font-semibold text-muted-foreground">
              League Overview
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-card p-4">
                <p className="font-heading text-3xl font-black">104</p>
                <p className="text-xs text-muted-foreground">Fixtures</p>
              </div>

              <div className="rounded-2xl border bg-card p-4">
                <p className="font-heading text-3xl font-black">Live</p>
                <p className="text-xs text-muted-foreground">Leaderboard</p>
              </div>

              <div className="col-span-2 rounded-2xl border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  Admin updates results, then points and leaderboard refresh
                  automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MatchListByDate />
    </section>
  );
}