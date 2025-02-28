// fonction pour gérer le thème de l'app
export default function DarkModeToggle({
  isDarkMode,
  setIsDarkMode,
}: {
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode); // Mise à jour du state
  };

  return (
    <>
      {/* boutton pour choisir le thème de l'app*/}
      <button onClick={toggleDarkMode}>
        {isDarkMode ? (
          <img className={`size-6 ${isDarkMode && "invert"} md:w-6 md:h-8 lg:w-8 lg:h-8 cursor-pointer `} src="/icons/sun.svg" alt="Mode clair" />
        ) : (
          <img className={`size-6 ${isDarkMode && "invert"} md:w-6 md:h-8 lg:w-8 lg:h-8 cursor-pointer `} src="/icons/moon.svg" alt="Mode sombre" />
        )}
      </button>
    </>
  );
}
