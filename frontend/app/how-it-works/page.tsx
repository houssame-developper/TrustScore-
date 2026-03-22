import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  UserPlus,
  Key,
  Search,
  Star,
  Link as LinkIcon,
  Shield,
  Lock,
  Eye,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up with your email and password. During registration, our system generates a unique RSA keypair for you. Your public key is stored on our servers, while you receive your private key.",
    },
    {
      icon: Key,
      number: "02",
      title: "Receive Your Keypair",
      description:
        "Your cryptographic keypair is essential for anonymous voting. The public key identifies you without revealing your identity, while the private key is used to sign your ratings.",
    },
    {
      icon: Search,
      number: "03",
      title: "Find Your Professor",
      description:
        "Browse through our database of professors. Search by name, department, or subject. View their current ratings and statistics before making your decision.",
    },
    {
      icon: Star,
      number: "04",
      title: "Submit Your Rating",
      description:
        "Rate your professor on a scale of 1-5. Your rating is signed with your private key, creating a cryptographic proof that you authorized this rating without revealing who you are.",
    },
    {
      icon: LinkIcon,
      number: "05",
      title: "Mining Process",
      description:
        "Our system performs proof-of-work to mine your rating into a new block. This requires computational effort, preventing spam and ensuring only genuine ratings are added.",
    },
    {
      icon: Shield,
      number: "06",
      title: "Blockchain Integration",
      description:
        "Your rating is linked to the previous rating in the chain using cryptographic hashes. This creates an immutable record that cannot be altered or deleted.",
    },
  ];

  const features = [
    {
      icon: Lock,
      title: "Anonymous Identity",
      description:
        "Your vote_identity_hash is derived from your public key and the professor's ID. This ensures you can only vote once per professor while keeping your identity hidden.",
    },
    {
      icon: Eye,
      title: "Transparent Verification",
      description:
        "Anyone can verify the integrity of the rating chain. If any rating is tampered with, the chain breaks and the manipulation is immediately detectable.",
    },
    {
      icon: CheckCircle,
      title: "One Vote Per Professor",
      description:
        "The vote_identity_hash system ensures fair voting. You cannot rate the same professor twice, maintaining the integrity of rating statistics.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">
              How <span className="text-primary">TrustScore</span> Works
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Understand the blockchain technology behind our transparent
              professor rating system.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="bg-card py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-mono text-2xl font-bold text-primary/30">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Security Features
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-card py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Ready to Rate with Confidence?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of students who trust TrustScore for honest,
              transparent, and tamper-proof professor ratings.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
