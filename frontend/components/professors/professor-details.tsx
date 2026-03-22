"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, BookOpen, Calendar, Star, Shield } from "lucide-react";

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
  rating_distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export function ProfessorDetails({ professor }: { professor: Professor }) {
  const { data: ratingStats } = useSWR<RatingStats>(
    `/profs/${professor.id}/ratings`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const averageRating = ratingStats?.average_rating || 0;
  const totalRatings = ratingStats?.total_ratings || 0;
  const distribution = ratingStats?.rating_distribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Professor Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
              <User className="h-12 w-12 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold md:text-3xl">{professor.name}</h1>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{professor.department}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <BookOpen className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{professor.subject}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span>Added on {formatDate(professor.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating Statistics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Rating Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Average Rating */}
            <div className="text-center sm:pr-8 sm:border-r sm:border-border">
              <div className="text-5xl font-bold text-primary">
                {averageRating.toFixed(1)}
              </div>
              <div className="mt-2 flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
              </p>
            </div>

            {/* Distribution */}
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = distribution[rating as keyof typeof distribution] || 0;
                const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-3 text-sm text-muted-foreground">{rating}</span>
                    <Star className="h-4 w-4 text-primary" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-muted-foreground">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Verification */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-6">
          <Shield className="h-8 w-8 flex-shrink-0 text-primary" />
          <div>
            <h3 className="font-semibold">Blockchain-Verified Ratings</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All ratings for this professor are stored on our blockchain, ensuring they are
              tamper-proof and transparent. Each rating is cryptographically signed and linked
              to the previous rating, creating an immutable chain of reviews.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
