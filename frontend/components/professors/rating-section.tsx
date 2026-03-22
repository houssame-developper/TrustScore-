"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { ratingApi, authApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { Star, Loader2, Lock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { mutate } from "swr";

export function RatingSection({ profId }: { profId: string }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (!selectedRating || !user) return;

    setIsSubmitting(true);

    try {
      // Get user's keypair
      const keypairResponse = await authApi.getKeypair();
      const privateKey = keypairResponse.private_key;

      if (!privateKey) {
        toast({
          title: "Keypair not found",
          description: "Unable to retrieve your private key. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      // Submit rating
      await ratingApi.addRating(profId, selectedRating, privateKey);

      toast({
        title: "Rating submitted!",
        description: "Your rating has been mined and added to the blockchain.",
        variant: "default",
      });

      // Reset and refresh
      setSelectedRating(0);
      mutate(`/profs/${profId}/ratings`);
    } catch (error) {
      toast({
        title: "Rating failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to submit your rating. You may have already rated this professor.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Rate This Professor
          </CardTitle>
          <CardDescription>
            Sign in to submit your anonymous rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            You need to be signed in to rate professors. Your identity will remain
            anonymous thanks to our blockchain technology.
          </p>
          <div className="flex gap-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full">Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user.role === "admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Administrators cannot submit ratings. Only registered voters can rate
            professors to ensure fair and unbiased reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Rate This Professor
        </CardTitle>
        <CardDescription>
          Your rating will be anonymously added to the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Star Rating */}
        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setSelectedRating(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
              disabled={isSubmitting}
            >
              <Star
                className={`h-10 w-10 transition-colors ${
                  rating <= (hoveredRating || selectedRating)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Rating Label */}
        <div className="mb-6 text-center">
          {selectedRating > 0 ? (
            <span className="text-lg font-semibold">
              {selectedRating === 1 && "Poor"}
              {selectedRating === 2 && "Fair"}
              {selectedRating === 3 && "Good"}
              {selectedRating === 4 && "Very Good"}
              {selectedRating === 5 && "Excellent"}
            </span>
          ) : (
            <span className="text-muted-foreground">Select a rating</span>
          )}
        </div>

        {/* Submit Button */}
        <Button
          className="w-full"
          onClick={handleSubmitRating}
          disabled={!selectedRating || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mining your rating...
            </>
          ) : (
            "Submit Rating"
          )}
        </Button>

        {/* Info */}
        <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
          <p>
            <strong>Note:</strong> You can only rate each professor once. Your rating
            is cryptographically signed with your private key and mined into the
            blockchain.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
