import { Suspense } from "react";
import PublicProfileView from "./PublicProfileView";

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <Suspense fallback={<div className="p-8 text-center">Loading profile...</div>}>
            <PublicProfileView userId={id} />
        </Suspense>
    );
}
