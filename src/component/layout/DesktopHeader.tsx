import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../Auth/authStore";
import useCartStore from "../../Auth/cartStore"; // Import du store du panier
import DarkModeToggle from "../ui/DarkModeToggle";
import { useEffect, useState } from "react";
import fetchmethod from "../../fetch/method-fetch";
import { IUserInfos } from "../../../type/type";
import { showSuccessToast } from "../../../utils/toast";

interface DesktopHeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsProtectedModal: React.Dispatch<React.SetStateAction<{ open: boolean, pageName: string | null }>>

}

export default function DesktopHeader({ isDarkMode, setIsDarkMode, setIsProtectedModal }: DesktopHeaderProps) {
  const { token, logout } = useAuthStore();
  const navigate = useNavigate();
  const { cart } = useCartStore(); // Récupération du panier

  // Calcul du nombre total d'articles dans le panier
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleProtectedRoute = (pageName: string) => {
    if (!token) {
      // Passe le nom de la page à la modale
      setIsProtectedModal({ open: true, pageName });
    } else {
      // Redirige vers la page demandée
      navigate(`/${pageName.toLowerCase()}`);
    }
  };

  const [userInfos, setUserInfos] = useState<IUserInfos | null>(null);


  useEffect(() => {
    if (token) {
      fetchmethod.getUserInfos()
        .then((data: IUserInfos) => setUserInfos(data))
        .catch((error) => console.error("Erreur lors de la récupération des infos utilisateur :", error));
    }
  }, [token]);





  return (

    <header className={`fixed z-30 ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"} px-4  w-full h-24  2xl:h-30  flex items-center justify-between shadow-lg z-10000  `}>
      <div className={`flex items-center gap-10 text-white font-title text-xl 2xl:text-3xl`}>
        {/* Logo */}
        <Link to="/">
          <img className="h-16 rounded-lg 2xl:w-25 2xl:h-25" src="src/assets/images/logo.webp" alt="Logo" />
        </Link >
      </div>
      {/* Navigation */}
      <nav className="cursor-pointer 2xl:ml-60">
        <ul className={`flex items-center lg:gap-8 xl:gap-14 text-white font-title text-xl 2xl:text-3xl `}>
          <li>
            <Link to="/" className={`group relative px-4 py-2  transition ${isDarkMode ? "text-white" : "text-black"}`}>
              Accueil
              <span className={`absolute left-0 bottom-0 w-full h-1  ${isDarkMode ? "bg-white" : "bg-black"} scale-x-0 group-hover:scale-x-100 transition-transform`}></span>
            </Link>
          </li>
          <li>
            <Link to="/boutique" className={`group relative px-4 py-2  transition ${isDarkMode ? "text-white" : "text-black"}`}>
              Boutique
              <span className={`absolute left-0 bottom-0 w-full h-1  ${isDarkMode ? "bg-white" : "bg-black"} scale-x-0 group-hover:scale-x-100 transition-transform`}></span>
            </Link>
          </li>
          <li
            onClick={() => { handleProtectedRoute("historique") }}
            className={`group relative px-4 py-2  transition ${isDarkMode ? "text-white" : "text-black"}`}>
            Historique
            <span className={`absolute left-0 bottom-0 w-full h-1  ${isDarkMode ? "bg-white" : "bg-black"} scale-x-0 group-hover:scale-x-100 transition-transform`}></span>

          </li>
          <li
            onClick={() => { handleProtectedRoute("suivis") }}
            className={`group relative px-4 py-2  transition ${isDarkMode ? "text-white" : "text-black"}`}>
            Suivis
            <span className={`absolute left-0 bottom-0 w-full h-1  ${isDarkMode ? "bg-white" : "bg-black"} scale-x-0 group-hover:scale-x-100 transition-transform`}></span>

          </li>
        </ul>
      </nav>
      {/* Icônes et Actions */}
      <div className={`flex items-center gap-4`}>
        {/* Lien vers le panier avec compteur */}
        <Link to="/panier" className="relative">
          <img className={`h-8 ${isDarkMode && "invert"} cursor-pointer hover:scale-110 transition`} src="/src/assets/images/icons/shop-card.svg" alt="Panier" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>


        <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />


        {/* 🔥 Condition : Si l'utilisateur est connecté, afficher "Mon Compte" et "Déconnexion" */}
        {token ? (
          <div className="flex gap-4">
            <Link to="/compte" >

              <button className={` flex gap-4 px-4 py-1 rounded-lg cursor-pointer hover:scale-110 text-lg ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"}  `}>
                <img className={`w-8 h-8 lg:w-6 lg:h-6 ${isDarkMode && "invert"} m-auto`} src="/images/icons/user.svg" alt="profil" />
                <p>{userInfos?.firstname} {userInfos?.lastname} </p>
              </button>

            </Link>
            <button
              className={`flex px-4 py-1 rounded-lg bg-red-500/80 cursor-pointer hover:scale-110 text-lg ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"}`}
              onClick={() => {
                logout();
                showSuccessToast("Vous êtes déconnecté");
                setTimeout(() => {
                  navigate("/");
                }, 100)
              }}
            >
              <img className={`w-8 h-8 lg:w-6 lg:h-6 ${isDarkMode && "invert"} m-auto`} src="./images/icons/logout.svg" alt="logo logout" />
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="flex gap-4 pr-4">
            <Link to="/inscription">
              <button className={`px-4 py-1 rounded-lg bg-dark-primary cursor-pointer hover:scale-110 text-lg ${!isDarkMode ? "bg-light-primary text-black" : "text-white"}  2xl:text-2xl`}>
                Inscription
              </button>
            </Link>
            <Link to="/connexion">
              <button className={`px-4 py-1 rounded-lg bg-dark-primary cursor-pointer hover:scale-110 text-lg ${!isDarkMode ? "bg-light-primary text-black" : "text-white"}   2xl:text-2xl`}>
                Connexion
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
