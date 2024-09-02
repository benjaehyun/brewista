import {useState, useEffect} from "react";
import { Routes, Route } from "react-router-dom";
import { getUser } from "../../utilities/users-service";
import AuthPage from "../AuthPage/AuthPage";
import NavBar from "../../components/NavBar/NavBar";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import HomePageUnauthenticated from "../HomePage/HomePageUnauthenticated";
import ScrollToTop from "../../utilities/scroll-to-top";
import RecipesIndexPage from "../RecipesIndexPage/RecipesIndexPage";
import RecipesDetailsPage from "../RecipesDetailsPage/RecipesDetailsPage";
import SavedRecipesIndex from "../SavedRecipesIndex/SavedRecipesIndex";
import LogInModal from "../../components/LogInModal/LogInModal";
import { useProtectedNavigation } from "./useProtectedNavigation";
import HomePageAuthenticated from "../HomePage/HomePageAuthenticated";
import ProfilePage from "../ProfilePage/ProfilePage";
import RecipeCreationPage from "../RecipeCreationPage/RecipeCreationPage";
import MyRecipesPage from "../MyRecipesPage/MyRecipesPage";
import CalculatePage from "../CalculatePage/CalculatePage";
import TimerPage from "../../TimerPage/TimerPage";

export default function App() {
  const [user, setUser] = useState(getUser());
  const { isLoginModalOpen, setLoginModalOpen, protectedNavigate } = useProtectedNavigation(!!user);

  useEffect(() => {
    if (!user) {
      setLoginModalOpen(false);
    }
  }, [user]);


  return (
    <main className="App text-center">
      <ScrollToTop />
      <NavBar user={user} setUser={setUser} protectedNavigate={protectedNavigate} />
      <div className="mt-16 md:mt-[4.75rem]">
        <LogInModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
        <Routes>
          <Route path="/" element={ user ? <HomePageAuthenticated /> : <HomePageUnauthenticated /> } />
          <Route path="/recipes" element={<RecipesIndexPage />} />
          <Route path="/recipes/:id" element={<RecipesDetailsPage />} />
          <Route path="/calculate/:id" element={<CalculatePage />} />
          <Route path="/timer" element={<TimerPage />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          {/* <Route path="/myrecipes" element={<ProtectedRoute><SavedRecipesIndex /></ProtectedRoute>} /> */}
          {user ? 
          <>
            <Route path="/myrecipes" element={<MyRecipesPage />} />
            <Route path="/savedrecipes" element={<SavedRecipesIndex />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/recipes/create" element={<RecipeCreationPage />} />
          </>
          :
          <Route path="/notfound" element={<NotFoundPage />} />
          }
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {/* <LogInModal isOpen={isLoginModalOpen} onClose={closeLoginModal} /> */}
    </main>
  );
}
