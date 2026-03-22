import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Blockchain-Verified Ratings</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Rate Professors with{" "}
            <span className="text-primary">Complete Trust</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
            Our blockchain-powered platform ensures every rating is transparent,
            tamper-proof, and anonymous. Make informed academic decisions with
            confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/professors">
              <Button size="lg" variant="outline">
                Browse Professors
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Anonymous Voting</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Tamper-Proof</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <span>Fully Transparent</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16">
          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              {/* Terminal-style header */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-4 font-mono text-xs text-muted-foreground">
                  trustscore.blockchain
                </span>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <div className="grid gap-6 md:grid-cols-3">
                  {/* Block Card 1 */}
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">
                        Block #1842
                      </span>
                      <span className="rounded bg-success/20 px-2 py-0.5 text-xs text-success">
                        Verified
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-primary/30" />
                      <div className="h-2 w-3/4 rounded bg-primary/20" />
                      <div className="h-2 w-1/2 rounded bg-primary/10" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= 4 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">4.2</span>
                    </div>
                  </div>

                  {/* Block Card 2 */}
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">
                        Block #1843
                      </span>
                      <span className="rounded bg-success/20 px-2 py-0.5 text-xs text-success">
                        Verified
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-primary/30" />
                      <div className="h-2 w-4/5 rounded bg-primary/20" />
                      <div className="h-2 w-2/3 rounded bg-primary/10" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= 5 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">5.0</span>
                    </div>
                  </div>

                  {/* Block Card 3 */}
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">
                        Block #1844
                      </span>
                      <span className="rounded bg-primary/20 px-2 py-0.5 text-xs text-primary">
                        Mining...
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full animate-pulse rounded bg-primary/30" />
                      <div className="h-2 w-2/3 animate-pulse rounded bg-primary/20" />
                      <div className="h-2 w-1/3 animate-pulse rounded bg-primary/10" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${star <= 3 ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-medium">3.0</span>
                    </div>
                  </div>
                </div>

                {/* Chain visualization */}
                <div className="mt-6 flex items-center justify-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-1">0x7f3...</span>
                  <span>→</span>
                  <span className="rounded bg-muted px-2 py-1">0xa2b...</span>
                  <span>→</span>
                  <span className="rounded bg-muted px-2 py-1">0x9c1...</span>
                  <span>→</span>
                  <span className="animate-pulse rounded bg-primary/20 px-2 py-1 text-primary">
                    mining...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
