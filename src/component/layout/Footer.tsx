import { useNavigate } from "react-router";

export default function Footer({ isDarkMode }: { isDarkMode: boolean }) {
  const navigate = useNavigate();

  return (
    <footer className={`${isDarkMode ? "bg-dark-accent" : "bg-dark-third "} relative bottom-0 w-full flex justify-between items-center  h-9 max-sm:justify-center max-md:justify-center max-lg:justify-center md:py-8 md:text-2xl`}>
      <div className={`hidden lg:flex w-4 ml-4 gap-4 items-center md:w-6 ${isDarkMode && "invert"} cursor-pointer`}>
        <img src="/icons/facebook.svg" alt="logo de facebook" />
        <img src="/icons/instagram.svg" alt=" logo d'instagram" className="mr-0.5" />
        <img src="/icons/linkedin.svg" alt="logo de linkedin" />
      </div>
      <div className={` ${isDarkMode ? "text-white" : "text-black"} `}>

        <p className="font-content flex cursor-pointer"
          onClick={() => navigate('/')}> GreenRoots
          <img src="/icons/copyright.svg" alt="Logo copiryghgt" className={`w-5 h-5 ${isDarkMode && "invert"}`} />
        </p>
      </div>


      <p className={`hidden lg:block mr-4 cursor-pointer hover  ${isDarkMode ? "text-white" : "text-black"}`}
        onClick={() => navigate('/Cgu')}>CGU</p>


    </footer>

  );
}