
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import StudentDashboard from "./pages/StudentDashboard";
import CounsellorDashboard from "./pages/CounsellorDashboard";
import StudentProfile from "./pages/StudentProfile";
import CounsellorProfile from "./pages/CounsellorProfile";
import SelfAssessmentPage from "./pages/SelfAssessmentPage";
import VideoCall from "./pages/VideoCall";
import NotFound from "./pages/NotFound";
import Navigation from "@/components/Navigation";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    // Redirect authenticated users to their dashboard
    const userType = user.user_metadata?.user_type || 'student';
    return <Navigate to={userType === 'student' ? '/student-dashboard' : '/counsellor-dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// Layout component for authenticated pages
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            
            {/* Protected routes - all require authentication */}
            <Route path="/" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Home />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <About />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/contact" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Contact />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/resources" element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Resources />
                </AuthenticatedLayout>
              </ProtectedRoute>
            } />
            <Route path="/assessment" element={
              <ProtectedRoute>
                <SelfAssessmentPage />
              </ProtectedRoute>
            } />
            <Route path="/student-dashboard" element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/counsellor-dashboard" element={
              <ProtectedRoute>
                <CounsellorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student-profile" element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/counsellor-profile" element={
              <ProtectedRoute>
                <CounsellorProfile />
              </ProtectedRoute>
            } />
            <Route path="/video-call" element={
              <ProtectedRoute>
                <VideoCall />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
