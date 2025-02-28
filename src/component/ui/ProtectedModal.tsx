import { Link } from "react-router";

type ProtectedModalProps = {
    isDarkMode: boolean;
    setIsProtectedModal: React.Dispatch<React.SetStateAction<{ open: boolean, pageName: string | null }>>

    pageName: string | null; // Nom dynamique de la page
};

export default function ProtectedModal({ isDarkMode, setIsProtectedModal, pageName }: ProtectedModalProps) {
  return (
    <>
      {/* Overlay avec transition */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={() => setIsProtectedModal({ open: false, pageName: "" })}
      />

      {/* Modale centrée avec animation */}
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 rounded-lg shadow-xl p-8 w-full max-w-md 
        ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-gray-900"} 
        animate-scaleIn`}
      >
        {/* Bouton de fermeture */}
        <button
          className="absolute top-4 right-4 focus:outline-none"
          onClick={() => setIsProtectedModal({ open: false, pageName: "" })}
        >
          <img
            src="/icons/close.svg"
            alt="Fermer la modale"
            className={`w-6 h-6 ${isDarkMode ? "invert" : ""}`}
          />
        </button>

        {/* Titre et description */}
        <h2 className="text-2xl font-semibold text-center mb-2">
                    Connexion requise
        </h2>
        <p className={`text-center text-sm mb-6 ${isDarkMode ? "text-white" : "text-black"}`}>
                    Vous devez être connecté pour accéder à {pageName ? pageName.toLocaleLowerCase() : "cette page"}.
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col gap-4">
          <Link to="/connexion">
            <button
              onClick={() => setIsProtectedModal({ open: false, pageName: "" })}
              className={`w-full py-2 rounded-md font-medium transition-colors duration-200 
                ${isDarkMode
      ? "bg-dark-primary hover:bg-dark-primary-hover text-white"
      : "bg-light-primary hover:bg-light-primary-hover text-gray-900"}`}
            >
                            Se connecter
            </button>
          </Link>
          <Link to="/inscription">
            <button
              onClick={() => setIsProtectedModal({ open: false, pageName: "" })}
              className={`w-full py-2 rounded-md font-medium border transition-colors duration-200 
                ${isDarkMode
      ? "border-dark-primary text-white hover:bg-dark-primary"
      : "border-light-primary text-gray-900 hover:bg-light-primary"}`}
            >
                            S'inscrire
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
