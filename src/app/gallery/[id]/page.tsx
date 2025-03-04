"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function GalleryOptions() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <button
            className="bg-[var(--primary-bg)] text-onSecondary px-4 py-2 rounded-md"
            onClick={() => router.push(`/gallery/${id}/dome`)}
          >
            Dome
          </button>
          <button
            className="bg-[var(--primary-bg)] text-onSecondary px-4 py-2 rounded-md"
            onClick={() => router.push(`/gallery/${id}/room`)}
          >
            Room
          </button>
          <button
            className="bg-[var(--primary-bg)] text-onSecondary px-4 py-2 rounded-md"
            onClick={() => router.push(`/gallery/${id}/gallery`)}
          >
            Gallery
          </button>
        </div>
      </main>
    </div>
  );
}
