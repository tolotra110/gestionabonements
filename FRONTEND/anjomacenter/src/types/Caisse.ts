export type CaisseOperationType = "RECETTE" | "DEPENSE";
export type CaisseOperationSource = "paiement" | "caisse";

export interface CaisseOperation {
  id: string;
  source_id: number;
  type: CaisseOperationType;
  montant: number | string;
  date_operation: string;
  motif: string;
  source: CaisseOperationSource;
  client: string | null;
}

export interface CaisseOperationInput {
  type: CaisseOperationType;
  montant: number;
  date_operation: string;
  motif: string;
}
