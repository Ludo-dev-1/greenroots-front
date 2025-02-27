import { useEffect, useState } from "react";
import { IArticleTracking, ITracking } from "../../../type/type";
import { useAuthStore } from "../../Auth/authStore";
import fetchmethod from "../../fetch/method-fetch";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

interface TrackingArticleModalProps {
    setOrdersTracking: React.Dispatch<React.SetStateAction<ITracking[]>>;
    setTrackingModal: React.Dispatch<React.SetStateAction<boolean>>;
    trackingModal: boolean;
    isDarkMode: boolean; // Ajout d'un ID pour le suivi
    ordersTracking: IArticleTracking[];
    selectedTrackingId: number | null;
    refetchTracking: () => Promise<void>;
}

export default function TrackingArticleModal({
  setOrdersTracking,
  setTrackingModal,
  trackingModal,
  isDarkMode,
  selectedTrackingId,
  refetchTracking
}: TrackingArticleModalProps) {
  const { isAdmin } = useAuthStore();
  // const [getDetailOneTracking, setGetDetailOneTracking] = useState<Iorder[]>([]);
  const [formData, setFormData] = useState({
    location: "",
    image: null as string | File | null,
    status: "",
    growth: "",
  });

  // Récupération de l'ID de la commande depuis le localStorage et vérification
  const orderIdString = localStorage.getItem("orderId");
  let orderId: number | null = null;
  if (!orderIdString || orderIdString === "undefined") {
    console.error("orderId non défini ou invalide dans le localStorage");
  } else {
    orderId = parseInt(orderIdString, 10);
    if (isNaN(orderId)) {
      console.error("orderId n'est pas un nombre valide");
      orderId = null;
    }
  }

  useEffect(() => {
    const fetchTrackingDetails = async () => {
      if (!orderId) {
        console.error("orderId invalide. Impossible de récupérer les détails.");
        return;
      }
      if (!selectedTrackingId) {
        console.warn("Aucun tracking sélectionné.");
        return;
      }

      try {
        console.log(`Fetching tracking avec l'ID: ${selectedTrackingId}`);
        const data = isAdmin
          ? await fetchmethod.getTrackingByIdAdmin(orderId, selectedTrackingId)
          : await fetchmethod.getTrackingByIdUser(orderId, selectedTrackingId);

        console.log(`Données reçues pour le tracking ID ${selectedTrackingId}:`, data);
        // setGetDetailOneTracking([data as unknown as Iorder]);
        setFormData({
          location: data[0]?.plantPlace || "",
          image: null,
          status: data[0]?.status || "",
          growth: data[0]?.growth || "",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
      }
    };

    if (trackingModal) {
      fetchTrackingDetails();
    }
  }, [trackingModal, isAdmin, orderId, selectedTrackingId]);

  // Gestion des changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Conversion d'un fichier en Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!orderId) {
      showErrorToast("Erreur : orderId invalide. Veuillez réessayer.");
      return;
    }

    try {
      let pictureBase64 = null;
      if (formData.image instanceof File) {
        pictureBase64 = await convertToBase64(formData.image);
      } else if (typeof formData.image === "string" && formData.image.startsWith("http")) {
        pictureBase64 = formData.image;
      }

      const payload = {
        plantPlace: formData.location,
        status: formData.status,
        growth: formData.growth,
        ...(pictureBase64 ? { pictureUrl: pictureBase64 } : {}),
      };

      console.log("Payload de la requête :", payload);
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": "123456789",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(
        `https://donovangrout-server.eddi.cloud/${isAdmin ? "api" : "compte"}/commandes/${orderId}/suivi/${selectedTrackingId}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),

        }
      );

      const text = await res.text();
      const responseData = text ? JSON.parse(text) : {};

      if (!res.ok) {
        console.error("Erreur du serveur :", responseData);
        throw new Error(responseData.message || `Erreur HTTP: ${res.status}`);
      }

      console.log("Réponse du serveur :", responseData);
      setOrdersTracking((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          ArticleTrackings: order.ArticleTrackings?.map((tracking) =>
            tracking.id === selectedTrackingId ? { ...tracking, ...payload } : tracking
          )
        }))
      );


      showSuccessToast("Suivi mis à jour avec succès !");
      await refetchTracking();
      setTrackingModal(false);
    } catch (error: unknown) {
      console.error("Erreur lors de la mise à jour du suivi :", error);
      if (error instanceof Error) {
        showErrorToast(error.message || "Erreur lors de la mise à jour du suivi");
      } else {
        showErrorToast("Erreur lors de la mise à jour du suivi");
      }
    }
  };




  return (
    <>
      {/* Overlay pour fermer la modale */}
      {trackingModal && (
        <div
          className="fixed inset-0 bg-black/50 z-1800"
          onClick={() => setTrackingModal(false)}
        />
      )}

      {/* Modale */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"
        } w-80 p-6 rounded-lg shadow-lg flex flex-col gap-4 z-1850 mt-8`}
      >
        {/* Bouton de fermeture */}
        <img
          onClick={() => setTrackingModal(false)}
          src="/images/icons/close.svg"
          alt="Fermer la modale"
          className={`w-6 h-6 ${isDarkMode && "invert"} absolute top-4 right-4 cursor-pointer`}
        />

        {/* Titre */}
        <h2 className="text-xl font-bold text-center">Modifier le suivi</h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Lieu */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Lieu</label>
            <input
              type="text"
              placeholder="Ex: Jardin central"
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Image</label>
            <input
              type="file"
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Status</label>
            <input
              type="text"
              placeholder="Ex: En croissance"
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            />
          </div>

          {/* Croissance */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Croissance</label>
            <textarea
              placeholder="Ex: L'arbre a pris 15 cm ce mois-ci..."
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta resize-none"
              name="growth"
              value={formData.growth}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="bg-red-500/80 px-4 py-2 rounded-lg text-white hover:bg-red-600 transition"
              onClick={() => setTrackingModal(false)}
            >
                            Annuler
            </button>
            <button
              type="submit"
              className="bg-cta px-4 py-2 rounded-lg text-white hover:bg-cta-dark transition"
            >
                            Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </>
  );

}