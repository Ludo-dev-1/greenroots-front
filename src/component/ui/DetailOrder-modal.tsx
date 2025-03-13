import { useNavigate } from "react-router";
import { Iorder, IOrderDetail } from "../../../type/type";
import { useAuthStore } from "../../Auth/authStore";
import { useEffect, useState } from "react";
import fetchmethod from "../../fetch/method-fetch";

interface DetailModalOrderProps {
    setIsOpenOrderDetail: React.Dispatch<React.SetStateAction<boolean>>;
    isOpenedOrderModal: boolean;
    isDarkMode: boolean;
    orders?: Iorder;
}

export default function DetailOrderModal({
  setIsOpenOrderDetail,
  isOpenedOrderModal,
  isDarkMode,
  orders,
}: DetailModalOrderProps) {

  console.log("Orders reçue :", orders);

  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();
  const [orderDetail, setOrderDetail] = useState<IOrderDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!orders || !orders.id) return; // Si pas de commande ou pas d'id, on sort de la fonction
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const data: IOrderDetail = isAdmin
          ? (await fetchmethod.getOrderDetailAdmin(orders.id)) as unknown as IOrderDetail
          : (await fetchmethod.getOrderDetailUser(orders.id)) as unknown as IOrderDetail ;

        setOrderDetail(data);
        console.log(data);

      } catch (error) {
        console.error("Erreur lors de la récupération des détails :", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpenedOrderModal) {
      fetchOrderDetails();
    }
  }, [orders && orders.id, isAdmin, isOpenedOrderModal]);


  if (!orders || !orderDetail) {
    return (
      <div className="text-center">
        <p>Aucune commande disponible.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center">
        <p>Chargement des détails de la commande...</p>
      </div>
    );
  }


  return (
    <>
      {isOpenedOrderModal && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsOpenOrderDetail(false)}
        />
      )}

      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDarkMode ? "bg-dark-secondary" : "bg-light-accent"
        } w-5/6 p-6 rounded-lg shadow-lg text-white flex flex-col gap-4 z-20 mt-8 2xl:w-2xl 2xl:text-2xl md:w-md lg:w-lg`}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic sur le modal
      >
        <img
          onClick={() => setIsOpenOrderDetail(false)}
          src="/icons/close.svg"
          alt="Fermer la modale"
          className={`w-6 h-6 ${isDarkMode && "invert"
          } absolute top-4 right-4 cursor-pointer`}
        />

        {/* Infos générales */}
        <h1
          className={`text-2xl font-bold text-center ${isDarkMode ? "text-white" : "text-black"
          }`}
        >
                    Commande #{orders.id}
        </h1>
        <h2
          className={`text-xl font-semibold text-center ${isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {orders.article_summary}
        </h2>

        <div
          className={`flex flex-col gap-2 ${isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <p>
            <strong>Date d'achat :</strong>{" "}
            {new Date(orders.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Prix total :</strong> {orderDetail.total_price} €
          </p>
        </div>

        {/* Infos utilisateur */}
        {isAdmin && (
          <div
            className={`mt-4 p-4 rounded ${isDarkMode ? "bg-dark-primary text-white" : "bg-light-primary text-black"
            }`}
          >
            <h3 className="font-semibold mb-2">Client :</h3>
            <p>
              {orderDetail.User.firstname} {orderDetail.User.lastname}
            </p>
            <p>{orderDetail.User.email}</p>
          </div>
        )}

        {/* Liste des articles */}
        <div className={`mt-4 mb-4 ${!isDarkMode && "text-black"}`}>
          <h3 className=" font-semibold mb-2">Articles commandés :</h3>
          {orderDetail?.articles?.length > 0 ? (
            orderDetail.articles.map((article) => (
              <div
                key={article.id}
                className={`p-3 mb-2 rounded ${isDarkMode ? "bg-dark-accent" : "bg-light-secondary"
                }`}
              >
                <p className="font-bold">{article.name}</p>
                <p>{article.description}</p>
                <p>
                  <strong>Prix :</strong> {article.price} €
                </p>
                <p>
                  <strong>Quantité :</strong> {article.ArticleHasOrder.quantity}
                </p>
              </div>
            ))
          ) : (
            <p>Aucun article trouvé.</p>
          )}
        </div>

        {/* Bouton de navigation */}
        <div className="flex justify-center mt-4">
          <button
            className={`px-4 py-2 rounded-lg bg-dark-primary cursor-pointer hover:scale-105 text-lg ${!isDarkMode && "bg-light-primary text-black"
            }`}
            onClick={() => navigate("/suivis")}
          >
                        Suivi de(s) arbre(s)
          </button>
        </div>
      </div>
    </>
  );
}
