import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/error' element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
