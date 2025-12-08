import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Search, Users, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Registration {
  id: string;
  full_name: string;
  corporate_email: string;
  department: string;
  automation_familiarity: string;
  participation_day: string;
  needs_accessibility: boolean;
  accessibility_description: string | null;
  observations: string | null;
  created_at: string;
}

type SortKey = keyof Registration;
type SortDirection = "asc" | "desc";

const HRPanel = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRegistrations();

    // Realtime subscription
    const channel = supabase
      .channel("registrations-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar inscrições:", error);
      return;
    }

    setRegistrations(data || []);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let data = [...registrations];

    // Filtrar
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.full_name.toLowerCase().includes(search) ||
          r.corporate_email.toLowerCase().includes(search) ||
          r.department.toLowerCase().includes(search)
      );
    }

    // Ordenar
    data.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === "asc"
        ? (aValue as any) - (bValue as any)
        : (bValue as any) - (aValue as any);
    });

    return data;
  }, [registrations, searchTerm, sortKey, sortDirection]);

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const exportToCSV = () => {
    const headers = [
      "Nome Completo",
      "E-mail Corporativo",
      "Departamento",
      "Familiaridade",
      "Dia",
      "Acessibilidade",
      "Descrição Acessibilidade",
      "Observações",
      "Data Inscrição",
    ];

    const csvContent = [
      headers.join(";"),
      ...registrations.map((r) =>
        [
          r.full_name,
          r.corporate_email,
          r.department,
          r.automation_familiarity,
          r.participation_day,
          r.needs_accessibility ? "Sim" : "Não",
          r.accessibility_description || "",
          r.observations || "",
          new Date(r.created_at).toLocaleString("pt-BR"),
        ].join(";")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `inscritos-treinamento-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const getFamiliarityBadge = (level: string) => {
    const colors: Record<string, string> = {
      baixo: "bg-destructive/10 text-destructive border-destructive/20",
      medio: "bg-accent/10 text-accent border-accent/20",
      alto: "bg-success/10 text-success border-success/20",
    };
    return colors[level] || "";
  };

  return (
    <div className="card-corporate p-6 md:p-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Painel do RH
            </h2>
            <p className="text-sm text-muted-foreground">
              {registrations.length} inscrito{registrations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Button onClick={exportToCSV} className="btn-corporate">
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome, e-mail ou departamento..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="input-corporate pl-10"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="table-corporate">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("full_name")}
                className="cursor-pointer hover:bg-secondary/70 transition-colors"
              >
                Nome <SortIcon column="full_name" />
              </th>
              <th
                onClick={() => handleSort("corporate_email")}
                className="cursor-pointer hover:bg-secondary/70 transition-colors"
              >
                E-mail <SortIcon column="corporate_email" />
              </th>
              <th
                onClick={() => handleSort("department")}
                className="cursor-pointer hover:bg-secondary/70 transition-colors"
              >
                Departamento <SortIcon column="department" />
              </th>
              <th
                onClick={() => handleSort("automation_familiarity")}
                className="cursor-pointer hover:bg-secondary/70 transition-colors"
              >
                Familiaridade <SortIcon column="automation_familiarity" />
              </th>
              <th
                onClick={() => handleSort("participation_day")}
                className="cursor-pointer hover:bg-secondary/70 transition-colors"
              >
                Dia <SortIcon column="participation_day" />
              </th>
              <th>Acessibilidade</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchTerm
                    ? "Nenhum resultado encontrado."
                    : "Nenhuma inscrição registrada ainda."}
                </td>
              </tr>
            ) : (
              paginatedData.map((registration) => (
                <tr key={registration.id}>
                  <td className="font-medium text-foreground">{registration.full_name}</td>
                  <td className="text-muted-foreground">{registration.corporate_email}</td>
                  <td>
                    <Badge variant="outline" className="bg-secondary/50">
                      {registration.department}
                    </Badge>
                  </td>
                  <td>
                    <Badge
                      variant="outline"
                      className={getFamiliarityBadge(registration.automation_familiarity)}
                    >
                      {registration.automation_familiarity.charAt(0).toUpperCase() +
                        registration.automation_familiarity.slice(1)}
                    </Badge>
                  </td>
                  <td className="font-medium">{registration.participation_day}</td>
                  <td>
                    {registration.needs_accessibility ? (
                      <div>
                        <Badge className="bg-accent text-accent-foreground">Sim</Badge>
                        {registration.accessibility_description && (
                          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                            {registration.accessibility_description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Não</span>
                    )}
                  </td>
                  <td className="max-w-[200px] truncate text-muted-foreground">
                    {registration.observations || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRPanel;
