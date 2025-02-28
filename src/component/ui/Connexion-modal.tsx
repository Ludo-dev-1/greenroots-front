import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../Auth/authStore";
import { showSuccessToast } from "../../../utils/toast";

export default function ConnexionModal({ isModalOpened, setIsModalOpened, isDarkMode }: {
    isModalOpened: boolean,
    setIsModalOpened: React.Dispatch<React.SetStateAction<boolean>>
    isDarkMode: boolean,
}) {

  const { token, logout } = useAuthStore();
  const navigate = useNavigate();

  // Classes communes pour les boutons
  const commonButtonClasses = "flex justify-center items-center px-10 mx-10 p-2 rounded-sm md:rounded-md lg:rounded-lg cursor-pointer hover:scale-110 md:text-lg";

  return (
    <>
      {/* Overlay qui ferme la modale en cliquant à l'extérieur */}
      {isModalOpened && (
        <div
          className="fixed inset-0 bg-black/50  z-10"
          onClick={() => setIsModalOpened(false)}
        />
      )}

      {/* Modale */}
      <div
        className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} bg-opacity-90 w-64 h-auto p-6 rounded-lg text-center shadow-lg flex flex-col justify-between items-center gap-4 z-30 md:p-10 md:w-96 md:gap-6 md:rounded-xl md:top-1/2`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo de fermeture X */}
        <img
          onClick={() => setIsModalOpened(false)}
          className={`w-8 h-8 absolute top-4 right-4 cursor-pointer md:w-10 md:h-10 md:top-9 md:right-6 ${isDarkMode && "invert"}`}
          src="/icons/close.svg"
          alt="Fermer"
        />

        {/* Si l'utilisateur est connecté */}
        {token ? (
          <>
            <div className="flex flex-col gap-2 min-w-34">
              <p className="font-content md:text-lg">Accéder à votre compte</p>
              <Link
                to="/compte"
                className={`${commonButtonClasses} ${isDarkMode ? "bg-dark-primary" : "bg-light-primary"}`}
                onClick={() => setIsModalOpened(false)}
              >
                                Mon Compte
              </Link>
            </div>

            <div className="flex flex-col gap-2 min-w-34">
              <p className="font-content md:text-lg">Vous souhaitez quitter ?</p>
              <button
                className={`${commonButtonClasses} bg-red-500/80 font-title font-bold`}
                onClick={() => {
                  logout();
                  setIsModalOpened(false);
                  showSuccessToast("Vous êtes déconnecté");
                  navigate("/");
                }}
              >
                                Déconnexion
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Si l'utilisateur n'est pas connecté */}
            <div className="flex flex-col gap-2 min-w-34">
              <p className="font-content md:text-lg">Déjà un compte ?</p>
              <Link
                to="/connexion"
                className={`${commonButtonClasses} ${isDarkMode ? "bg-dark-primary" : "bg-light-primary"}`}
                onClick={() => setIsModalOpened(false)}
              >
                                Connexion
              </Link>
            </div>

            <div className="flex flex-col gap-2 min-w-34">
              <p className="font-content md:text-lg">S'enregistrer</p>
              <Link
                to="/inscription"
                className={`${commonButtonClasses} ${isDarkMode ? "bg-dark-primary" : "bg-light-primary"}`}
                onClick={() => setIsModalOpened(false)}
              >
                                S'inscrire
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
