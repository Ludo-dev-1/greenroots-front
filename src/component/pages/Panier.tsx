import { Link, useNavigate } from "react-router";
import useCartStore from "../../Auth/cartStore";
import { useAuthStore } from "../../Auth/authStore";
import { useState } from "react";
import { showErrorToast, } from "../../../utils/toast";

export default function Panier({ isDarkMode }: { isDarkMode: boolean }) {
  const { cart, removeFromCart, updateQuantity } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const handlePayment = () => {
    if (cart.length === 0) return; // Empêcher le paiement si le panier est vide
    if (!isChecked) {
      showErrorToast("Veuillez accepter les conditions générales de vente.");
      return;
    }
    if (!token) {
      showErrorToast("Vous devez être connecté pour effectuer un paiement.");
      return;
    }
    navigate("/paiement");
  };

  return (
    <div className={`${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"} px-4 py-10  w-full min-h-screen flex flex-col gap-6 pt-20 lg:pt-40 2xl:text-2xl`}>
      <h1 className="text-center  font-bold ">Votre panier</h1>

      {/* Articles du panier */}
      <div className="w-full flex flex-col gap-4 lg:max-w-4xl lg:mx-auto ">
        {cart.length === 0 ? (
          <p className="text-center text-gray-800">Votre panier est vide.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className={`${isDarkMode ? "bg-dark-accent" : "bg-light-secondary"} p-4 flex flex-col sm:flex-row items-center gap-4 shadow-lg w-full rounded-lg border lg:flex-row lg:justify-between lg:p-6`}>
              {/* Image de l'article */}
              <img
                className="size-20 sm:size-24 lg:size-28 object-cover rounded-lg"
                src={item.Picture ? item.Picture.url : "/images/default.jpg"}
                alt={item.name}
              />

              {/* Nom et prix */}
              <div className="text-center sm:text-left flex flex-col sm:flex-grow lg:flex-grow-0 lg:w-1/4">
                <p className="text-sm font-bold lg:text-base">{item.name}</p>
                <p className="text-lg font-semibold lg:text-xl">{item.price} €</p>
              </div>

              {/* Sélecteur de quantité */}
              <div className="flex flex-row items-center gap-3 lg:gap-5">
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={`size-8 flex items-center justify-center ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"}  border rounded-lg p-1`}>
                  <img className={`size-6 ${isDarkMode ? "invert" : ""} cursor-pointer hover:scale-110`} src="/icons/chevron-up.svg" alt="Augmenter" />
                </button>
                <p className="w-8 text-center text-lg font-bold lg:text-xl">{item.quantity}</p>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={`size-8 flex items-center justify-center ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"}  border rounded-lg p-1`}>
                  <img className={`size-6 ${isDarkMode ? "invert" : ""} cursor-pointer hover:scale-110`} src="/icons/chevron-down.svg" alt="Diminuer" />
                </button>
              </div>

              {/* Prix total */}
              <p className="text-lg font-semibold lg:text-xl">{(item.price * item.quantity).toFixed(2)} €</p>

              {/* Bouton de suppression */}
              <button onClick={() => removeFromCart(item.id)} className="size-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-lg p-1 cursor-pointer hover:scale-110">
                <img className="size-6 invert cursor-pointer hover:scale-110" src="/icons/trash.svg" alt="Supprimer" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Section Total & Paiement */}
      <div className={`${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"} p-6 flex flex-col gap-6 shadow-lg w-full rounded-lg border lg:max-w-4xl lg:mx-auto`}>
        <div className="flex justify-between text-lg font-semibold lg:text-xl">
          <h2>Total</h2>
          <p>{cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} €</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <input type="checkbox" id="cgv" className="size-5 cursor-pointer hover:scale-110" onChange={(e) => setIsChecked(e.target.checked)} />
            <label htmlFor="cgv" className="text-sm lg:text-base ">J'accepte les conditions générales de vente</label>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Link to="/cgu" className={`underline text-sm ${isDarkMode ? "text-white" : "text-black"} hover:text-white lg:text-base`}>Voir les CGU</Link>
            <button
              onClick={handlePayment}
              className={`cursor-pointer hover:scale-101 ${isDarkMode ? "bg-dark-primary " : "bg-light-primary"} w-full text-lg px-6 py-3 rounded-lg font-bold transition lg:text-xl 
                                ${cart.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-90"}`}
              disabled={cart.length === 0}>
                            Payer
            </button>
          </div>
        </div>
      </div>

      <Link to="/boutique" className={`text-center p-4 ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"} rounded-lg font-semibold text-lg hover:bg-opacity-90 transition lg:text-xl lg:max-w-4xl lg:mx-auto`}>
                Retour à la boutique
      </Link>
    </div>
  );
}
