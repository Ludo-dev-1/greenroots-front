

export default function NewsBlock({ isDarkMode }: { isDarkMode: boolean }) {
  const news = [
    {
      title: "📢 Nouvelles espèces disponibles !",
      description: "Découvrez de nouvelles variétés d’arbres à parrainer et participez activement à la reforestation.",
    },
    {
      title: "📍 Suivi en temps réel",
      description: "Nos équipes vous donnent des nouvelles régulières sur la croissance de vos arbres et les lieux de plantation.",
    },
    {
      title: "🌍 Engagement écologique",
      description: "Nous collaborons avec des partenaires locaux pour un impact encore plus fort sur l’environnement.",
    },
  ];

  return (
    <div className={`${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"} p-10 rounded-2xl shadow-xl mx-auto my-10 2xl:w-5/6 2xl:p-30`}>
      <h2 className={`text-3xl font-bold font-title text-center ${isDarkMode ? "text-light-primary" : "text-black"} mb-6 2xl:text-5xl 2xl:pb-10 pb-10`}>
                🌱 Nos Dernières Actualités
      </h2>
      <p className="text-center  font-content text-gray-1000 mb-10 2xl:text-4xl">
                Découvrez les dernières nouvelles sur nos plantations, les évolutions de vos arbres et les initiatives écologiques en cours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 ">
        {news.map((item, index) => (
          <div key={index} className={`${isDarkMode ? "bg-dark-primary" : "bg-light-primary"} pt-4 rounded-xl shadow-md cursor-pointer hover:scale-105 transition-transform`}>
            <h3 className={`text-xl font-title font-semibold ${isDarkMode ? "text-light-primary" : "text-dark-primary"} mb-2 2xl:text-4xl`}>{item.title}</h3>
            <p className={`${isDarkMode ? "text-white" : "text-black"} 2xl:text-3xl font-content py-5 px-10`}>{item.description}</p>
          </div>
        ))}
      </div>

      <p className={`text-center ${isDarkMode ? "text-white" : "text-gray-900"}  mt-8 2xl:text-3xl pt-10`}>
                🌟 Restez connectés pour ne rien manquer des prochaines initiatives !
      </p>
    </div>
  );
}
