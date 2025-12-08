import { Calendar, Clock, MapPin, Target } from "lucide-react";

const TrainingInfoCard = () => {
  return (
    <div className="card-corporate p-6 md:p-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Sobre o Treinamento
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Este treinamento foi desenvolvido para manter nossos colaboradores atualizados com as demandas do mercado.
            O objetivo é economizar tempo, aumentar produtividade e integrar serviços essenciais do dia a dia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Datas</span>
            <p className="font-semibold text-foreground">11/12, 12/12 e 13/12</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
          <Clock className="w-5 h-5 text-primary" />
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Horário</span>
            <p className="font-semibold text-foreground">10h</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Local</span>
            <p className="font-semibold text-foreground">Sala de treinamento 25</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingInfoCard;
