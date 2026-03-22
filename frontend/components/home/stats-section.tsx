export function StatsSection() {
  const stats = [
    {
      value: "10K+",
      label: "Verified Ratings",
      description: "Blockchain-confirmed reviews",
    },
    {
      value: "500+",
      label: "Professors",
      description: "Across multiple departments",
    },
    {
      value: "99.9%",
      label: "Uptime",
      description: "Reliable service guaranteed",
    },
    {
      value: "0",
      label: "Data Tampering",
      description: "Immutable blockchain records",
    },
  ];

  return (
    <section className="border-y border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 font-medium">{stat.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
