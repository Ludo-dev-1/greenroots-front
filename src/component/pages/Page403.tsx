import { Link } from "react-router";
import bgImage from "/src/assets/images/403.webp";

export default function Page403() {
  return (
    <div className=" min-h-full w-full max-w-screen overflow-hidden ">
      <main className="text-white flex flex-col gap-6 text-center ">

        <div className="w-screen h-screen bg-cover bg-center  lg:bg-[position] lg:bg-[20%_25%] sm:bg-center" style={{ backgroundImage: `url(${bgImage})` }}>*
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center flex-col gap-4 p-4">

            <h1 className="text-white text-8xl font-bold font-title" > 403 </h1>
            <p className="text-white text-4xl font-bold font-content">Acces non autorisé</p>
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-light-secondary p-4 text-center rounded-lg">
            <Link to="/" className="font-title">Retour à l'accueil</Link>
          </div>
        </div>

      </main >
    </div >
  );
}