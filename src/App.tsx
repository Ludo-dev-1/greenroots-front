// Imports
import Index from "./component/pages/Index";
import Page404 from "./component/pages/Page404";
import Boutique from "./component/pages/Boutique";
import Header from "./component/layout/Header";
import BurgerMenu from "./component/layout/Burger-menu";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import Connexion from "./component/pages/Connexion";
import Inscription from "./component/pages/Inscription";
import Footer from "./component/layout/Footer";
import ConnexionModal from "./component/ui/Connexion-modal";
import Panier from "./component/pages/Panier";
import UserSpace from "./component/pages/User-space";
import Page403 from "./component/pages/Page403";
import Cgu from "./component/pages/Cgu";
import SuivisArbresUser from "./component/pages/SuivisArbreUser";
import DetailModal from "./component/ui/Detail-modal";
import { Itrees } from "../type/type";
import FakePayment from "./component/pages/Paiement";
import Historique from "./component/pages/Historique";
import { useLoaderStore } from "./Auth/loaderStore";
import Loader from "./component/layout/Loader";
import ProtectedModal from "./component/ui/ProtectedModal";
import ProtectedRoute from "./component/layout/ProtectedRoute";
import { useAuthStore } from "./Auth/authStore";




function App() {
  // State du burger-menu
  const [isOpened, setIsOpened] = useState<boolean>(false);
  // State de la modale de connexion
  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  // State de la modalde de détail d'un article
  const [isOpenDetail, setIsOpenDetail] = useState<boolean>(false);
  // state de l'article séléctionné
  const [selectedArticle, setSelectedArticle] = useState<Itrees | null>(null);
  // state du thème
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  // state de la modale de page protégée
  const [isprotectedModal, setIsProtectedModal] = useState<{ open: boolean, pageName: string | null }>({
    open: false,
    pageName: null,
  });

  // initialisation du loader de l'app
  const { isLoading, showLoader, hideLoader } = useLoaderStore();


  // Fake loader pour simuler un chargement initial
  useEffect(() => {
    // Simule un chargement initial de l'app
    showLoader();
    setTimeout(() => {
      hideLoader();
    }, 1500); // 1.5 secondes de chargement initial
  }, [showLoader, hideLoader]);

  const {logout} = useAuthStore();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Appelle ta fonction logout ici
      logout();

      // Pour certains navigateurs, tu dois définir returnValue
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [logout]);

  // Affichage de l'app
  return (


    <Router>

      {/* Loader Global */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      <>
        {/* Header générique */}
        <Header
          setIsOpened={setIsOpened}
          setIsModalOpened={setIsModalOpened}
          setIsDarkMode={setIsDarkMode}
          isDarkMode={isDarkMode}
          setIsProtectedModal={setIsProtectedModal}
        />
        {/* Affichage du BurgerMenu */}
        {isOpened && <BurgerMenu setIsOpened={setIsOpened} isOpened={isOpened} isDarkMode={isDarkMode} setIsProtectedModal={setIsProtectedModal} />}

        {/* Affichage de la modale de connexion */}
        {isModalOpened && <ConnexionModal setIsModalOpened={setIsModalOpened} isModalOpened={isModalOpened} isDarkMode={isDarkMode} />}

        {/* Affichage de la modale de détail*/}
        {isOpenDetail && selectedArticle && (<DetailModal
          setIsOpenDetail={setIsOpenDetail}
          article={selectedArticle}
          isOpenOrderDetail={isOpenDetail}
          isDarkMode={isDarkMode} />)}

        {/* Modale conditionelle pour les routes authentifiée */}
        {isprotectedModal.open && <ProtectedModal isDarkMode={isDarkMode} setIsProtectedModal={setIsProtectedModal} pageName={isprotectedModal.pageName} />}


        {/* Routes de l'application */}

        {/* Landing page */}
        <Routes>
          <Route path="/" element={<Index setIsOpenDetail={setIsOpenDetail}
            setSelectedArticle={setSelectedArticle}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode} isOpenDetail={false}          />} />

          {/* Page Shop */}
          <Route path="/boutique" element={<Boutique
            setIsOpenDetail={setIsOpenDetail}
            setSelectedArticle={setSelectedArticle}
            selectedArticle={selectedArticle}
            isDarkMode={isDarkMode}
          />} />



          <Route path="/panier" element={<Panier isDarkMode={isDarkMode} />} />
          <Route path="/connexion" element={<Connexion isDarkMode={isDarkMode} />} />
          <Route path="/inscription" element={<Inscription isDarkMode={isDarkMode} />} />
          <Route path="/cgu" element={<Cgu />}/>
          <Route path="/paiement" element={<FakePayment isDarkMode={isDarkMode} />} />

          {/* Route protégée */}
          <Route
            path="/historique"
            element={
              <ProtectedRoute>
                {<Historique isDarkMode={isDarkMode}  article={selectedArticle} />}
              </ProtectedRoute>
            }
          />
          <Route
            path="/compte"
            element={
              <ProtectedRoute>
                {<UserSpace isDarkMode={isDarkMode} />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/suivis"
            element={
              <ProtectedRoute>
                {<SuivisArbresUser isDarkMode={isDarkMode} />}
              </ProtectedRoute>
            }
          />

          {/* page d'erreur */}
          <Route path="/interdit" element={<Page403 />} />
          <Route path="*" element={<Page404 />} />
        </Routes>


        {/* Footer générique */}
        <Footer isDarkMode={isDarkMode} />
      </>
    </Router>


  );
}

export default App;
