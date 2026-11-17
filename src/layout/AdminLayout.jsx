import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Skeleton } from "../Components/ui/Skeleton";
import ChunkErrorBoundary from "../Components/ChunkErrorBoundary";
import useAdminSession from "../pages/admin/useAdminSession";

/* ── Admin-specific skeleton (no student Navbar/Footer) ── */
const AdminSkeleton = () => (
  <div className="flex min-h-screen flex-col bg-surface-primary">
    {/* Fake top bar */}
    <div className="border-b border-white/[0.06] px-6 py-4">
      <Skeleton className="h-8 w-44 rounded-lg" />
    </div>
    {/* Fake body */}
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10">
      <Skeleton className="mb-6 h-10 w-64 rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="mt-8 h-72 w-full rounded-2xl" />
    </div>
  </div>
);

/**
 * AdminLayout
 *
 * Wraps the `/admin` route in a completely isolated shell.
 * – No student Navbar
 * – No student Footer
 * – No gamification overlays
 * – Full-screen executive layout
 */
const AdminLayout = () => {
  useAdminSession();
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <ChunkErrorBoundary>
        <Suspense fallback={<AdminSkeleton />}>
          <Outlet />
        </Suspense>
      </ChunkErrorBoundary>
    </div>
  );
};

export default AdminLayout;
