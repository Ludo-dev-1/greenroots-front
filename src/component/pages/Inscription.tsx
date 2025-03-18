/* eslint-disable camelcase */
import { useState } from "react";
import { useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";
import { Eye, EyeOff } from "lucide-react";

export default function Inscription({ isDarkMode }: { isDarkMode: boolean }) {

  // state pour afficher le mot de passe en clair ou non
  const [showPassword, setShowPassword] = useState(false);

  // Déclaration des états pour stocker les valeurs des champs du formulaire
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat_password, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Inscription en cours...");

    // Vérification de la correspondance des mots de passe
    if (password !== repeat_password) {
      showErrorToast("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // Envoi des données d'inscription au serveur
      const response = await fetch("https://greenrootsapi.zapto.org/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "123456789", },

        body: JSON.stringify({ firstname, lastname, email, password, repeat_password }),
      });
      console.log(password,repeat_password);


      const data = await response.json();


      console.log(data);

      // Gestion des erreurs si la réponse du serveur n'est pas ok
      if (!response.ok) {
        showErrorToast(data.details || "Une erreur est survenue.");
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
        <div className="relative flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md ">
          <label htmlFor="password" className="font-semibold mb-1 md:text-xl">
        Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Affichage du mot de passe en clair ou non
              id="password"
              name="password"
              placeholder="Choisissez un mot de passe"
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}

              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            {/* Bouton pour afficher/masquer le mot de passe */}
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <span className="italic mx-10  md:flex md:flex-col md:mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md ">
          <p >
          Le mot de passe doit contenir au moins 14 caractères et au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial parmi : !, @, #, $, %, ^, &, *. Oui on ne lesine pas avec la sécurité chez GreenRoots !
          </p>
        </span>


        {/* Champ de confirmation du mot de passe */}
        <div className=" relative flex flex-col mx-auto 2xl:w-2xl 2xl:text-2xl sm:w-sm lg:w-lg md:w-md  ">
          <label htmlFor="confirmation" className="font-semibold mb-1 md:text-xl ">Confirmer le mot de passe</label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmation"
            name="confirmation"
            placeholder="Confirmez votre mot de passe"
            className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeat_password}
            required
          />
          <button
            type="button"
            className="absolute inset-y-13 right-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
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