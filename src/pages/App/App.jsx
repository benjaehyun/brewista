import {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import './App.css';
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import HomePage from "../HomePage/HomePage";
import ScrollToTop from "../../utilities/scroll-to-top";
import RecipesIndexPage from "../RecipesIndexPage/RecipesIndexPage";
import RecipesDetailsPage from "../RecipesDetailsPage/RecipesDetailsPage";
import SavedRecipesIndex from "../SavedRecipesIndex/SavedRecipesIndex";
import LogInModal from "../../components/LogInModal/LogInModal";
import { useProtectedNavigation } from "./useProtectedNavigation";

export default function App() {
  const [user, setUser] = useState(getUser());
  const { isLoginModalOpen, setLoginModalOpen, protectedNavigate } = useProtectedNavigation(!!user);

  useEffect(() => {
    if (!user) {
      setLoginModalOpen(false);
    }
  }, [user]);


  return (
    <main className="App">
      <ScrollToTop />
      <NavBar user={user} setUser={setUser} protectedNavigate={protectedNavigate} />
      {/* <LogInModal isOpen={isLoginModalOpen} onClose={closeLoginModal} /> */}
      <LogInModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesIndexPage />} />
        <Route path="/recipes:id" element={<RecipesDetailsPage />} />
        <Route path="/myrecipes" element={<SavedRecipesIndex />} />
        {/* <Route path="/myrecipes" element={<ProtectedRoute><SavedRecipesIndex /></ProtectedRoute>} /> */}
        <Route path="/auth" element={<AuthPage setUser={setUser} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </main>
  );
}
