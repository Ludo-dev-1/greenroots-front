import { useEffect, useState } from "react";
import Card from "../ui/Card";
import EditModal from "../ui/Edit-modal";
import DeleteModal from "../ui/Delete-modal";
import fetchmethod from "../../fetch/method-fetch";
import { Itrees } from "../../../type/type";
import CreateModal from "../ui/Create-modal";
import { useAuthStore } from "../../Auth/authStore";
import Loader from "../layout/Loader";

// Composant Boutique permettant d'afficher et de gérer une liste d'articles (arbres)
export default function Boutique({
  setIsOpenDetail,
  setSelectedArticle,
  selectedArticle,
  isDarkMode,
}: {
  setIsOpenDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedArticle: React.Dispatch<React.SetStateAction<Itrees | null>>;
  selectedArticle: Itrees | null;
  isDarkMode: boolean;
}) {
  // State pour gérer l'affichage des modales
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [isOpenedEditModal, setIsOpenedEditModal] = useState<boolean>(false);
  const [isOpenedDeleteModal, setIsOpenedDeleteModal] = useState<boolean>(false);

  // state pour gérer le chargement des articles
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // state pour stocker les articles
  const [articles, setArticles] = useState<Itrees[]>([]);

  // state pour stocker la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filtrage des articles en fonction de la catégorie sélectionnée
  const filteredArticles =
    selectedCategory === "All"
      ? articles
      : articles.filter((article) => article.categories.some((cat) => cat.name === selectedCategory));

  // Récupération du rôle de l'utilisateur
  const { isAdmin } = useAuthStore();

  // Effet pour charger les articles selon le rôle de l'utilisateur (admin ou non)
  useEffect(() => {
    setIsLoading(true);
    if (isAdmin) {
      fetchmethod.getArticlesByAdmin().then((data) => setArticles(data));
    } else {
      fetchmethod.getArticle().then((data) => setArticles(data));
    }
    setIsLoading(false);
  }, []);

  // Récupération des catégories uniques des articles
  const uniqueCategories = Array.from(
    new Set(
      articles.flatMap((article) =>
        article.categories?.map((cat) => cat.name) || []
      )
    )
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* Modale de création d'article */}
      {openCreateModal && <CreateModal setOpenCreateModal={setOpenCreateModal} isOpenedCreateModal={openCreateModal} setArticles={setArticles} isDarkMode={isDarkMode} articles={articles} />}

      {/* Modale d'édition d'article */}
      {isOpenedEditModal && selectedArticle && (
        <EditModal setIsOpenedEditModal={setIsOpenedEditModal} isOpenedEditModal={isOpenedEditModal} article={selectedArticle} setArticles={setArticles} setSelectedArticle={setSelectedArticle} isDarkMode={isDarkMode} articles={articles} />
      )}

      {/* Modale de suppression d'article */}
      {isOpenedDeleteModal && selectedArticle && (
        <DeleteModal setIsOpenedDeleteModal={setIsOpenedDeleteModal} isOpenedDeleteModal={isOpenedDeleteModal} article={selectedArticle} setArticles={setArticles} isDarkMode={isDarkMode} />
      )}

      <div className={`w-full min-h-screen max-w-screen overflow-hidden ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"}`}>
        <main className={`${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"} p-6 flex flex-col gap-6 text-center pt-24 lg:pt-32`}>
          <section className="flex flex-col gap-6">
            <h2 className={`text-3xl font-title font-bold text-center ${isDarkMode ? "text-light-primary" : "text-black"} mb-6 2xl:text-5xl 2xl:pb-10 2xl:pt-10`}>🌱  Nos arbres</h2>

            {/* Sélecteur de catégories */}
            <div className="flex flex-col gap-6 items-center md:flex-row md:justify-between md:gap-6 2xl:pb-20">
              <select onChange={(e) => setSelectedCategory(e.target.value)} name="categories" id="categ-id" className={`${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} font-title text-center border border-white rounded-lg p-2 focus:outline-none focus:ring-2 transition md:py-2 md:px-2 md:text-2xl cursor-pointer`}>
                <option className="bg-dark-primary text-white text-lg p-2" value="All">Catégories</option>

                {/* Dunamisation des categories */}
                {uniqueCategories.map((categoryName, index) => (
                  <option key={index} className={`${isDarkMode ? "bg-dark-primary text-white" : "bg-light-secondary text-black"} text-lg p-2`} value={categoryName}>{categoryName}</option>
                ))}
              </select>

              {/* affichage conditionel de bouton de creation d'article si admin ou pas  */}
              {isAdmin &&
                <button onClick={() => setOpenCreateModal(true)} type="submit" className={`${isDarkMode ? "bg-dark-accent text-white" : "bg-light-secondary text-black"} cursor-pointer flex justify-center items-center gap-2 rounded-lg border p-2 font-content md:text-2xl md:py-2 md:px-3`}>
                  Ajouter un arbre +
                </button>
              }
            </div>

            {/* Affichage des articles */}
            <div className="flex flex-col gap-6 items-center min-md:grid min-md:grid-cols-3 md:gap-6 lg:gap-2 2xl:grid-cols-4 2xl:gap-10">
              {articles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    article={article}
                    isAdmin={isAdmin}
                    setIsOpenedEditModal={setIsOpenedEditModal}
                    setIsOpenedDeleteModal={setIsOpenedDeleteModal}
                    setSelectedArticle={setSelectedArticle}
                    setIsOpenDetail={setIsOpenDetail}
                    isDarkMode={isDarkMode}
                    newArticle={articles} />
                ))
              ) : (
                <p className={`text-white text-6xl text-center ${isDarkMode ? "text-light-primary" : "text-black"}`}>Aucun article pour le moment</p>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
