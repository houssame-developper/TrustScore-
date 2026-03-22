import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, Users, Lock, Eye, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Built on Trust</span>
            </div>
            <h1 className="text-4xl font-bold md:text-5xl">
              About <span className="text-primary">TrustScore</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              We are revolutionizing academic feedback with blockchain
              technology, ensuring every rating is genuine, immutable, and
              trustworthy.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-card py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
              <p className="mb-4 text-muted-foreground">
                TrustScore was created to solve a fundamental problem in
                academic feedback: trust. Traditional rating systems are
                vulnerable to manipulation, fake reviews, and data tampering.
                Students often cannot trust the ratings they see, and professors
                have no way to verify the authenticity of their reviews.
              </p>
              <p className="text-muted-foreground">
                By implementing blockchain-inspired technology, we have created
                a system where every rating is cryptographically signed, linked
                to previous ratings in an immutable chain, and completely
                anonymous. This ensures that students can rate their professors
                honestly without fear of identification, while maintaining the
                integrity of the entire rating system.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Our Values</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Integrity</h3>
                  <p className="text-sm text-muted-foreground">
                    Every rating is protected by cryptographic proofs that
                    ensure data cannot be tampered with.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your identity is protected through advanced hashing
                    techniques while still preventing duplicate votes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    Anyone can verify the integrity of any rating chain,
                    ensuring complete accountability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by students, for students. We believe in the power of
                    honest academic feedback.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="bg-card py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-6 text-3xl font-bold">Our Technology</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  TrustScore uses a blockchain-inspired architecture to ensure
                  the integrity of all ratings. Each rating is treated as a
                  block containing:
                </p>
                <ul className="ml-6 list-disc space-y-2">
                  <li>
                    <strong className="text-foreground">
                      Vote Identity Hash:
                    </strong>{" "}
                    A unique identifier derived from your public key and the
                    professor ID, ensuring you can only rate each professor once.
                  </li>
                  <li>
                    <strong className="text-foreground">Rating Value:</strong>{" "}
                    Your rating from 1 to 5 stars.
                  </li>
                  <li>
                    <strong className="text-foreground">Timestamp:</strong> The
                    exact time the rating was submitted.
                  </li>
                  <li>
                    <strong className="text-foreground">Previous Hash:</strong>{" "}
                    A link to the previous rating block, creating an unbreakable
                    chain.
                  </li>
                  <li>
                    <strong className="text-foreground">Block Hash:</strong> A
                    cryptographic hash of all block data, proving integrity.
                  </li>
                  <li>
                    <strong className="text-foreground">Nonce:</strong> A value
                    found through proof-of-work mining, preventing spam.
                  </li>
                </ul>
                <p>
                  This architecture ensures that any attempt to modify a rating
                  would break the chain, immediately exposing the tampering.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Join TrustScore Today</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Be part of the revolution in academic feedback. Start rating
              professors with complete confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
