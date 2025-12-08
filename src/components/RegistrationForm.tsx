import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, User, Mail, Building, Gauge, Calendar, Accessibility, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SuccessModal from "./SuccessModal";

const formSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  corporateEmail: z.string().email("E-mail inválido").max(255),
  department: z.string().min(1, "Selecione um departamento"),
  automationFamiliarity: z.string().min(1, "Selecione seu nível de familiaridade"),
  participationDay: z.string().min(1, "Selecione o dia de participação"),
  needsAccessibility: z.boolean(),
  accessibilityDescription: z.string().optional(),
  observations: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const departments = ["RH", "TI", "Vendas", "Operações", "Marketing", "Financeiro"];
const familiarityLevels = [
  { value: "baixo", label: "Baixo" },
  { value: "medio", label: "Médio" },
  { value: "alto", label: "Alto" },
];
const trainingDays = ["11/12", "12/12", "13/12"];

const RegistrationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      corporateEmail: "",
      department: "",
      automationFamiliarity: "",
      participationDay: "",
      needsAccessibility: false,
      accessibilityDescription: "",
      observations: "",
    },
  });

  const needsAccessibility = form.watch("needsAccessibility");

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("registrations").insert({
        full_name: data.fullName,
        corporate_email: data.corporateEmail,
        department: data.department,
        automation_familiarity: data.automationFamiliarity,
        participation_day: data.participationDay,
        needs_accessibility: data.needsAccessibility,
        accessibility_description: data.needsAccessibility ? data.accessibilityDescription : null,
        observations: data.observations || null,
      });

      if (error) throw error;

      setShowSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar inscrição:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível completar sua inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="card-corporate p-6 md:p-8 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Send className="w-5 h-5 text-primary" />
          </div>
          Formulário de Inscrição
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome Completo */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Nome Completo *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo"
                      className="input-corporate"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-mail Corporativo */}
            <FormField
              control={form.control}
              name="corporateEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    E-mail Corporativo *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu.email@empresa.com"
                      className="input-corporate"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid para campos menores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Departamento */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      Departamento / Área *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Selecione o departamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border border-border">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nível de Familiaridade */}
              <FormField
                control={form.control}
                name="automationFamiliarity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-foreground">
                      <Gauge className="w-4 h-4 text-muted-foreground" />
                      Familiaridade com Automação *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-corporate">
                          <SelectValue placeholder="Selecione seu nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border border-border">
                        {familiarityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dia de Participação */}
            <FormField
              control={form.control}
              name="participationDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Dia que irá participar *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="input-corporate">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border border-border">
                      {trainingDays.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggle Acessibilidade */}
            <FormField
              control={form.control}
              name="needsAccessibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4 bg-secondary/30">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2 text-foreground cursor-pointer">
                      <Accessibility className="w-4 h-4 text-muted-foreground" />
                      Precisa de Acessibilidade Especial?
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque se você precisar de alguma adaptação
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Campo condicional de acessibilidade */}
            {needsAccessibility && (
              <FormField
                control={form.control}
                name="accessibilityDescription"
                render={({ field }) => (
                  <FormItem className="animate-scale-in">
                    <FormLabel className="text-foreground">
                      Descreva sua necessidade de acessibilidade
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Por favor, descreva suas necessidades específicas..."
                        className="input-corporate min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Observações */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-foreground">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    Observações / Dúvidas (opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione observações ou dúvidas..."
                      className="input-corporate min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botão de Envio */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-corporate h-12 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Confirmar Inscrição
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
};

export default RegistrationForm;
