import { CheckCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal = ({ open, onClose }: SuccessModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-success-light flex items-center justify-center mb-4 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground text-center">
            Inscrição Realizada!
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-4 py-4">
          <p className="text-muted-foreground">
            Sua inscrição no treinamento foi realizada com sucesso.
          </p>
          <p className="text-muted-foreground">
            Você receberá um e-mail de confirmação em breve.
          </p>
        </div>

        <Button onClick={onClose} className="w-full btn-corporate">
          Entendido
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
