import { lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import AdminLayout from "./layout/AdminLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GamificationProvider } from "./context/GamificationContext";
import { SoundProvider } from "./context/SoundContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NavChromeProvider } from "./context/NavChromeContext";
import { ToastProvider } from "./context/ToastContext";
import NotificationModal from "./Components/ui/NotificationModal";
import ToastStack from "./Components/ui/ToastStack";
import CelebrationOverlay from "./Components/CelebrationOverlay";
import EditProfileView from "./Components/EditProfileView";

// Lazy-load pages so each route ships as its own chunk. While a chunk loads,
// RootLayout's Suspense boundary shows a PageSkeleton.
const Home = lazy(() => import("./pages/Home"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const SignUp = lazy(() => import("./Authentication/SignUp"));
const Login = lazy(() => import("./Authentication/Login"));
const Dashboard = lazy(() => import("./Components/Dashboard"));
const Doc = lazy(() => import("./pages/Doc"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Admin = lazy(() => import("./pages/Admin"));

// Declare router outside App function so it remains stable across component re-renders
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ── Student / Public shell ── */}
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="course/:id" element={<CourseDetails />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="contact" element={<Contact />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="doc" element={<Doc />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="thank-you" element={<ThankYou />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ── Isolated Admin shell (no student Navbar/Footer) ── */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
      </Route>
    </>
  )
);

// First-time users must finish profile setup before using the app. Instead of a
// blocking modal, they get the full dedicated Edit Profile view in "required"
// mode (no Back/Cancel) — the same view used for editing later, so the
// experience is consistent. Admins skip this entirely.
const AppRoot = () => {
  const { currentUser, needsProfileSetup, isAdmin } = useAuth();
  if (currentUser && !isAdmin && needsProfileSetup) {
    return <EditProfileView required />;
  }
  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <GamificationProvider>
          <SoundProvider>
            <LanguageProvider>
              <NavChromeProvider>
                <AppRoot />
                <CelebrationOverlay />
                <ToastStack />
                <NotificationModal />
              </NavChromeProvider>
            </LanguageProvider>
          </SoundProvider>
        </GamificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
