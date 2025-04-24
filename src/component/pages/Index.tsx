// Imports
import { useEffect, useState } from "react";
import bgAccueil from "../../assets/images/bgAccueil.webp";
import Card from "../ui/Card";
import fetchmethod from "../../fetch/method-fetch";
import { Itrees } from "../../../type/type";
import BlocActu from "../ui/BlocActu";
import Loader from "../layout/Loader";

// Définition du composant principal Index
export default function Index({ setIsOpenDetail, setSelectedArticle, isDarkMode, }: {
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedArticle: React.Dispatch<React.SetStateAction<Itrees | null>>,
  isOpenDetail: boolean,
  isDarkMode: boolean,
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>
}) {

  // Déclaration des états locaux pour stocker les articles et gérer le chargement
  const [newarticle, setnewarticle] = useState<Itrees[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect pour récupérer les articles lors du premier rendu du composant
  useEffect(() => {
    setIsLoading(true);
    fetchmethod.getNewArticle().then((data) => setnewarticle(data));
    setIsLoading(false);
  }, []);

  // Affichage d'un loader si les données sont en cours de chargement
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-screen min-h-screen overflow-hidden lg:pt-10 xl:pt-20">

      <main className={`flex flex-col gap-6 text-center ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"}`}>

        <h1 className="text-lg font-bold p-4 pt-25 lg:text-2xl 2xl:text-3xl lg:m-8 ">
            🌳 GreenRoots, parce qu'un arbre planté aujourd'hui est une forêt pour demain. 🌳
        </h1>
        {/* Section d'introduction avec image de fond */}
        <section className="flex flex-col gap-6 ">
          <div className="w-5/6 mx-auto h-screen bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${bgAccueil})` }}>
            <div className={`flex flex-col gap-6 items-center justify-center p-6 px-5 rounded-md lg:rounded-lg 2xl:rounded-2xl 
        ${isDarkMode ? "bg-dark-secondary/80 text-white" : "bg-light-secondary/80 text-black"} bg-black/70 w-full md:w-3/4 lg:w-2/3 2xl:w-1/2`}>
              <h2 className="text-xl font-bold font-title lg:text-2xl 2xl:text-5xl">
                La déforestation, un enjeu majeur pour la planète
              </h2>
              <p className="font-content pt-6 lg:text-2xl 2xl:text-3xl ">
                Chaque année, 15 milliards d'arbres sont abattus, mais seulement 5 milliards sont replantés. La déforestation entraîne une perte de 10 milliards d’arbres par an, menaçant la biodiversité et accélérant la désertification.
              </p>
              <p className="font-content lg:text-2xl 2xl:text-3xl">
                Notre Solution : Nous avons créé une application qui permet de planter des arbres en un clic.
              </p>
            </div>
          </div>
        </section>

        {/* Section affichant les actualités et les derniers articles */}
        <section className="flex flex-col gap-6 p-6">
          <div className="2xl:pb-20">
            <BlocActu isDarkMode={isDarkMode} />
          </div>
          <h2 className={`text-3xl font-title font-bold text-center ${isDarkMode ? "text-light-primary" : "text-black"}  mb-6 2xl:text-5xl 2xl:pb-10`}>
            🌱  Nos derniers arbres
          </h2>
          <div className="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-8 2xl:w-5/6 m-auto pb-15">
            {/* Affichage des cartes des derniers articles */}
            {newarticle.length > 0 ? (
              newarticle.slice(0, 3).map((article) => (
                <Card
                  key={article.id}
                  article={article}
                  isAdmin={false}
                  setIsOpenDetail={setIsOpenDetail}
                  setSelectedArticle={setSelectedArticle}
                  isDarkMode={isDarkMode}
                  newArticle={newarticle}
                />
              ))
            ) : (
              <p className="text-white">Aucun article pour le moment</p>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
