import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import ErrorPage from './pages/Error';
import { UserContextProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home/*" element={<HomePage />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default App;
