import { Shield, Lock, Eye, Zap, Users, CheckCircle } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Tamper-Proof Ratings",
      description:
        "Every rating is cryptographically signed and linked in a blockchain, making it impossible to alter or delete reviews.",
    },
    {
      icon: Lock,
      title: "Anonymous Voting",
      description:
        "Your identity is protected using cryptographic hashing. Rate professors without fear of identification or retaliation.",
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description:
        "Every rating can be verified on the blockchain. Check the integrity of any professor's rating chain anytime.",
    },
    {
      icon: Zap,
      title: "Proof of Work",
      description:
        "Each rating requires computational work, preventing spam and ensuring only genuine reviews are submitted.",
    },
    {
      icon: Users,
      title: "One Vote Per Professor",
      description:
        "Our unique identity hashing ensures each voter can only rate a professor once, maintaining fair statistics.",
    },
    {
      icon: CheckCircle,
      title: "Verified Chain",
      description:
        "Administrators can verify the entire rating chain to detect any tampering attempts or data corruption.",
    },
  ];

  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">
            Built on Trust, Powered by{" "}
            <span className="text-primary">Blockchain</span>
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            Our platform uses blockchain-inspired technology to ensure every
            rating is genuine, immutable, and trustworthy.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
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
  );
}
