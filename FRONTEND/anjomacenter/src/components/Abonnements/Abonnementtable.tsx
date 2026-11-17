import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MoreVertical,
  Pencil,
  Printer,
  Trash2,
  Wallet,
} from "lucide-react";
import PaiementsModal from "../Paiements/PaiementsModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { type Abonnement } from "../../types/abonemment";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 8;

const parseMontant = (valeur?: string | number): number => {
  if (valeur === undefined || valeur === null) return 0;
  const nombre = Number(String(valeur).replace(/[^\d.-]/g, ""));
  return Number.isFinite(nombre) ? nombre : 0;
};

const formatMontant = (valeur: number) =>
  valeur.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ");

const formatDate = (valeur?: string) => {
  if (!valeur) return "—";
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(valeur);
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : valeur;
};

export default function AbonnementTable({
  items,
  onDelete,
  onPaymentChange,
}: {
  items: Abonnement[];
  onDelete: (a: Abonnement) => void;
  onPaymentChange?: () => void;
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [paiementDe, setPaiementDe] = useState<Abonnement | null>(null);
  const [abonnementASupprimer, setAbonnementASupprimer] = useState<Abonnement | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const currentItems = useMemo(
    () => items.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [items, startIndex]
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <Card className="w-full gap-0 overflow-hidden border-border/70 py-0 shadow-none">
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-base font-semibold">Liste des abonnements</CardTitle>
        <CardDescription className="text-xs">
          Consultez et gérez les abonnements des clients
        </CardDescription>
      </CardHeader>

      <CardContent className="min-w-0 p-0">
        <Table className="min-w-[1100px] text-left text-sm">
          <TableHeader className="bg-muted/30">
            <TableRow className="text-muted-foreground">
              <TableHead className="px-4 py-4 font-medium">N° Abonnement</TableHead>
              <TableHead className="px-4 py-4 font-medium">Client</TableHead>
              <TableHead className="px-4 py-4 font-medium">Offre</TableHead>
              <TableHead className="px-4 py-4 font-medium">Prix</TableHead>
              <TableHead className="px-4 py-4 font-medium">Date début</TableHead>
              <TableHead className="px-4 py-4 font-medium">Date fin</TableHead>
              <TableHead className="px-4 py-4 font-medium">Observation</TableHead>
              <TableHead className="px-4 py-4 font-medium">Statut</TableHead>
              <TableHead className="px-4 py-4 text-center font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100">
            {currentItems.map((abonnement) => {
              const statut = (abonnement.statut ?? "").toUpperCase();
              const actif = statut === "ACTIF";
              return (
                <TableRow key={abonnement.id} className="transition-colors hover:bg-muted/40">
                  <TableCell className="px-4 py-4">
                    <div className="font-medium">{abonnement.numero_abonnement || `#${abonnement.id}`}</div>
                    <div className="text-xs text-muted-foreground">ID {abonnement.id}</div>
                  </TableCell>
                  <TableCell className="px-4 py-4 font-medium">{abonnement.client}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4">{abonnement.offre}</TableCell>
                  <TableCell className="whitespace-nowrap px-4 py-4">
                    <div className="font-medium">{abonnement.prix}</div>
                    {parseMontant(abonnement.montant_paye) > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Payé {formatMontant(parseMontant(abonnement.montant_paye))}
                        {" · "}Reste{" "}
                        {formatMontant(
                          Math.max(0, parseMontant(abonnement.prix) - parseMontant(abonnement.montant_paye))
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-muted-foreground">{formatDate(abonnement.dateDebut)}</TableCell>
                  <TableCell className="px-4 py-4 text-muted-foreground">{formatDate(abonnement.dateFin)}</TableCell>
                  <TableCell className="max-w-[200px] px-4 py-4 text-muted-foreground">
                    <span className="block truncate">{abonnement.observation}</span>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <span className={`h-1.5 w-1.5 rounded-full ${actif ? "bg-emerald-500" : "bg-muted-foreground/50"}`} />
                      {abonnement.statut || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions pour ${abonnement.client}`}
                              className="text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                            />
                          }
                        >
                          <MoreVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuItem
                            onClick={() => setPaiementDe(abonnement)}
                            className="focus:bg-blue-50 focus:text-blue-700"
                          >
                            <Wallet className="text-blue-600" />
                            Paiements
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/carte/${abonnement.id}`)}
                            className="focus:bg-blue-50 focus:text-blue-700"
                          >
                            <CreditCard className="text-blue-600" />
                            Aperçu de la carte
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/carte/${abonnement.id}?imprimer=1`)}
                            className="focus:bg-blue-50 focus:text-blue-700"
                          >
                            <Printer className="text-blue-600" />
                            Imprimer la carte
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/abonnementform/${abonnement.id}`)}
                            className="focus:bg-blue-50 focus:text-blue-700"
                          >
                            <Pencil className="text-blue-600" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setAbonnementASupprimer(abonnement)}
                          >
                            <Trash2 />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {currentItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="px-6 py-10 text-center text-slate-500">
                  Aucun abonnement.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <div className="flex shrink-0 items-center justify-between border-t px-4 py-4">
        <p className="text-sm text-muted-foreground">
          {items.length} abonnement{items.length > 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Page précédente"
          >
            <ChevronLeft />
          </Button>

          <span className="px-2 text-sm text-muted-foreground">
            {safePage} / {totalPages}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Page suivante"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {paiementDe && (
        <PaiementsModal
          abonnement={paiementDe}
          onClose={() => setPaiementDe(null)}
          onChanged={onPaymentChange}
        />
      )}

      <AlertDialog
        open={Boolean(abonnementASupprimer)}
        onOpenChange={(open) => {
          if (!open) setAbonnementASupprimer(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet abonnement ?</AlertDialogTitle>
            <AlertDialogDescription>
              {abonnementASupprimer
                ? `L'abonnement de ${abonnementASupprimer.client} sera supprimé définitivement.`
                : "Cette action est définitive."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (abonnementASupprimer) onDelete(abonnementASupprimer);
                setAbonnementASupprimer(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}