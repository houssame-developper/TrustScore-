"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { ProfessorCard } from "./professor-card";
import { Loader2, Users } from "lucide-react";

interface Professor {
  id: string;
  name: string;
  department: string;
  subject: string;
  file?: string;
  created_at: string;
}

export function ProfessorsList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data, error, isLoading } = useSWR<Professor[]>(
    "/admin/profs/",
    fetcher,
    {
      revalidateOnFocus: false,
      onError: (err) => {
        console.log("[v0] Error fetching professors:", err.message);
      },
    }
  );

  // Filter professors based on search
  const filteredProfessors = data?.filter((prof) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      prof.name.toLowerCase().includes(searchLower) ||
      prof.department.toLowerCase().includes(searchLower) ||
      prof.subject.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">Unable to load professors</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Please make sure you are logged in and try again.
        </p>
      </div>
    );
  }

  if (!filteredProfessors || filteredProfessors.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No professors found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {search
            ? "Try adjusting your search terms."
            : "Professors will appear here once added by an administrator."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredProfessors.map((professor) => (
        <ProfessorCard key={professor.id} professor={professor} />
      ))}
    </div>
  );
}
