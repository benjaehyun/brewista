import React from 'react';
import { Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "../../hooks/auth-context";
import NavBar from "../../components/NavBar/NavBar";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import HomePageUnauthenticated from "../HomePage/HomePageUnauthenticated";
import ScrollToTop from "../../services/scroll-to-top";
import RecipesIndexPage from "../RecipesIndexPage/RecipesIndexPage";
import RecipesDetailsPage from "../RecipesDetailsPage/RecipesDetailsPage";
import SavedRecipesIndex from "../SavedRecipesIndex/SavedRecipesIndex";
import HomePageAuthenticated from "../HomePage/HomePageAuthenticated";
import ProfilePage from "../ProfilePage/ProfilePage";
import RecipeCreationPage from "../RecipeCreationPage/RecipeCreationPage";
import MyRecipesPage from "../MyRecipesPage/MyRecipesPage";
import CalculatePage from "../CalculatePage/CalculatePage";
import TimerPage from "../TimerPage/TimerPage";
import RecipesEditPage from "../RecipesEditPage/RecipesEditPage";
import ProtectedRoute from "./ProtectedRoute";
import { AuthModalProvider, useAuthModal } from '../../hooks/auth-modal-context';
import LoginModal from "../../components/LoginModal/LoginModal";

function AppContent() {
  const { user } = useAuth();
  const { isLoginModalOpen, closeLoginModal} = useAuthModal()

  return (
    <main className="App text-center">
      <ScrollToTop />
      <NavBar />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <div className="mt-16 md:mt-[4.75rem]">
        <Routes>
          <Route path="/" element={user ? <HomePageAuthenticated /> : <HomePageUnauthenticated />} />
          <Route path="/recipes" element={<RecipesIndexPage />} />
          <Route path="/recipes/:id" element={<RecipesDetailsPage />} />
          <Route 
            path="/recipes/edit/:id" 
            element={
              <ProtectedRoute >
                <RecipesEditPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/calculate/:id" element={<CalculatePage />} />
          <Route path="/timer/:id" element={<TimerPage />} />
          <Route 
            path="/myrecipes" 
            element={
              <ProtectedRoute>
                <MyRecipesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/savedrecipes" 
            element={
              <ProtectedRoute>
                <SavedRecipesIndex />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recipes/create" 
            element={
              <ProtectedRoute>
                <RecipeCreationPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthModalProvider>
        <AppContent />
      </AuthModalProvider>
    </AuthProvider>
  );
}