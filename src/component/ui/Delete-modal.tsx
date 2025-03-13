import { Itrees } from "../../../type/type";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function DeleteModal({
  isOpenedDeleteModal,
  setIsOpenedDeleteModal,
  article,
  setArticles,
  isDarkMode
}: {
    isOpenedDeleteModal: boolean,
    setIsOpenedDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
    article: Itrees;
    setArticles: React.Dispatch<React.SetStateAction<Itrees[]>>;
    isDarkMode: boolean
}) {




  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/articles/${article.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-api-key": "123456789",
        },

      });

      const data = await response.json();
      console.log("Article supprimé avec succès :", data);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
      showSuccessToast("Article supprimé avec succès !");


    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast("Erreur lors de la suppression de l'article");
    }

  };


  return (
    <>
      {/* Overlay qui ferme la modale en cliquant à l'extérieur */}
      {isOpenedDeleteModal && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpenedDeleteModal(false)}
        />
      )}

      {/* Modale */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"}w-80 p-6 rounded-lg shadow-lg  flex flex-col gap-6 z-20`}>

        {/* Bouton de fermeture */}
        <img
          onClick={() => setIsOpenedDeleteModal(false)}
          src="/icons/close.svg"
          alt="Fermer la modale"
          className={`w-6 h-6  ${isDarkMode && "invert"} absolute top-4 right-4 cursor-pointer`}
        />

        {/* Texte de confirmation */}
        <h2 className={`${isDarkMode ? "text-white" : "text-black"} text-xl font-bold text-center pt-6`}>Supprimer {article.name} ?</h2>
        <p className={`text-center ${isDarkMode ? "text-white" : "text-black"}`}>Cette action est irréversible.</p>

        {/* Boutons d'action */}
        <div className={`flex justify-between ${isDarkMode ? "text-white" : "text-black"} gap-4`}>
          <button
            className={`${isDarkMode ? "bg-dark-primary" : "bg-light-primary"} px-4 py-2 rounded-lg hover:bg-gray-700 transition`}
            onClick={() => setIsOpenedDeleteModal(false)}
          >
                        Annuler
          </button>
          <button
            className="bg-red-500/8 px-4 py-2 rounded-lg  hover:bg-red-600 transition"
            onClick={() => {
              // fetchmethod.deleteArticle(article.id);
              handleDelete();
              setIsOpenedDeleteModal(false);
            }}
          >
                        Supprimer
          </button>
        </div>
      </div>
    </>
  );
}
