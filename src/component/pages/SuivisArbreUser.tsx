// Imports des hooks React et des composants nécessaires
import { useEffect, useState } from "react";
import { useAuthStore } from "../../Auth/authStore";
import Map from "../ui/Map";
import { ITracking, IArticleTracking } from "../../../type/type";
import TrackingArticleModal from "../ui/TrackingArticleModal";

export default function SuivisArbresUser({ isDarkMode }: { isDarkMode: boolean }) {

  // State pour stocker les données de suivi des commandes
  const [ordersTracking, setOrdersTracking] = useState<IArticleTracking[]>([]);
  const [trackingModal, setTrackingModal] = useState<boolean>(false);
  const [selectedTrackingId,] = useState<number | null>(null);

  // Récupération de l'ID de la commande depuis le localStorage
  const orderId = localStorage.getItem("orderId");

  // Fonction pour récupérer le suivi de la commande
  const getOrderTracking = async () => {
    if (orderId) {
      console.log("L'ID de la commande récupéré :", orderId);
    } else {
      console.log("Aucun ID de commande trouvé dans le localStorage");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Tracking des commandes :", ordersTracking);

      // Requête API pour récupérer le suivi des commandes
      const response = await fetch(
        `https://donovangrout-server.eddi.cloud/${isAdmin ? "api" : "compte"}/commandes/${orderId}/suivi?timestamp=${Date.now()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            "x-api-key": "123456789",
          },
        }
      );

      const data = await response.json();
      console.log("Données reçues :", data);

      let transformedData;
      if (Array.isArray(data)) {
        transformedData = data.map((order) => ({
          ...order,
          ArticleTrackings: order.ArticleTrackings.map((tracking: ITracking) => {
            // Si l'ID de la commande associée à ce tracking n'est pas celui du localStorage,
            // on force le statut et le plant_place à des valeurs par défaut.
            if (
              tracking.ArticleHasOrder &&
              tracking.ArticleHasOrder.Order &&
              tracking.ArticleHasOrder.Order.id !== Number(orderId)
            ) {
              return {
                ...tracking,
                status: "À définir",
                plantPlace: "À définir",
              };
            }
            return tracking;
          }),
        }));
        setOrdersTracking(transformedData.flatMap(order => order.ArticleTrackings));
      } else {
        transformedData = data.articles || [];
        setOrdersTracking(transformedData);
      }
    } catch (error) {
      console.error("Erreur lors du fetch des commandes :", error);
    }
  };

  // Récupération du rôle de l'utilisateur
  const { isAdmin } = useAuthStore();

  // Exécuter la récupération des données de suivi au montage du composant
  useEffect(() => {
    getOrderTracking();
  }, []);

  // Afficher les données de suivi à chaque mise à jour de ordersTracking
  useEffect(() => {
    console.log("⚙️ Données brutes reçues :", ordersTracking);
  }, [ordersTracking]);

  // Fonction pour calculer l'âge d'un suivi (avec précision en heures)
  function calculerAgeAvecHeures(dateString: string) {
    const dateDeNaissance = new Date(dateString);
    const aujourdHui = new Date();

    let age = aujourdHui.getFullYear() - dateDeNaissance.getFullYear();
    let mois = aujourdHui.getMonth() - dateDeNaissance.getMonth();
    let jours = aujourdHui.getDate() - dateDeNaissance.getDate();
    let heures = aujourdHui.getHours() - dateDeNaissance.getHours();

    // Ajustements des valeurs négatives
    if (mois < 0 || (mois === 0 && jours < 0)) {
      age--;
      mois += 12;
    }
    if (jours < 0) {
      const dernierMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 0);
      jours += dernierMois.getDate();
      mois--;
    }
    if (heures < 0) {
      heures += 24;
      jours--;
      if (jours < 0) {
        mois--;
        const dernierMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 0);
        jours += dernierMois.getDate();
      }
    }

    return { années: age, mois: mois, jours: jours, heures: heures };
  }

  return (
    <div className={`pt-40  w-full h-full pb-40  ${isDarkMode ? "bg-dark-primary" : "bg-light-primary text-black"}`}>
      {/* Modal de suivi des articles */}
      {trackingModal && (
        <TrackingArticleModal
          selectedTrackingId={selectedTrackingId}
          setTrackingModal={setTrackingModal}

          trackingModal={trackingModal}
          refetchTracking={getOrderTracking}
          isDarkMode={isDarkMode}
          ordersTracking={ordersTracking} setOrdersTracking={() => {
            throw new Error("Function not implemented.");
          }}        />
      )}
      <h1 className={`text-4xl font-bold text-center mb-10 ${isDarkMode ? "text-white" : "text-black"}`}>
        🌱 Suivi de vos arbres 🌿
      </h1>


      <div className={"flex flex-wrap gap-20 m-auto h-fit w-full justify-center max-w-7xl rounded-lg "}>
        {/* Affichage des commandes suivies */}
        {ordersTracking.map((order) => {
          if (!order.ArticleTrackings || !order.article_has_order_id) return null;
          const quantity = order.article_has_order_id;

          return order.ArticleTrackings.slice(0, quantity).map((tracking: IArticleTracking, index: number) => (
            <div
              key={`${order.id}-${tracking.id}-${index}`}
              className={`w-5/6 lg:w-lg h-full flex flex-col gap-4 border-zinc-200 p-6 justify-center rounded-lg border shadow-black shadow-lg ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} 2xl:grid 2xl:text-2xl`}
            >
              <h3 className="text-center">Surnom : {tracking.nickname}</h3>
              <div>
                <img src={tracking.Picture?.url} alt="" />
              </div>
              <div className="mb-6">
                <strong>Lieu :</strong> {tracking.plant_place || "Non défini"}
                <br />
                <strong>Statut :</strong> {tracking.status}
                <br />
                <strong>Croissance :</strong> {tracking.growth}
                <br />
                <strong>Age :</strong> {calculerAgeAvecHeures(tracking.created_at).années} ans, {calculerAgeAvecHeures(tracking.created_at).mois} mois, {calculerAgeAvecHeures(tracking.created_at).jours} jours, {calculerAgeAvecHeures(tracking.created_at).heures} heures
              </div>
              <h3 className="text-xl text-center pb-1">📍 Localisation :</h3>
              <Map city={tracking.plant_place} />
            </div>
          ));
        })}
      </div>
    </div>
  );
};
