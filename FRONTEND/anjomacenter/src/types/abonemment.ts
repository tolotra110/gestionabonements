export interface Abonnement {
  id: number;
  numero_abonnement?: string;
  client: string;
  prix?: string;
  dateDebut?: string;
  dateFin?: string;
  offre?: string;
  observation?: string;
  statut?: string;
  created_at?: string;
}

export interface AbonnementChartData {
  periode: string;
  abonnements: number;
}

export interface CardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}