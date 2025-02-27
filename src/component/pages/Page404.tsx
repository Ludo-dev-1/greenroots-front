import bgImage from "../../assets/images/404.webp";
import { Link } from "react-router";

export default function Page404() {
  return (
    <div className="w-full max-w-screen overflow-hidden">
      <main className="text-white flex flex-col gap-6 text-center ">

        <div className="w-screen h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>*
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col gap-4 p-4">

            <h1 className="text-white text-8xl font-bold font-title" > 404 </h1>
            <p className="text-white text-4xl font-bold font-content"> Oups, vous vous êtes perdu(e) </p>
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 p-4 text-center rounded-lg cursor-pointer bg-light-secondary ">
            <Link to="/" className="font-title ">Retour à l'accueil</Link>
          </div>
        </div>

      </main >
    </div >
  );
}