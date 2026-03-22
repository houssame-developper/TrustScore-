"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfessorDetails } from "@/components/professors/professor-details";
import { RatingSection } from "@/components/professors/rating-section";
import { Loader2 } from "lucide-react";

export default function ProfessorPage() {
  const params = useParams();
  const profId = params.id as string;

  const { data: professor, error, isLoading } = useSWR(
    profId ? `/admin/profs/${profId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="py-24 text-center">
              <h2 className="text-xl font-semibold">Professor not found</h2>
              <p className="mt-2 text-muted-foreground">
                The professor you are looking for does not exist or you do not have permission to view.
              </p>
            </div>
          ) : professor ? (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProfessorDetails professor={professor} />
              </div>
              <div>
                <RatingSection profId={profId} />
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
