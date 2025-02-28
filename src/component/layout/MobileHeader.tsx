import { Link } from "react-router";
import DarkModeToggle from "../ui/DarkModeToggle";
import { Dispatch, SetStateAction } from "react";
import useCartStore from "../../Auth/cartStore"; // Import du store

interface HeaderProps {
    setIsOpened: Dispatch<SetStateAction<boolean>>;
    setIsModalOpened: Dispatch<SetStateAction<boolean>>;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileHeader({
  setIsOpened,
  setIsModalOpened,
  isDarkMode,
  setIsDarkMode,
}: HeaderProps) {

  const { cart } = useCartStore(); // Récupération du panier depuis Zustand

  // Calcul du total des articles dans le panier
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className={` ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"} w-full h-20 px-2 flex items-center overflow-hidden fixed z-2000`}>

      <div className="flex items-center gap-4 flex-nowrap justify-between w-full ">


        <div>
          <div className={"min-h-screen flex items-center justify-center dark:text-white "}>
            <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          </div>
        </div>

        {/* ✅ Correction ici */}
        <Link to="/panier" className="relative">
          <img className={`w-6 h-6 ${isDarkMode && "invert"}`} src="/icons/shop-card.svg" alt="Panier" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
        <Link to="/"><img className="h-18 w-18 rounded-sm" src="/icons/logo.webp" alt="Logo" /></Link>

        <img onClick={() => setIsModalOpened(prev => !prev)} className={`w-6 h-6 ${isDarkMode && "invert"}`} src="/icons/user.svg" alt="Profil" />

        {/* BurgerMenu au click on met l'inverse de isOpened */}
        <img onClick={() => setIsOpened(prev => !prev)} className={`w-6 h-6 ${isDarkMode && "invert"}`} src="/icons/burger-menu.svg" alt="Menu" />
      </div>

    </header>
  );
}
