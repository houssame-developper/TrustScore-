import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary">
          {/* Background pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-background" />
            <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-background" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
          </div>

          <div className="relative px-8 py-16 text-center md:px-16 md:py-24">
            <h2 className="text-balance text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Ready to Rate with Confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-primary-foreground/80">
              Join thousands of students who trust TrustScore for honest,
              transparent, and tamper-proof professor ratings.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-background text-foreground hover:bg-background/90"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/professors">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Browse Professors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
