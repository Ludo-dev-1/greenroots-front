import { create } from "zustand"; // Importation de Zustand pour gérer l'état global.
import { jwtDecode } from "jwt-decode"; // Importation de jwtDecode pour décoder le token JWT.

// Définition de l'interface pour le token décodé
interface DecodedToken {
    role_id: number; // Identifiant du rôle de l'utilisateur (ex: 1 = Admin, 2 = Membre, etc.)
    id: number; // Identifiant unique de l'utilisateur
}

// Définition de l'interface représentant l'état du store d'authentification
interface IAuthState {
    token: string | null; // Stocke le token JWT de l'utilisateur
    isAdmin: boolean; // Indique si l'utilisateur est administrateur
    isMember: boolean; // Indique si l'utilisateur est un membre
    userId: number | null; // Stocke l'identifiant de l'utilisateur
    login: (token: string) => void; // Fonction pour connecter l'utilisateur avec un token JWT
    logout: () => void; // Fonction pour déconnecter l'utilisateur et supprimer son token
}

// Création du store d'authentification avec Zustand
export const useAuthStore = create<IAuthState>((set) => ({
  // Initialisation des valeurs du store à partir du localStorage
  token: localStorage.getItem("token"), // Récupération du token JWT stocké
  isAdmin: localStorage.getItem("isAdmin") === "true", // Vérification du rôle admin dans le stockage local
  isMember: localStorage.getItem("isMember") === "true", // Vérification du rôle membre
  userId: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : null, // Conversion de l'ID utilisateur en nombre si existant

  // Fonction de connexion : elle stocke le token et met à jour l'état utilisateur
  login: (token: string) => {
    localStorage.setItem("token", token); // Stocke le token dans le localStorage

    const decodedToken: DecodedToken = jwtDecode(token); // Décodage du token JWT
    const isAdmin = decodedToken.role_id === 1; // Vérifie si l'utilisateur est admin
    const isMember = decodedToken.role_id === 2; // Vérifie si l'utilisateur est membre
    const userId = decodedToken.id; // Récupère l'ID de l'utilisateur

    // Stocke les rôles et l'ID utilisateur dans le localStorage
    localStorage.setItem("isAdmin", String(isAdmin));
    localStorage.setItem("isMember", String(isMember));
    localStorage.setItem("userId", String(userId));

    // Met à jour l'état du store avec les nouvelles valeurs
    set({ token, isAdmin, isMember, userId });
  },

  // Fonction de déconnexion : supprime toutes les informations d'authentification
  logout: () => {
    localStorage.removeItem("token"); // Supprime le token JWT du localStorage
    localStorage.removeItem("isAdmin"); // Supprime le statut admin
    localStorage.removeItem("isMember"); // Supprime le statut membre
    localStorage.removeItem("userId"); // Supprime l'ID utilisateur

    // Réinitialise l'état du store
    set({ token: null, isAdmin: false, isMember: false, userId: null });
  },
}));
