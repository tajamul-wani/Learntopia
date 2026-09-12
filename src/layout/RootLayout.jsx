import { useEffect, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import BottomNav from "../Components/BottomNav";
import Footer from "../Components/Footer";
import PageSkeleton from "../Components/ui/PageSkeleton";
import ChunkErrorBoundary from "../Components/ChunkErrorBoundary";
import StreakModal from "../Components/StreakModal";

// React Router keeps the previous scroll position on navigation, which lands
// the user mid-page. Reset to the top whenever the route changes.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // "instant" overrides the CSS `scroll-behavior: smooth` so navigation snaps
    // to the top rather than animating.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
      <ScrollToTop />
      {/* Ambient drifting clay orbs — subtle animated depth behind all content. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <span className="ambient-orb orb-1" />
        <span className="ambient-orb orb-2" />
        <span className="ambient-orb orb-3" />
      </div>
      <Navbar />
      <main className="flex-grow">
        <ChunkErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </ChunkErrorBoundary>
      </main>
      <Footer />
      <StreakModal />
      <BottomNav />
    </div>
  );
};

export default RootLayout;
