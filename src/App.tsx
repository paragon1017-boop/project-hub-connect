import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import BottomNav from "@/components/BottomNav";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Workouts from "./pages/Workouts";
import Scan from "./pages/Scan";
import FoodSearch from "./pages/FoodSearch";
import PhotoLog from "./pages/PhotoLog";
import Journal from "./pages/Journal";
import Exercises from "./pages/Exercises";
import Favorites from "./pages/Favorites";
import Cardio from "./pages/Cardio";
import SettingsPage from "./pages/SettingsPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AI from "./pages/AI";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/search" element={<FoodSearch />} />
        <Route path="/cardio" element={<Cardio />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/photos" element={<PhotoLog />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={<ProtectedRoutes />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
