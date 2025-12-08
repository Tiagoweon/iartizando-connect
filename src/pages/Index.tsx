import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import TrainingInfoCard from "@/components/TrainingInfoCard";
import RegistrationForm from "@/components/RegistrationForm";
import HRPanel from "@/components/HRPanel";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Inscrição - Treinamento Corporativo | Iartizando</title>
        <meta
          name="description"
          content="Inscrição interna para o treinamento Dominando a Automação e Microinterações. Dias 11, 12 e 13 de dezembro às 10h."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8 md:py-12 space-y-8">
          {/* Informações do Treinamento */}
          <TrainingInfoCard />

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Inscrição */}
            <RegistrationForm />

            {/* Painel do RH */}
            <HRPanel />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Iartizando. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
