interface CarteAbonnementProps {
  nom: string;
  numeroAbonne: string;
  dateDebut: string;
  dateFin: string;
}

function formaterDate(date: string): string {
  if (!date) return "";

  const valeur = new Date(`${date}T00:00:00`);

  if (Number.isNaN(valeur.getTime())) return date;

  return valeur.toLocaleDateString("fr-FR");
}

interface ChampProps {
  valeur: string;
  placeholder: string;
  /** Position verticale du centre de la ligne (en % de la hauteur) */
  centre: number;
  /** Début de la zone, juste après le libellé (en % de la largeur) */
  left: number;
  /** Largeur disponible jusqu'au bord droit du champ (en % de la largeur) */
  width: number;
}

const HAUTEUR_CHAMP = 9; // % de la hauteur de la carte

function Champ({ valeur, placeholder, centre, left, width }: ChampProps) {
  return (
    <div
      className="absolute flex items-center overflow-hidden"
      style={{
        left: `${left}%`,
        top: `${centre - HAUTEUR_CHAMP / 2}%`,
        width: `${width}%`,
        height: `${HAUTEUR_CHAMP}%`,
      }}
    >
      <span
        className="truncate font-bold leading-none text-[#0a2a6e]"
        style={{ fontSize: "3.1cqw" }} // même taille que les libellés de l'image
      >
        {valeur || placeholder}
      </span>
    </div>
  );
}

export default function CarteAbonnement({
  nom,
  numeroAbonne,
  dateDebut,
  dateFin,
}: CarteAbonnementProps) {
  const debut = formaterDate(dateDebut);
  const fin = formaterDate(dateFin);
  const validite = debut || fin ? `${debut} - ${fin}` : "";

  return (
    <div
      id="carte-a-imprimer"
      className="relative mx-auto w-full max-w-[600px]"
      style={{ aspectRatio: "3 / 2", containerType: "inline-size" }}
    >
      {/* Image de la carte (coins arrondis et ombre déjà inclus) */}
      <img
        src="/images/carte-abonne.jpg"
        alt="Carte d'abonné Anjoma Wifi Zone"
        className="absolute inset-0 h-full w-199 "
        draggable={false}
      />

      {/* Nom : */}
      <Champ
        valeur={nom}
        placeholder="Nom du client"
        centre={51.1}
        left={52}
        width={32}
      />

      {/* N° Abonné : */}
      <Champ
        valeur={numeroAbonne}
        placeholder="N° d'abonné"
        centre={63.5}
        left={62}
        width={32}
      />

      {/* Validité : */}
      <Champ
        valeur={validite}
        placeholder="JJ/MM/AAAA - JJ/MM/AAAA"
        centre={76.7}
        left={57.5}
        width={36.5}
      />
    </div>
  );
}