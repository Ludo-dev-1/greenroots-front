import { useState } from "react";
import { useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function Inscription({ isDarkMode }: { isDarkMode: boolean }) {
  // Déclaration des états pour stocker les valeurs des champs du formulaire
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inscription en cours...");

    // Vérification de la correspondance des mots de passe
    if (password !== repeatPassword) {
      showErrorToast("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // Envoi des données d'inscription au serveur
      const response = await fetch("https://donovangrout-server.eddi.cloud/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "123456789", },
        body: JSON.stringify({ firstname, lastname, email, password, repeatPassword }),
      });

      const data = await response.json();
      console.log(data);

      // Gestion des erreurs si la réponse du serveur n'est pas ok
      if (!response.ok) {
        showErrorToast(data.error || "Une erreur est survenue.");
        return;
      }

      // Affichage d'un message de succès et redirection vers la page de connexion
      showSuccessToast("Inscription réussie !");
      navigate("/connexion");

    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  return (
    <div className={`w-screeen min-h-screen m-auto shadow-lg ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"} lg:pt-40 pt-40 `}>
      <h1 className="text-2xl font-bold text-center mb-6 md:text-3xl">Bienvenue</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full 2xl:w-auto mx-auto">
        {/* Champ de saisie du prénom */}
        <div className="flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md ">
          <label htmlFor="firstname" className="font-semibold mb-1 md:text-xl">Prénom</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="Entrez votre prénom"
            className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            onChange={(e) => setFirstname(e.target.value)}
            value={firstname}
            required
          />
        </div>

        {/* Champ de saisie du nom */}
        <div className="flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md ">
          <label htmlFor="lastname" className="font-semibold mb-1 md:text-xl">Nom</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Entrez votre nom"
            className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            onChange={(e) => setLastname(e.target.value)}
            value={lastname}
            required
          />
        </div>

        {/* Champ de saisie de l'email */}
        <div className="flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md ">
          <label htmlFor="email" className="font-semibold mb-1 md:text-xl">Adresse e-mail</label>
          <input
            type="email"
            id="mail"
            name="email"
            placeholder="Entrez votre adresse e-mail"
            className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        {/* Champ de saisie du mot de passe */}
        <div className="flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md ">
          <label htmlFor="password" className="font-semibold mb-1 md:text-xl">Mot de passe</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Choisissez un mot de passe"
            className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        {/* Champ de confirmation du mot de passe */}
        <div className="flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md  ">
          <label htmlFor="confirmation" className="font-semibold mb-1 md:text-xl ">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmation"
            name="confirmation"
            placeholder="Confirmez votre mot de passe"
            className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeatPassword}
            required
          />
        </div>

        {/* Bouton de soumission du formulaire */}
        <button
          type="submit"
          className={`sm:w-sm lg:w-lg md:w-md 2xl:w-2xl mx-auto flex justify-center items-center 2xl:text-2xl ${isDarkMode ? "bg-dark-secondary" : "bg-light-secondary"} mx-10  p-2  rounded-sm md:rounded-md lg:rounded-lg cursor-pointer hover:scale-110 mb-20`}
        >
                    Inscription
        </button>
      </form>
    </div>
  );
}