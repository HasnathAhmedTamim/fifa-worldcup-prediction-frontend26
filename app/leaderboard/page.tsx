import { PageHeader } from "@/components/shared/PageHeader";
import { LeaderboardTable } from "@/features/leaderboard/components/LeaderboardTable";

export default function LeaderboardPage() {
  return (
    <section className="space-y-8">
      <PageHeader
        badge="Live Rankings"
        title="Prediction Leaderboard"
        description="Rankings update after every result. Exact scores, correct winners, wrong picks, and total points decide the table."
      />

      <LeaderboardTable />
    </section>
  );
}