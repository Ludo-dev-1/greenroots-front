import { Itrees, Ipicture } from "../../../type/type.ts";
import useCartStore from "../../Auth/cartStore.ts";
import { showSuccessToast } from "../../../utils/toast.ts";

export default function Card({
  article,
  isSmall = false,
  setIsOpenedEditModal,
  setIsOpenedDeleteModal,
  setIsOpenDetail,
  setSelectedArticle,
  isDarkMode,
  isAdmin,
}: {
  isAdmin?: boolean;
  isSmall?: boolean;
  setIsOpenedEditModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenedDeleteModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpenDetail?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedArticle?: React.Dispatch<React.SetStateAction<Itrees | null>>;
  article: Itrees;
  isDarkMode: boolean;
  newArticle: Itrees[];
}) {

  // Fonction pour ajouter un article au panier et le stocker dans le localStorage grace a zustand
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <article
      className={`flex ${isDarkMode ? "bg-dark-secondary dark:text-white" : "bg-light-accent text-black"} ${isSmall ? "flex-row items-center w-full max-w-sm" : "flex-col"} 
            rounded-lg border shadow-black shadow-lg md:max-w-2xl m-auto xl1440:w-lg 2xl:w-lg`}
    >

      {/* Image du produit */}
      <div>
        <img
          className={`object-cover rounded-lg aspect-square${isSmall ? "w-12 h-12" : ""} cursor-pointer`}
          src={article.Picture ? `${article.Picture.url} ` : "/images/default.jpg"}
          alt={article.name}
          onClick={() => {
            if (setIsOpenDetail) setIsOpenDetail(true);
            if (setSelectedArticle) {
              setSelectedArticle(article);
            }
          }}
        />

        <p className={`font-content sm:text-sm md:text-md lg:text-lg 2xl:text-2xl ${isSmall ? "text-sm" : "text-xl font-bold"} `}>
          {article.name}
        </p>

        {/* Contenu de la carte */}
        <div className="flex justify-between items-center w-full p-4 sm:gap-4 ">
          {/* Supprime tous les boutons si isSmall est activé */}
          {!isSmall &&
            // bouton modification et delete d'article en cas d'admin connecté
            (isAdmin ? (
              <div className="flex gap-2 p-2">
                <button onClick={() => {
                  if (setIsOpenedEditModal) setIsOpenedEditModal(true);
                  if (setSelectedArticle) setSelectedArticle(article);
                }}
                className="p-2 bg-yellow-500 rounded-lg hover:bg-yellow-600 transition md:w-8 lg:w-10 lg:h-12 cursor-pointer hover:scale-110">
                  <img src="/icons/edit.svg" alt="Modifier" className="w-6 h-6 invert" />
                </button>

                <button onClick={() => {
                  if (setIsOpenedDeleteModal) setIsOpenedDeleteModal(true);
                  if (setSelectedArticle) setSelectedArticle(article);
                }}
                className="p-2 bg-red-500/80 rounded-lg hover:bg-red-600 transition lg:w-10 lg:h-12 md:w-8 mr-2 cursor-pointer hover:scale-110">
                  <img src="/icons/trash.svg" alt="Supprimer" className="w-6 h-6 invert " />
                </button>
              </div>
            ) : (
              // si user connecté affiche le bouton d'ajout au panier
              <button
                className={`flex items-center ${isDarkMode ? "bg-dark-primary" : "bg-light-primary"} p-2 rounded-sm md:rounded-md lg:rounded-lg cursor-pointer hover:scale-110`}
                // Ajoute l'article au panier
                onClick={() => {
                  addToCart({
                    id: article.id.toString(), // Product.id est une chaîne de caractères
                    name: article.name,
                    price: article.price,
                    image: article.Picture ? article.Picture.url : "/images/default.jpg",
                    quantity: 1,
                    Picture: article.Picture as Ipicture,
                  });
                  showSuccessToast("Article ajouté au panier !");
                }
                }
              >
                <img src="/icons/shop-card.svg" alt="Ajouter au panier" className="w-6 h-6 invert" />
              </button>
            ))
          }
          <p className={`font-semibold text-xs min-[374px]:text-base 2xl:text-2xl ${isDarkMode ? "text-white" : "text-black"} ml-2`}>
            {"Prix: " + article.price + " €"}
          </p>
        </div>
      </div>
      {/* Bouton détail */}
      <button className={`font - content border-2 ${isDarkMode ? "bg-dark-primary border-dark-primary" : "bg-light-primary border-light-primary"} rounded-sm md:rounded-md lg:rounded-lg drop-shadow-lg
  sm:p-1 sm:text-sm md:text-md  lg:tex-lg 2xl:text-2xl cursor-pointer hover`}
      // Affiche le détail de l'article
      onClick={() => {
        if (setIsOpenDetail) setIsOpenDetail(true);
        if (setSelectedArticle) {
          setSelectedArticle(article);
        }
      }}>
        Détail de l'arbre
      </button>
    </article>
  );
}
