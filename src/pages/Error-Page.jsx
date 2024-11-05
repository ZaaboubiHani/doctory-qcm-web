import BgImg from "../assets/404-error.avif";


function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full font-bold text-center">
      <img
        className=""
        src={BgImg}
        alt=""
      />
      Page non trouvée
    </div>
  );
}

export default ErrorPage;
