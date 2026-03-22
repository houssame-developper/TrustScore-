"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, BookOpen, Star, ChevronRight } from "lucide-react";

interface Professor {
  id: string;
  name: string;
  department: string;
  subject: string;
  file?: string;
  created_at: string;
}

interface RatingStats {
  average_rating: number;
  total_ratings: number;
}

export function ProfessorCard({ professor }: { professor: Professor }) {
  const { data: ratingStats } = useSWR<RatingStats>(
    `/profs/${professor.id}/ratings`,
    fetcher,
    {
      revalidateOnFocus: false,
      onError: () => {
        // Silently handle errors for rating stats
      },
    }
  );

  const averageRating = ratingStats?.average_rating || 0;
  const totalRatings = ratingStats?.total_ratings || 0;

  return (
    <Card className="group overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold group-hover:text-primary">
              {professor.name}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{professor.department}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{professor.subject}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <Link href={`/professors/${professor.id}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
            View Profile
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
