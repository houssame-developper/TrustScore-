import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProfessorsList } from "@/components/professors/professors-list";
import { ProfessorsSearch } from "@/components/professors/professors-search";

export default function ProfessorsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold md:text-4xl">Browse Professors</h1>
            <p className="mt-2 text-muted-foreground">
              Search and rate professors with blockchain-verified transparency
            </p>
          </div>
          <ProfessorsSearch />
          <ProfessorsList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
