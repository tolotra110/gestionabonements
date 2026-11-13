export interface Client {
  id: string;
  nom: string;
  telephone: string;
  abonnement: string;
  Adresse: string;
  observation: string;
}

export interface ClientCardProps {
  client: Client;
  onView?: (client: Client) => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}
