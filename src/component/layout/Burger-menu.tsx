import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../Auth/authStore";

export default function BurgerMenu({ isOpened, setIsOpened, isDarkMode, setIsProtectedModal }: {
    isOpened: boolean, setIsOpened: React.Dispatch<React.SetStateAction<boolean>>, isDarkMode: boolean, setIsProtectedModal: React.Dispatch<React.SetStateAction<{ open: boolean, pageName: string | null }>>
}) {

  // Fonction pour gérer les routes protégées
  const navigate = useNavigate();
  // Récupération du token
  const { token } = useAuthStore();

  const handleProtectedRoute = (pageName: string) => {
    if (!token) {
      // Passe le nom de la page à la modale
      setIsProtectedModal({ open: true, pageName });
    } else {
      // Redirige vers la page demandée
      navigate(`/${pageName.toLowerCase()}`);
    }
  };


  return (
    <>
      {/* Overlay qui ferme le menu en cliquant à l'extérieur */}
      {isOpened && (
        <div
          className="fixed inset-0  z-10"
          onClick={() => setIsOpened(false)}
        />
      )}


      <nav className={`${isDarkMode ? "bg-dark-accent text-white" : "bg-light-secondary text-black"} w-40 h-dvh z-1900 fixed right-0 top-0 flex flex-col justify-between items-center gap-6 pb-6 pt-20 md:w-64 `}>


        {/* Passage du state a false pour fermé le burger menu une fois cliqué */}

        <ul className="flex flex-col gap-1 w-full text-lg md:text-xl">
          <Link to="/" onClick={() => setIsOpened(false)}><li className="border-b pl-2 font-title font-bold ">Accueil</li></Link>
          <Link to="/boutique" onClick={() => setIsOpened(false)}><li className="border-b pl-2 font-title font-bold ">Boutique</li></Link>
          <li onClick={() => { setIsOpened(false); handleProtectedRoute("historique"); }} className="border-b pl-2 font-title font-bold">Historique </li>
          <li onClick={() => { setIsOpened(false); handleProtectedRoute("suivis"); }} className="border-b pl-2 font-title font-bold">Suivis </li>

        </ul>
        <div className="flex flex-col gap-6 items-center">
          <Link to="/cgu" onClick={() => setIsOpened(false)}><p className="text-center font-title font-bold md:text-xl md:size-md">CGU</p> </Link>
          <ul className={`flex flex-row gap-6 md:size-md ${isDarkMode && "invert"}`}>
            <li><a><img className="w-6 h-6 " src="/icons/facebook.svg" alt="" /></a></li>
            <li><a><img className="w-6 h-6 " src="/icons/instagram.svg" alt="" /></a></li>
            <li><a><img className="w-6 h-6" src="/icons/linkedin.svg" alt="" /></a></li>
          </ul>
        </div>
      </nav>
    </>
  );
}