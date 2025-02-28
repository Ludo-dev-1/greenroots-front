import { Itrees, Ipicture } from "../../../type/type";
import useCartStore from "../../Auth/cartStore";

interface DetailModalProps {
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  article: Itrees;
  isOpenOrderDetail: boolean;
  isDarkMode: boolean;
}

export default function DetailModal({
  setIsOpenDetail,
  article,
  isOpenOrderDetail,
  isDarkMode,
}: DetailModalProps) {

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <>
      {/* Overlay pour fermer la modale en cliquant à l'extérieur */}

      {isOpenOrderDetail && (
        <div
          className="fixed inset-0 bg-black/50 z-40 pointer-events-auto"
          onClick={() => setIsOpenDetail(false)}
        />
      )}

      {/* Modale */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? " bg-dark-secondary" : "bg-light-accent"} w-80 p-6 rounded-lg shadow-lg text-white flex flex-col gap-4 z-50 mt-8 md:w-md lg:w-lg 2xl:w-2xl 2xl:text-2xl`} style={{ maxHeight: "80vh", overflowY: "auto" }}>

        {/* Bouton de fermeture */}
        <img
          onClick={() => setIsOpenDetail(false)}
          src="/icons/close.svg"
          alt="Fermer la modale"
          className={`w-6 h-6 ${isDarkMode && "invert"} absolute top-4 right-4 cursor-pointer `}
        />

        {/* Titre */}
        <h1 className={`text-2xl font-bold text-center ${isDarkMode ? " text-white" : "text-black"} `}>Détail de l'arbre </h1>
        <h2 className={`font-bold text-center font-title ${isDarkMode ? "text-white" : "text-black"} `}>{article.name} </h2>

        <div className="flex flex-col gap-4">
          {/* Image URL */}
          <div className="flex flex-col ">
            <img className="h-56 md:h-100" src={article.Picture ? article.Picture.url : "/images/default.jpg"}
              alt={article.name} />
          </div>
          {/* Catégorie */}
          <div className={`flex flex-col ${isDarkMode ? "text-white" : "text-black"} `}>
            <h3 className="font-semibold mb-1 font-title ">Catégories :</h3>
            <ul className="list-disc pl-4 font-content ">
              {article.categories?.length > 0 ? (
                article.categories.map((category, index) => (
                  <li key={index}>{category.name}</li>
                ))
              ) : (
                <p>Aucune catégorie</p>
              )}
            </ul>
          </div>


          {/* Description */}
          <div className={`flex flex-col mb-4 ${isDarkMode ? "text-white" : "text-black"} `}>
            <h3 className="font-semibold mb-1 font-title 2xl:text-xl">Description :</h3>
            <p className="font-content"> {article.description}</p>

            {/* Prix */}
            <div className="flex flex-col mt-4">
              <h3 className="font-semibold mb-1 font-content 2xl:text-lg">Prix : {article.price} €</h3>
            </div>

          </div>
          <div className="flex justify-center">
            <button onClick={() =>
              addToCart({
                id: article.id.toString(), // Product.id est une chaîne de caractères
                name: article.name,
                price: article.price,
                image: article.Picture ? article.Picture.url : "/default.jpg",
                quantity: 1, // Par défaut, on ajoute 1 unité
                Picture: article.Picture as Ipicture,
              })
            } className={`flex items-center ${isDarkMode ? "bg-dark-primary" : "bg-light-primary text-black"}  p-2  rounded-sm md:rounded-md lg:rounded-lg cursor-pointer hover:scale-110`}> Ajouter au panier </button>
          </div>

        </div>
      </div>

    </>
  );
}