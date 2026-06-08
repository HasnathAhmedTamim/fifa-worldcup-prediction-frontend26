import { AuthGuard } from "@/components/shared/AuthGuard";
import { PageHeader } from "@/components/shared/PageHeader";
import { MyPredictionsList } from "@/features/predictions/components/MyPredictionsList";

export default function MyPredictionsPage() {
    return (
        <AuthGuard>
            <section className="space-y-8">
                <PageHeader
                    badge="Your Picks"
                    title="My Predictions"
                    description="Track your submitted scores, actual results, earned points, and wrong predictions in one place."
                />

                <MyPredictionsList />
            </section>
        </AuthGuard>
    );
}