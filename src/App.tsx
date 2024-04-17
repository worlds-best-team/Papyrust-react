import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import LoginSuccessful from "./pages/LoginSuccessful";
import HomePage from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/login-successful' element={<LoginSuccessful />} />
        <Route path='/home' element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
