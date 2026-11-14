import { CardFront, type SubscriberData } from "./CardFront";
import { CardBack } from "./CardBack";

interface CarteAbonnementProps {
  nom: string;
  numeroAbonne: string;
  validite: string;
}

/**
 * Carte d'abonné recto/verso prête à imprimer (format CR80, 85,6 × 54 mm).
 */
export default function CarteAbonnement({ nom, numeroAbonne, validite }: CarteAbonnementProps) {
  const data: SubscriberData = { nom, numeroAbonne, validite };

  return (
    <div id="carte-a-imprimer" className="flex w-full flex-col items-center gap-8">
      <section className="print-card-item w-full max-w-[600px]">
        <CardFront data={data} />
        <p className="no-print mt-3 text-center text-xs text-slate-500">Face avant (Recto)</p>
      </section>

      <section className="print-card-item w-full max-w-[600px]">
        <CardBack />
        <p className="no-print mt-3 text-center text-xs text-slate-500">Face arrière (Verso)</p>
      </section>
    </div>
  );
}
