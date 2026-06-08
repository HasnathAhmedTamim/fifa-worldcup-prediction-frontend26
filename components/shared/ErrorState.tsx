export const ErrorState = ({ text = "Something went wrong." }: { text?: string }) => {
    return (
        <div className="rounded-lg border border-red-200 p-6 text-center text-red-500">
            {text}
        </div>
    );
};