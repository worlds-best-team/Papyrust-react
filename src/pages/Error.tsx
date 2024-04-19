import { useLocation } from "react-router-dom";

function ErrorPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

  return (
    <div className="fixed top-0 left-0 h-full w-full">An error was encountered: {searchParams.get("e")}</div>
  )
}

export default ErrorPage