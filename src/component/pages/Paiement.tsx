import { useState } from "react";
import { useNavigate } from "react-router";
import { Product } from "../../../type/type";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function FakePayment({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); // Indique si le paiement est en cours
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Indique si le paiement a réussi
  const [cardNumber, setCardNumber] = useState(""); // Stocke le numéro de carte entré par l'utilisateur

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

    const cart = JSON.parse(localStorage.getItem("cart") || "[]") as Product[]; // Récupère le panier stocké en local

    // Vérifie si le panier est vide
    if (cart.length === 0) {
      showErrorToast("Votre panier est vide.");
      return;
    }

    setIsProcessing(true); // Active l'état de traitement du paiement

    try {
      // Prépare les données de la commande à envoyer au serveur
      const orderData = {
        articles: cart.map((item: Product) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("\ud83d\udce6 Données envoyées :", JSON.stringify(orderData, null, 2));

      // Envoie la commande au serveur
      const response = await fetch("https://greenrootsapi.zapto.org/commande", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "x-api-key": "123456789",
        },
        body: JSON.stringify(orderData),
      });

      // Vérifie si la réponse est valide
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();
      console.log("\u2705 Commande créée :", data);

      localStorage.removeItem("cart"); // Vide le panier après un paiement réussi
      setPaymentSuccess(true); // Active l'état de succès du paiement
      showSuccessToast("Merci pour votre achat !");

      // Redirige vers la page d'accueil après 2 secondes
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {
      showErrorToast("Erreur lors du paiement. Veuillez réessayer.");
      setIsProcessing(false); // Désactive l'état de traitement en cas d'erreur
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "  bg-dark-primary text-white" : "bg-light-primary"} p-6`}>
      <div className={` ${isDarkMode ? " bg-dark-secondary" : "bg-light-secondary text-black"} p-8 rounded-lg shadow-lg max-w-md w-full 2xl:w-2xl `}>
        <h2 className="text-2xl font-bold mb-6 text-center ">Paiement sécurisé</h2>

        {paymentSuccess ? (
        // Affichage d'un message de succès si le paiement a réussi
          <div className="text-green-600 text-center 2xl:text-2xl">
                        \ud83c\udf89 Paiement réussi ! Redirection en cours...
          </div>
        ) : (
        // Formulaire de paiement
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 2xl:text-2xl">
            <div className="flex flex-col">
              <label >Numéro de carte</label>
              <input
                type="text"
                className="border p-3 rounded-lg bg-dark-primary text-white"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>

            {/* Bouton de paiement */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`${isDarkMode ? "bg-dark-primary" : "bg-light-primary"} border-2 border-white cursor-pointer px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:bg-gray-400`}
            >
              {isProcessing ? "Paiement en cours..." : "Payer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}