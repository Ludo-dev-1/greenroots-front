import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../Auth/authStore";
import { useState } from "react";

import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function Connexion({ isDarkMode }: { isDarkMode: boolean }) {
  // États pour stocker les informations de connexion
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction de connexion issue du store d'authentification
  const login = useAuthStore((state) => state.login);

  // Hook de navigation pour rediriger l'utilisateur après la connexion
  const navigate = useNavigate();

  // Gestion de la soumission du formulaire de connexion
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Envoi des identifiants à l'API
      const response = await fetch("https://greenrootsapi.zapto.org/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "123456789", },
        body: JSON.stringify({ email, password }),

      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }



      // Mise à jour du store avec le token
      login(data.token);
      // Affichage d'un message de succès
      showSuccessToast("Connexion réussie !");
      navigate("/"); // Redirection vers la page d'accueil
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        showErrorToast(error.message);
      } else {
        showErrorToast("Une erreur inconnue s'est produite");
      }
    }
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"}`}>
      <div className="w-full max-w-md p-6 rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-10">Rebonjour</h1>

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          {/* Champ Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold mb-1">Adresse e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre adresse e-mail"
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Champ Mot de passe */}
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold mb-1">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Link to="/mot-de-passe-oublie" className="text-sm hover:underline pt-2 self-end">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            className={`w-full p-3 rounded-lg cursor-pointer hover:scale-105 transition-transform ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"}`}
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}
