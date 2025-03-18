import { IUserInfos } from "../../../type/type";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../Auth/authStore";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function DeleteAccountModal({
  isOpenedDeleteAccountModal,
  setIsOpenedDeleteAccountModal,
  isDarkMode,
  setUser,
}: {
    isOpenedDeleteAccountModal: boolean;
    setIsOpenedDeleteAccountModal: React.Dispatch<React.SetStateAction<boolean>>;
    isDarkMode: boolean;
    user: IUserInfos
    setUser: React.Dispatch<React.SetStateAction<IUserInfos>>;
}) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Aucun token trouvé !");
      return;
    }

    try {
      const response = await fetch("https://greenrootsapi.zapto.org/compte", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Utilisation du token
          "x-api-key": "123456789",
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        showErrorToast(errorData.error || "Erreur lors de la suppression du compte");
        return;
      }

      setUser({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        // eslint-disable-next-line camelcase
        repeat_password: ""
      });
      logout();
      setIsOpenedDeleteAccountModal(false);
      showSuccessToast("Compte supprimé avec succès !");
      navigate("/");
      console.log("Compte supprimé avec succès !");
    } catch (error) {
      console.error("Erreur réseau :", error);
      showErrorToast("Erreur lors de la suppression du compte");
    }
  };



  return (
    <>
      {/* Overlay qui ferme la modale en cliquant à l'extérieur */}
      {isOpenedDeleteAccountModal && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpenedDeleteAccountModal(false)}
        />
      )}

      {/* Modale */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"}w-80 p-6 rounded-lg shadow-lg  flex flex-col gap-6 z-20`}>

        {/* Bouton de fermeture */}
        <img
          onClick={() => setIsOpenedDeleteAccountModal(false)}
          src="/icons/close.svg"
          alt="Fermer la modale"
          className={`w-6 h-6 ${isDarkMode && "invert"} absolute top-4 right-4 cursor-pointer`}
        />

        {/* Texte de confirmation */}
        <h2 className="text-xl font-bold text-center">Etes vous sur de supprimer votre compte</h2>
        <p className="text-center text-gray-300">Cette action est irréversible.</p>

        {/* Boutons d'action */}
        <div className="flex justify-between">
          <button
            className={`${isDarkMode ? "bg-dark-primary" : "bg-light-primary"} px-4 py-2 rounded-lg text-white hover:bg-gray-700 transition`}
            onClick={() => setIsOpenedDeleteAccountModal(false)}
          >
                        Annuler
          </button>
          <button
            className="bg-red-500/80 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
            onClick={() => {
              handleDeleteAccount();
              setIsOpenedDeleteAccountModal(false);
            }}
          >
                        Supprimer
          </button>
        </div>
      </div>
    </>
  );
}