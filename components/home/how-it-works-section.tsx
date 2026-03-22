import { UserPlus, Search, Star, Link as LinkIcon } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: "Create Your Account",
      description:
        "Sign up and receive your unique cryptographic keypair. Your public key is stored securely, while you keep your private key safe.",
    },
    {
      icon: Search,
      number: "02",
      title: "Find Your Professor",
      description:
        "Browse through our database of professors by name, department, or subject. View their current ratings and statistics.",
    },
    {
      icon: Star,
      number: "03",
      title: "Submit Your Rating",
      description:
        "Rate your professor on a scale of 1-5. Your rating is signed with your private key and submitted for mining.",
    },
    {
      icon: LinkIcon,
      number: "04",
      title: "Rating is Mined",
      description:
        "Our system performs proof-of-work to mine your rating into a new block, linking it to the previous ratings in the chain.",
    },
  ];

  return (
    <section className="bg-card py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">
            How <span className="text-primary">TrustScore</span> Works
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            A simple four-step process to submit transparent, tamper-proof
            professor ratings.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <span className="mb-2 font-mono text-sm text-primary">
                  {step.number}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
