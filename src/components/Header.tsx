import { GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="corporate-gradient text-primary-foreground py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Iartizando</span>
          </div>

          {/* Títulos */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold animate-fade-in">
            Inscrição Interna – Treinamento Corporativo
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Dominando a Automação e Microinterações
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
