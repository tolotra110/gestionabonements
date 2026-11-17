import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import * as XLSX from "xlsx";
import {
  ArrowDown,
  CalendarDays,
  Download,
  Eye,
  MoreVertical,
  Pencil,
  Plus,
  Printer,
  RotateCcw,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { paiementService } from "../../services/paiementService";
import { Sidebare } from "../../components/Sidebar/Sidebare";
import Navbar from "../../components/Navbar/Navbar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { caisseService } from "../../services/caisseService";
import type {
  CaisseOperation,
  CaisseOperationInput,
  CaisseOperationType,
} from "../../types/Caisse";

const parseMontant = (valeur: number | string) => {
  const montant = Number(String(valeur).replace(/[^\d.-]/g, ""));
  return Number.isFinite(montant) ? montant : 0;
};

const formatMontant = (valeur: number) =>
  `${valeur.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ")} Ar`;

const formatDate = (valeur: string) => {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(valeur);
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : valeur;
};

const dateDuJour = () => {
  const maintenant = new Date();
  const mois = String(maintenant.getMonth() + 1).padStart(2, "0");
  const jour = String(maintenant.getDate()).padStart(2, "0");
  return `${maintenant.getFullYear()}-${mois}-${jour}`;
};

type CaisseOperationAvecSolde = CaisseOperation & { solde: number };

function Statistique({
  titre,
  valeur,
  icon,
}: {
  titre: string;
  valeur: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="gap-0 border-blue-100 bg-white py-4 shadow-sm shadow-slate-200/50">
      <CardHeader className="flex flex-row items-center justify-between px-4 pb-0">
        <CardTitle className="text-sm font-normal text-slate-500">{titre}</CardTitle>
        <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 [&_svg]:size-4">
          {icon}
        </span>
      </CardHeader>
      <CardContent className="px-4 pt-2">
        <p className="text-2xl font-semibold tabular-nums text-slate-900">{valeur}</p>
      </CardContent>
    </Card>
  );
}

function FormulaireOperation({
  type,
  onCreated,
}: {
  type: CaisseOperationType;
  onCreated: () => Promise<void>;
}) {
  const recette = type === "RECETTE";
  const [montant, setMontant] = useState("");
  const [motif, setMotif] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ajouter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const montantNumerique = Number(montant);
    if (!Number.isFinite(montantNumerique) || montantNumerique <= 0) {
      setError("Saisissez un montant supérieur à 0.");
      return;
    }
    if (!motif.trim()) {
      setError("Le motif est obligatoire.");
      return;
    }

    const operation: CaisseOperationInput = {
      type,
      montant: montantNumerique,
      date_operation: dateDuJour(),
      motif: motif.trim(),
    };

    try {
      setSaving(true);
      setError(null);
      await caisseService.create(operation);
      setMontant("");
      setMotif("");
      await onCreated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible d’enregistrer l’opération.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="gap-0 border-blue-100 bg-white shadow-sm shadow-slate-200/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-white">
            {recette ? <Plus className="size-4" /> : <ArrowDown className="size-4" />}
          </span>
          <div>
            <CardTitle className="text-base font-semibold">
              Formulaire {recette ? "recette" : "dépense"}
            </CardTitle>
            <CardDescription className="text-xs">
              {recette ? "Ajouter une recette ponctuelle" : "Enregistrer une dépense"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={ajouter} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor={`${type}-montant`} className="text-sm font-medium">
              Montant (Ar)
            </label>
            <Input
              id={`${type}-montant`}
              type="number"
              min="0.01"
              step="any"
              required
              value={montant}
              onChange={(event) => setMontant(event.target.value)}
              placeholder="Saisir le montant"
              className="focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${type}-motif`} className="text-sm font-medium">
              Motif
            </label>
            <Input
              id={`${type}-motif`}
              required
              maxLength={300}
              value={motif}
              onChange={(event) => setMotif(event.target.value)}
              placeholder={recette ? "Ex. Vente de produits" : "Ex. Achat de fournitures"}
              className="focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus />
            {saving ? "Enregistrement..." : `Ajouter ${recette ? "une recette" : "une dépense"}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ModifierOperationDialog({
  operation,
  onClose,
  onSaved,
}: {
  operation: CaisseOperation;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [montant, setMontant] = useState(String(operation.montant));
  const [date, setDate] = useState(operation.date_operation);
  const [motif, setMotif] = useState(operation.motif);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enregistrer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const montantNumerique = Number(montant);
    if (!Number.isFinite(montantNumerique) || montantNumerique <= 0 || !motif.trim()) {
      setError("Saisissez un montant valide et un motif.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await caisseService.update(operation.source_id, {
        type: operation.type,
        montant: montantNumerique,
        date_operation: date,
        motif: motif.trim(),
      });
      await onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de modifier l’opération.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier l’opération</DialogTitle>
          <DialogDescription>Modifiez le montant, la date ou le motif.</DialogDescription>
        </DialogHeader>
        <form onSubmit={enregistrer} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="caisse-edit-montant" className="text-sm font-medium">Montant (Ar)</label>
            <Input
              id="caisse-edit-montant"
              type="number"
              min="0.01"
              step="any"
              required
              value={montant}
              onChange={(event) => setMontant(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="caisse-edit-date" className="text-sm font-medium">Date</label>
            <Input
              id="caisse-edit-date"
              type="date"
              required
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="caisse-edit-motif" className="text-sm font-medium">Motif</label>
            <Input
              id="caisse-edit-motif"
              required
              maxLength={300}
              value={motif}
              onChange={(event) => setMotif(event.target.value)}
            />
          </div>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Caisse() {
  const navigate = useNavigate();
  const [operations, setOperations] = useState<CaisseOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [operationASupprimer, setOperationASupprimer] = useState<CaisseOperationAvecSolde | null>(null);
  const [operationAModifier, setOperationAModifier] = useState<CaisseOperationAvecSolde | null>(null);
  const [operationAVisualiser, setOperationAVisualiser] = useState<CaisseOperationAvecSolde | null>(null);
  const [operationAImprimer, setOperationAImprimer] = useState<CaisseOperationAvecSolde | null>(null);

  const load = useCallback(async () => {
    try {
      setOperations(await caisseService.list());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de charger les opérations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    caisseService
      .list()
      .then((data) => {
        if (active) setOperations(data);
      })
      .catch((e: unknown) => {
        if (active) {
          setError(e instanceof Error ? e.message : "Impossible de charger les opérations.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!operationAImprimer) return;
    const timer = window.setTimeout(() => {
      window.print();
      setOperationAImprimer(null);
    }, 100);
    return () => window.clearTimeout(timer);
  }, [operationAImprimer]);

  const operationsAvecSolde = useMemo(() => {
    const chronologiques = [...operations].sort(
      (a, b) =>
        a.date_operation.localeCompare(b.date_operation) ||
        a.source.localeCompare(b.source) ||
        a.source_id - b.source_id
    );
    const soldes = new Map<string, number>();
    let solde = 0;

    for (const operation of chronologiques) {
      const montant = parseMontant(operation.montant);
      solde += operation.type === "RECETTE" ? montant : -montant;
      soldes.set(operation.id, solde);
    }

    return operations.map((operation) => ({
      ...operation,
      solde: soldes.get(operation.id) ?? 0,
    }));
  }, [operations]);

  const operationsPeriode = useMemo(
    () =>
      operationsAvecSolde.filter(
        (operation) =>
          (!dateDebut || operation.date_operation >= dateDebut) &&
          (!dateFin || operation.date_operation <= dateFin)
      ),
    [dateDebut, dateFin, operationsAvecSolde]
  );

  const totaux = useMemo(
    () =>
      operationsPeriode.reduce(
        (total, operation) => {
          if (operation.type === "RECETTE") total.recettes += parseMontant(operation.montant);
          else total.depenses += parseMontant(operation.montant);
          return total;
        },
        { recettes: 0, depenses: 0 }
      ),
    [operationsPeriode]
  );

  const operationsVisibles = useMemo(() => {
    const recherche = search.trim().toLocaleLowerCase("fr");
    return operationsPeriode
      .filter((operation) =>
        `${operation.motif} ${operation.client ?? ""} ${operation.type}`
          .toLocaleLowerCase("fr")
          .includes(recherche)
      )
      .sort(
        (a, b) =>
          b.date_operation.localeCompare(a.date_operation) ||
          b.source.localeCompare(a.source) ||
          b.source_id - a.source_id
      );
  }, [operationsPeriode, search]);

  const supprimer = async (operation: CaisseOperation) => {
    try {
      setError(null);
      if (operation.source === "caisse") {
        await caisseService.remove(operation.source_id);
      } else {
        await paiementService.remove(operation.source_id);
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de supprimer cette opération.");
    }
  };

  const exporter = () => {
    const lignes = [
      ["N°", "Date", "Motif", "Dépense", "Recette", "Solde"],
      ...operationsVisibles.map((operation, index) => [
        String(index + 1).padStart(3, "0"),
        formatDate(operation.date_operation),
        operation.motif,
        operation.type === "DEPENSE" ? parseMontant(operation.montant) : 0,
        operation.type === "RECETTE" ? parseMontant(operation.montant) : 0,
        operation.solde,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(lignes);
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 14 },
      { wch: 36 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Caisse");
    XLSX.writeFile(workbook, "operations-caisse.xlsx");
  };

  const datesInvalides = Boolean(dateDebut && dateFin && dateDebut > dateFin);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebare />
      <div className="min-w-0 flex-1">
        <Navbar />
        <main className="space-y-5 p-4 sm:p-6">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Caisse</h1>
            <p className="text-sm text-slate-500">Suivez les recettes, les dépenses et le solde.</p>
          </header>

          <section className="grid gap-3 sm:grid-cols-3" aria-label="Résumé de la caisse">
            <Statistique
              titre="Total solde"
              valeur={loading ? "—" : formatMontant(totaux.recettes - totaux.depenses)}
              icon={<TrendingUp />}
            />
            <Statistique
              titre="Total dépensé"
              valeur={loading ? "—" : formatMontant(totaux.depenses)}
              icon={<ArrowDown />}
            />
            <Statistique
              titre="Total recette"
              valeur={loading ? "—" : formatMontant(totaux.recettes)}
              icon={<Wallet />}
            />
          </section>

          <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="space-y-1">
                <label htmlFor="caisse-date-debut" className="text-xs text-muted-foreground">Du</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-blue-600" />
                  <Input
                    id="caisse-date-debut"
                    aria-label="Date de début"
                    type="date"
                    value={dateDebut}
                    onChange={(event) => setDateDebut(event.target.value)}
                    className="h-9 border-slate-200 bg-white pl-9 focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="caisse-date-fin" className="text-xs text-muted-foreground">Au</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-blue-600" />
                  <Input
                    id="caisse-date-fin"
                    aria-label="Date de fin"
                    type="date"
                    value={dateFin}
                    onChange={(event) => setDateFin(event.target.value)}
                    className="h-9 border-slate-200 bg-white pl-9 focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                  setDateDebut("");
                  setDateFin("");
                }}
                disabled={!dateDebut && !dateFin}
                aria-label="Réinitialiser la période"
                className="h-9"
              >
                <RotateCcw />
                Réinitialiser la période
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLoading(true);
                  void load();
                }}
                disabled={loading}
                className="border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <RefreshCw className={loading ? "animate-spin" : ""} />
                Actualiser
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={exporter}
                disabled={loading}
                className="border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                <Download />
                Exporter Excel
              </Button>
            </div>
          </section>

          {datesInvalides && (
            <p role="alert" className="text-sm text-destructive">
              La date de début doit précéder la date de fin.
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-md border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <Card className="gap-0 overflow-hidden border-slate-200 bg-white py-0 shadow-sm shadow-slate-200/50">
            <CardHeader className="gap-3 border-b px-4 py-4 sm:flex sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold text-slate-900">Liste des opérations</CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Paiements d’abonnement et opérations de caisse
                </CardDescription>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-blue-600" />
                <Input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher..."
                  aria-label="Rechercher une opération"
                  className="h-9 border-slate-200 bg-white pl-9 focus-visible:border-blue-600 focus-visible:ring-blue-600/20"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[900px]">
                  <TableHeader className="bg-blue-50/70">
                    <TableRow className="text-slate-600">
                      <TableHead className="w-16 px-4">N°</TableHead>
                      <TableHead className="px-4">Date</TableHead>
                      <TableHead className="px-4">Motif</TableHead>
                      <TableHead className="px-4 text-right">Dépense</TableHead>
                      <TableHead className="px-4 text-right">Recette</TableHead>
                      <TableHead className="px-4 text-right">Solde</TableHead>
                      <TableHead className="w-16 px-4 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          Chargement des opérations...
                        </TableCell>
                      </TableRow>
                    )}
                    {!loading && operationsVisibles.map((operation, index) => (
                      <TableRow key={operation.id} className="hover:bg-blue-50/50">
                        <TableCell className="px-4 text-muted-foreground">
                          {String(index + 1).padStart(3, "0")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 text-muted-foreground">
                          {formatDate(operation.date_operation)}
                        </TableCell>
                        <TableCell className="max-w-[360px] px-4">
                          <span className="block truncate">{operation.motif}</span>
                          {operation.client && (
                            <span className="block truncate text-xs text-muted-foreground">{operation.client}</span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 text-right tabular-nums">
                          {formatMontant(operation.type === "DEPENSE" ? parseMontant(operation.montant) : 0)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 text-right tabular-nums">
                          {formatMontant(operation.type === "RECETTE" ? parseMontant(operation.montant) : 0)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-4 text-right font-semibold tabular-nums text-slate-900">
                          {formatMontant(operation.solde)}
                        </TableCell>
                        <TableCell className="px-4 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  aria-label={`Actions pour ${operation.motif}`}
                                  className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                                />
                              }
                            >
                              <MoreVertical />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {operation.source === "paiement" ? (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/recu/${operation.source_id}`)}
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    <Eye className="text-blue-600" />
                                    Aperçu du reçu
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => navigate(`/recu/${operation.source_id}?imprimer=1`)}
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    <Printer className="text-blue-600" />
                                    Imprimer le reçu
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => setOperationAVisualiser(operation)}
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    <Eye className="text-blue-600" />
                                    Aperçu
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setOperationAModifier(operation)}
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    <Pencil className="text-blue-600" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setOperationAImprimer(operation)}
                                    className="focus:bg-blue-50 focus:text-blue-700"
                                  >
                                    <Printer className="text-blue-600" />
                                    Imprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setOperationASupprimer(operation)}
                              >
                                <Trash2 />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!loading && operationsVisibles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          {operations.length === 0
                            ? "Aucune opération enregistrée."
                            : "Aucune opération pour ces filtres."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <div className="border-t px-4 py-3 text-sm text-muted-foreground">
              {operationsVisibles.length} opération{operationsVisibles.length > 1 ? "s" : ""}
            </div>
          </Card>

          <section className="grid gap-4 lg:grid-cols-2" aria-label="Ajouter une opération">
            <FormulaireOperation type="RECETTE" onCreated={load} />
            <FormulaireOperation type="DEPENSE" onCreated={load} />
          </section>
        </main>
      </div>

      {operationAImprimer && (
        <div id="operation-a-imprimer" className="hidden print:block">
          <h1 className="text-2xl font-bold">Opération de caisse</h1>
          <p className="mt-6"><strong>Type :</strong> {operationAImprimer.type === "RECETTE" ? "Recette" : "Dépense"}</p>
          <p className="mt-3"><strong>Date :</strong> {formatDate(operationAImprimer.date_operation)}</p>
          <p className="mt-3"><strong>Motif :</strong> {operationAImprimer.motif}</p>
          <p className="mt-3"><strong>Montant :</strong> {formatMontant(parseMontant(operationAImprimer.montant))}</p>
          <p className="mt-3"><strong>Solde après opération :</strong> {formatMontant(operationAImprimer.solde)}</p>
        </div>
      )}

      {operationAModifier && (
        <ModifierOperationDialog
          key={operationAModifier.id}
          operation={operationAModifier}
          onClose={() => setOperationAModifier(null)}
          onSaved={load}
        />
      )}

      <Dialog
        open={Boolean(operationAVisualiser)}
        onOpenChange={(open) => {
          if (!open) setOperationAVisualiser(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aperçu de l’opération</DialogTitle>
            <DialogDescription>Détails de l’opération sélectionnée.</DialogDescription>
          </DialogHeader>
          {operationAVisualiser && (
            <dl className="grid gap-3 text-sm">
              <div><dt className="text-muted-foreground">Type</dt><dd className="font-medium">{operationAVisualiser.type === "RECETTE" ? "Recette" : "Dépense"}</dd></div>
              <div><dt className="text-muted-foreground">Date</dt><dd className="font-medium">{formatDate(operationAVisualiser.date_operation)}</dd></div>
              <div><dt className="text-muted-foreground">Motif</dt><dd className="font-medium">{operationAVisualiser.motif}</dd></div>
              <div><dt className="text-muted-foreground">Montant</dt><dd className="font-medium">{formatMontant(parseMontant(operationAVisualiser.montant))}</dd></div>
              <div><dt className="text-muted-foreground">Solde après opération</dt><dd className="font-medium">{formatMontant(operationAVisualiser.solde)}</dd></div>
            </dl>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOperationAVisualiser(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(operationASupprimer)}
        onOpenChange={(open) => {
          if (!open) setOperationASupprimer(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette opération ?</AlertDialogTitle>
            <AlertDialogDescription>
              {operationASupprimer
                ? `« ${operationASupprimer.motif} » sera supprimée définitivement.`
                : "Cette action est définitive."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (operationASupprimer) void supprimer(operationASupprimer);
                setOperationASupprimer(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
