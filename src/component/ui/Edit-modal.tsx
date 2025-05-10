/* eslint-disable no-console */
import { useState } from "react";
import { Itrees } from "../../../type/type";
import { showErrorToast, showSuccessToast } from "../../../utils/toast";

export default function EditModal({
  setIsOpenedEditModal,
  isOpenedEditModal,
  article,
  setArticles,
  setSelectedArticle,
  isDarkMode,
  articles,
}: {
  isOpenedEditModal: boolean;
  setIsOpenedEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  article: Itrees;
  setArticles: React.Dispatch<React.SetStateAction<Itrees[]>>;
  setSelectedArticle: React.Dispatch<React.SetStateAction<Itrees | null>>;
  isDarkMode: boolean;
  articles: Itrees[];
}) {
  // Définition du type pour le formulaire
  interface FormDataState {
    category: string;
    name: string;
    image: File | string;
    price: number | string;
    description: string;
    available: boolean;
    picture_id?: number;
  }

  // Initialisation de l'état du formulaire à partir des données de l'article
  const [formData, setFormData] = useState<FormDataState>({
    category: article.categories?.[0]?.name || "Conifères",
    name: article.name,
    image: article.Picture?.url || "",
    price: article.price,
    description: article.description,
    available: true,
  });

  // Gestionnaire de changement pour tous les inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64String = result.split(",")[1];
          setFormData((prev) => ({
            ...prev,
            image: base64String,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  // Gestionnaire de soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Empêche le comportement par défaut du formulaire (rechargement de la page)
    e.preventDefault();

    // Détermine la valeur à envoyer pour l'image :
    // Si 'formData.image' est une chaîne qui commence par "http", cela signifie
    // que c'est l'URL existante (l'image n'a pas été modifiée)
    // Sinon, c'est une nouvelle image convertie en base64 par FileReader
    const pictureUrl =
      typeof formData.image === "string" && formData.image.startsWith("https")
        ? formData.image
        : formData.image;

    // Construction du payload à envoyer à l'API
    // Notez que pour la clé 'categoryName', on envoie un tableau contenant la catégorie,
    // car c'est la structure attendue par le back-end (comme dans le CreateModal)
    const payload = {
      categoryName: [formData.category],
      name: formData.name,
      description: formData.description,
      price: Number(formData.price), // Conversion en nombre pour être sûr
      available: formData.available,
      // On n'inclut 'pictureUrl' que s'il existe une valeur non vide
      ...(pictureUrl ? { pictureUrl } : {}),
    };

    console.log("Payload à envoyer :", payload);

    try {
      // Récupération du token d'authentification depuis le localStorage
      const token = localStorage.getItem("token");
      // Construction des headers pour la requête
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "x-api-key": "123456789",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // Envoi de la requête PATCH à l'API pour mettre à jour l'article
      const res = await fetch(`https://greenrootsapi.zapto.org/api/articles/${article.id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
      // Affichage de la réponse dans la console pour le débogage
      console.log("Réponse de l'API :", payload, res);

      // Lecture de la réponse sous forme de texte
      const text = await res.text();
      // Si la réponse n'est pas vide, on la parse en JSON
      const data = text ? JSON.parse(text) : {};

      // Si la réponse n'est pas "ok", on lève une erreur avec le message renvoyé par le serveur
      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour de l'article.");
      }

      // Affiche une notification de succès
      showSuccessToast("Article mis à jour avec succès.");

      // Met à jour la liste des articles dans l'état parent en remplaçant l'article modifié
      setArticles((prevArticles) =>
        prevArticles.map((art) => (art.id === article.id ? data.article : art))
      );
      // Met à jour l'article sélectionné avec les nouvelles données
      setSelectedArticle(data.article);
      // Ferme la modale de modification
      setIsOpenedEditModal(false);
    } catch (error: unknown) {
      console.error("Erreur lors de la mise à jour :", error);
      // Affiche une notification d'erreur en cas de problème
      if (error instanceof Error) {
        showErrorToast(error.message || "Une erreur est survenue");
      } else {
        showErrorToast("Une erreur est survenue");
      }
    }
  };




  return (
    <>
      {/* Overlay pour fermer la modale */}
      {isOpenedEditModal && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpenedEditModal(false)}
        />
      )}

      {/* Modale */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? "bg-dark-secondary text-white" : "bg-light-secondary text-black"
          } w-80 p-4 rounded-lg shadow-lg flex flex-col gap-4 z-20 mt-11 md:w-96`} style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        {/* Bouton de fermeture */}
        <img
          onClick={() => setIsOpenedEditModal(false)}
          src="/icons/close.svg"
          alt="Fermer la modale"
          className={`w-6 h-6 ${isDarkMode && "invert"} absolute top-4 right-4 cursor-pointer`}
        />

        {/* Titre */}
        <h2 className="text-xl font-bold text-center">Modifier : {article.name}</h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Catégorie */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Catégorie</label>
            <select
              value={formData.category}
              name="category"
              onChange={handleChange}
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta"
            >
              <option value="">Choisir une catégorie</option>
              {articles
                .flatMap((art) => art.categories.map((cat) => cat.name))
                .filter((value, index, self) => self.indexOf(value) === index)
                .map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          {/* Nom */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Nom de l'article</label>
            <input
              type="text"
              placeholder="Ex: Chêne pédonculé"
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta"
              name="name"
              value={formData.name}
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

          {/* Prix */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Prix (€)</label>
            <input
              type="number"
              placeholder="Ex: 110"
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Description</label>
            <textarea
              placeholder="Ajoutez une brève description..."
              className="border p-3 rounded-lg bg-dark-primary text-white focus:outline-none focus:ring-2 focus:ring-cta resize-none"
              name="description"
              value={formData.description}
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
              onClick={() => setIsOpenedEditModal(false)}
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
