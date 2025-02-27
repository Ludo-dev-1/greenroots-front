import { useEffect, useState } from "react";
import fetchmethod from "../../fetch/method-fetch";
import { IUserInfos } from "../../../type/type";
import DeleteAccountModal from "../ui/DeleteAccountModal";
import { useAuthStore } from "../../Auth/authStore";
import { useNavigate } from "react-router";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function UserSpace({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  if (!token) {
    navigate("/interdit");
  }

  const [isOpenedDeleteAccountModal, setIsOpenedDeleteAccountModal] = useState<boolean>(false);

  const [formData, setFormData] = useState<IUserInfos>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    // eslint-disable-next-line camelcase
    repeat_password: ""
  });

  useEffect(() => {
    // Récupération des informations utilisateur
    fetchmethod.getUserInfos().then((data: IUserInfos) => {
      setFormData({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        email: data.email || "",
        password: "",
        // eslint-disable-next-line camelcase
        repeat_password: ""
      });
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation des champs obligatoires
    if (!formData.firstname.trim() || !formData.lastname.trim() || !formData.email.trim()) {
      showErrorToast("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Vérifie les mots de passe
    if (formData.password) {
      if (!formData.repeat_password) {
        showErrorToast("Veuillez confirmer votre mot de passe.");
        return;
      }

      if (formData.password !== formData.repeat_password) {
        showErrorToast("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    // Prépare le payload (filtre les champs vides)
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value && value.trim() !== "")
    );

    try {
      const response = await fetch("https://donovangrout-server.eddi.cloud/compte", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "x-api-key": "123456789",
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API :", errorData);
        showErrorToast("Erreur lors de la mise à jour. Veuillez réessayer.");
        return;
      }

      const updatedUser = await response.json();
      showSuccessToast("Vos informations ont été mises à jour avec succès.");

      // Réinitialiser les champs après mise à jour réussie
      setFormData({
        firstname: updatedUser.firstname || "",
        lastname: updatedUser.lastname || "",
        email: updatedUser.email || "",
        password: "",
        // eslint-disable-next-line camelcase
        repeat_password: ""
      });

    } catch (error) {
      console.error("Erreur réseau :", error);
      showErrorToast("Erreur réseau. Veuillez réessayer.");
    }
  };

  return (
    <div className={`min-h-screen mx-auto p-6 shadow-lg  w-full ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"} pt-20 lg:pt-40`}>
      <div>
        <h1 className="text-2xl font-bold text-center mb-6">Espace personnel</h1>

        <div className="flex flex-row justify-between items-center md:justify-center md:gap-40">
          <p className="text-lg font-semibold">Mes informations</p>
          <button
            onClick={() => setIsOpenedDeleteAccountModal(true)}
            className={`${isDarkMode ? "bg-dark-accent text-red-400" : "bg-red-600 text-black"} text-sm flex items-center gap-2 rounded-lg border p-1  cursor-pointer transition hover:scale-105`}
          >
                        Supprimer mon compte
          </button>
        </div>

        {
          isOpenedDeleteAccountModal && <DeleteAccountModal
            isOpenedDeleteAccountModal={isOpenedDeleteAccountModal}
            isDarkMode={isDarkMode}
            setIsOpenedDeleteAccountModal={setIsOpenedDeleteAccountModal}
            user={formData}
            setUser={setFormData}
          />
        }

        {/* Formulaire utilisateur */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 w-full max-w-md mx-auto">
          {/* Prénom */}
          <div className="flex flex-col">
            <label htmlFor="firstname" className="font-semibold mb-1">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Entrez votre prénom"
              onChange={handleChange}
              value={formData.firstname}
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
              required
            />
          </div>

          {/* Nom */}
          <div className="flex flex-col">
            <label htmlFor="lastname" className="font-semibold mb-1">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              placeholder="Entrez votre nom"
              onChange={handleChange}
              value={formData.lastname}
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Entrez votre adresse e-mail"
              onChange={handleChange}
              value={formData.email}
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
              required
            />
          </div>

          {/* Mot de passe actuel */}
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold mb-1">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Votre mot de passe actuel"
              onChange={handleChange}
              value={formData.password}
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            />
          </div>

          {/* Confirmer mot de passe */}
          <div className="flex flex-col">
            <label htmlFor="repeatPassword" className="font-semibold mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              placeholder="Confirmez votre mot de passe"
              onChange={handleChange}
              value={formData.repeat_password}
              className={`border p-3 rounded-lg w-full ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} focus:outline-none focus:ring-2 focus:ring-cta`}
            />
          </div>

          <button
            type="submit"
            className={`${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"} py-3 px-6 mt-6 rounded-lg  font-semibold transition hover:scale-105`}
          >
                        Sauvegarder les modifications
          </button>
        </form>
      </div>
    </div>
  );
}
