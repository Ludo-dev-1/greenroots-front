import { Itrees, Iorder, IUserInfos, ITracking } from "../../type/type";


const fetchmethod = {

  // Fecth des articles de l'utilisateur
  getArticlesByAdmin: async (): Promise<Itrees[]> => {
    try {
      const token = localStorage.getItem("token"); // Récupération du token
      const response = await fetch("https://donovangrout-server.eddi.cloud/api/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 Ajout du token JWT

          "x-api-key": "123456789",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API : ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      console.log("Données reçues :", data);

      if (data.articles) {
        const mergedArticles = data.articles.map((article: Itrees) => ({
          ...article,
          Picture: {
            ...article.Picture,
            url: article.Picture?.url.replace("https://localhost:3000/", "https://donovangrout-server.eddi.cloud/")
          },
          categories: article.categories || { name: "Catégorie par défaut" },
        }));
        return mergedArticles;
      } else {
        console.error("Format inattendu de l'API", data);
        return [];
      }

    } catch (error) {
      console.error("Erreur lors du fetch des articles:", error);
      return [];
    }
  },

  // Fetch des derniers articles (arbres, accueil )
  getNewArticle: async (): Promise<Itrees[]> => {
    try {
      const response = await fetch("https://donovangrout-server.eddi.cloud/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456789"
        },
      });
      const data = await response.json();

      console.log("Données reçues :", data);

      if (data.articles) {
        const mergedArticles = data.articles.map((article: Itrees) => ({
          ...article,
          Picture: {
            ...article.Picture,
            url: article.Picture?.url.replace("https://localhost:3000/", "https://donovangrout-server.eddi.cloud/")
          },
          categories: article.categories || { name: "Catégorie par défaut" },
        }));
        return mergedArticles;
      } else {
        console.error("Format inattendu de l'API", data);
        return [];
      }

    } catch (error) {
      console.error("Erreur lors du fetch des articles:", error);
      return [];
    }
  },

  // Fetch de tous les articles (arbres, boutique)
  getArticle: async (): Promise<Itrees[]> => {
    try {
      const response = await fetch("https://donovangrout-server.eddi.cloud/boutique", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456789",
        },
      });
      const data = await response.json();
      console.log("Données reçues :", data);

      if (data.articles) {
        const mergedArticles = data.articles.map((article: Itrees) => ({
          ...article,
          Picture: {
            ...article.Picture,
            url: article.Picture?.url.replace("https://localhost:3000/", "https://donovangrout-server.eddi.cloud/")
          },
          categories: article.categories || { name: "Catégorie par défaut" },
        }));
        return mergedArticles;
      } else {
        console.error("Format inattendu de l'API", data);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors du fetch des articles:", error);
      return [];
    }
  },

  // Fetch commandes utilisateur
  getHistoryByUser: async (): Promise<Iorder[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://donovangrout-server.eddi.cloud/compte/commandes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": "123456789",
        },
      });
      const data = await response.json();
      console.log("Données reçues :", data);

      // Si data est un tableau, on le retourne directement,
      // sinon on tente de retourner data.orders ou un tableau vide
      return data;
    } catch (error) {
      console.error("Erreur lors du fetch des commandes :", error);
      return [];
    }
  },

  // Fetch infos utilisateur
  getUserInfos: async (): Promise<IUserInfos> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://donovangrout-server.eddi.cloud/compte", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": "123456789",
        },
      });
      const data = await response.json();
      console.log("Données reçues :", data);
      return data;
    } catch (error) {
      console.error("Erreur lors du fetch des infos utilisateur :", error);
      // Retourne un objet par défaut respectant IUserInfos
      return {
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        // eslint-disable-next-line camelcase
        repeat_password: "",
      };
    }
  },
  // Fetch de toutes les commandes (admin)
  getAllOrders: async (): Promise<Iorder[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://donovangrout-server.eddi.cloud/api/commandes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-api-key": "123456789",
        },
      });
      const data = await response.json();
      console.log("Données reçues :", data);

      // Si data est un tableau, on le retourne directement,
      // sinon on tente de retourner data.orders ou un tableau vide
      return data;
    } catch (error) {
      console.error("Erreur lors du fetch des commandes :", error);
      return [];
    }
  },

  // Fetch du detail de la commande d'un utilisateur
  getOrderDetailAdmin: async (id: number): Promise<ITracking[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://donovangrout-server.eddi.cloud/api/commandes/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "123456789",
          },
        });
      const data = await response.json();
      console.log("Données reçues :", data);
      return data;
    }
    catch (error) {
      console.error("Erreur lors du fetch des commandes :", error);
      return [];
    }
  },

  // Fetch du suivi d'un artcile d'une commande (admin)
  getTrackingByIdAdmin: async (orderId: number, trackinId: number): Promise<ITracking[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://donovangrout-server.eddi.cloud/api/commandes/${orderId}/suivi/${trackinId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "123456789",
          },
        });
      const data = await response.json();
      console.log("Données reçues :", data);
      return data;
    }
    catch (error) {
      console.error("Erreur lors du fetch du tracking :", error);
      return [];
    }
  },


  // Fetch du suivi d'un artcile d'une commande (utilisateur)
  getTrackingByIdUser: async (orderId: number, trackinId: number): Promise<ITracking[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://donovangrout-server.eddi.cloud/compte/commandes/${orderId}/suivi/${trackinId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "123456789",
          },
        });
      const data = await response.json();
      console.log("Données reçues :", data);
      return data;
    }
    catch (error) {
      console.error("Erreur lors du fetch du tracking :", error);
      return [];
    }
  },

  // Fetch du détail d'une commande d'un utilisateur
  getOrderDetailUser: async (id: number): Promise<ITracking[]> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://donovangrout-server.eddi.cloud/compte/commandes/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-api-key": "123456789",
          },
        });
      const data = await response.json();
      console.log("Données reçues :", data);
      return data;
    }
    catch (error) {
      console.error("Erreur lors du fetch des commandes :", error);
      return [];
    }
  },


};

export default fetchmethod;
