import {
  Wifi,
  ShieldCheck,
  Clock3,
  Headphones,
} from "lucide-react";

import {Navbar} from "../../components/NavbarLanding/Navbar";
import Footer from "../../components/Footer/Footer";

export function Home(){
  

  const advantages = [
    {
      icon: Wifi,
      title: "Application web rapide",
      description:
        "Profitez d'une application web  rapide et adaptée à vos besoins.",
    },
    {
      icon: ShieldCheck,
      title: "Une Sécurité renforcée",
      description:
        "Une Sécurité renforcée pour protéger vos données sensibles ",
    },
    {
      icon: Clock3,
      title: "Disponible 24/7",
      description:
        "Accédez à l'application à tout moment, de jour comme de nuit.",
    },
    {
      icon: Headphones,
      title: "Support client",
      description:
        "Je suis disponible pour vous accompagner.",
    },
  ];

  return (

    <div className="min-h-screen bg-white text-slate-900">
          <Navbar/>

     
      <section className="bg-white ">

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6  lg:grid-cols-2 lg:px-8 py-12">


          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4  text-sm font-medium text-blue-600">
              <Wifi className="h-4 w-4" />
              WiFi rapide à Fianarantsoa
            </div>

            <h1 className="max-w-2xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-6xl">
              ANJOMA
              <span className="block text-blue-600">
                WiFi Zone Center
              </span>
            </h1>

            <div className="mt-6 h-1 w-16 rounded-full bg-blue-600" />

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Profitez d'une application web rapide, stable et
              sécurisée à <strong>Anjoma, Fianarantsoa</strong>.
              Restez connecté au monde où que vous soyez.
            </p>
          </div>

        
          <div className="relative flex items-center justify-center py-10">
            <div className="relative h-80 w-80" style={{ perspective: "800px" }}>
              <div className="absolute inset-0 flex items-center justify-center animate-gyroscope" style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute h-60 w-60 rounded-full border-2 border-blue-300/40" style={{ transform: "rotateX(70deg) rotateY(0deg)" }} />
                <div className="absolute h-52 w-52 rounded-full border-2 border-blue-400/50 border-dashed" style={{ transform: "rotateX(70deg) rotateY(60deg) rotateZ(60deg)" }} />
                <div className="absolute h-56 w-56 rounded-full border-2 border-blue-500/60" style={{ transform: "rotateX(70deg) rotateY(120deg) rotateZ(-60deg)" }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 shadow-2xl shadow-blue-500/60 ring-4 ring-blue-400/30 backdrop-blur-sm">
                  <Wifi className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      <section className="bg-slate-50 py-20">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Pourquoi nous choisir ?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Une application web pensée pour vous
            </h2>

            <p className="mt-4 text-slate-600">
              Une solution simple et fiable pour faciliter votre gestion d'abonnement connexion internet.
            </p>

          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {advantages.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white p-7 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

    

      <Footer />

    </div>
  );
};

export default Home;