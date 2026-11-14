export interface Paiement {
  id: number;
  abonnement_id: number;
  montant: number | string;
  date_paiement: string;
  methode?: string;
  note?: string | null;
  created_at?: string;
  client?: string;
  numero_abonnement?: string;
  offre?: string;
  prix_abonnement?: string;
}

export interface PaiementInput {
  abonnement_id: number;
  montant: number;
  date_paiement?: string;
  methode?: string;
  note?: string;
}

export const METHODES_PAIEMENT = [
  "Espèces",
  "Mobile Money",
  "Virement",
  "Chèque",
] as const;
