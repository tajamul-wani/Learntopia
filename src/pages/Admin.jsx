import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import Button from "../Components/ui/Button";
import Icon from "../Components/ui/Icon";
import Card from "../Components/ui/Card";
import Modal from "../Components/ui/Modal";
import { Skeleton } from "../Components/ui/Skeleton";
import { toast } from "../context/ToastContext";
import google from "../assets/Icons/google.png";

/* ── Live Clock Hook ── */
const useLiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: "bar-chart" },
  { id: "students", label: "Students", icon: "users" },
  { id: "messages", label: "Messages", icon: "mail" },
  { id: "bugs", label: "System Logs", icon: "alert-circle" },
];

const SECTION_META = {
  overview: { title: "Overview", subtitle: "Platform activity at a glance." },
  students: { title: "Registered Students", subtitle: "All learners, their points, streaks and badges." },
  messages: { title: "Contact Inquiries", subtitle: "Messages submitted through the contact form." },
  bugs: { title: "System Logs", subtitle: "Bug reports and maintenance notes." },
};

const Admin = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, loading: authLoading, googleSignIn, logOut } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [bugReports, setBugReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showNewBugModal, setShowNewBugModal] = useState(false);
  const [newBug, setNewBug] = useState({ title: "", description: "", priority: "Medium" });
  const [submittingBug, setSubmittingBug] = useState(false);

  const handleAdminGoogleAuth = async () => {
    setAdminLoading(true);
    try {
      const user = await googleSignIn();
      // Authority is the server-set admin claim only — no email compared client-side.
      const tokenResult = user && (await user.getIdTokenResult());
      if (!tokenResult || tokenResult.claims.admin !== true) {
        // Wrong door, not a wrong person: the account simply is not an admin.
        // The portal still refuses to open, which is the part that matters, but
        // a valid learner keeps their session and lands in the learner app
        // rather than being signed out and dropped on a red error.
        if (user) {
          toast.info(t("toasts.notAnAdminSignedIn"), { autoClose: 4000 });
          navigate("/dashboard", { replace: true });
          return;
        }
        await logOut();
        toast.error(t("toasts.accessDenied"), { autoClose: 4000 });
        navigate("/login");
        return;
      }

      toast.success(t("toasts.adminWelcome"));
    } catch (err) {
      console.error("Admin Google auth error:", err);
      toast.error(t("toasts.googleAuthFailed"));
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await logOut();
      toast.success(t("toasts.adminLoggedOut"));
    } catch (err) {
      console.error("Admin logout error:", err);
      toast.error(t("toasts.logoutFailed"));
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      let studentCount = 0;
      let msgCount = 0;
      let bugCount = 0;
      try {
        // 1. Fetch all real user profiles. Exclude admin.
        const usersSnap = await getDocs(collection(db, "Users"));
        const studentList = [];
        usersSnap.forEach((docSnap) => {
          // Skip the admin's own profile (the current viewer).
          if (docSnap.id === currentUser.uid) return;
          const data = docSnap.data();
          studentList.push({ id: docSnap.id, uid: docSnap.id, ...data });
        });
        setStudents(studentList);
        studentCount = studentList.length;

        // 2. Contact messages
        try {
          const messagesQuery = query(collection(db, "ContactMessages"), orderBy("submittedAt", "desc"));
          const msgSnap = await getDocs(messagesQuery);
          const msgList = [];
          msgSnap.forEach((docSnap) => msgList.push({ id: docSnap.id, ...docSnap.data() }));
          setContactMessages(msgList);
          msgCount = msgList.length;
        } catch {
          const msgSnap = await getDocs(collection(db, "ContactMessages"));
          const msgList = [];
          msgSnap.forEach((docSnap) => msgList.push({ id: docSnap.id, ...docSnap.data() }));
          setContactMessages(msgList);
          msgCount = msgList.length;
        }

        // 3. Bug reports / system notes
        try {
          const bugSnap = await getDocs(collection(db, "BugReports"));
          const bugList = [];
          bugSnap.forEach((docSnap) => bugList.push({ id: docSnap.id, ...docSnap.data() }));
          setBugReports(bugList);
          bugCount = bugList.length;
        } catch (err) {
          console.warn("No BugReports collection yet:", err);
        }

        toast.success(`Loaded ${studentCount} student${studentCount === 1 ? "" : "s"} · ${msgCount} message${msgCount === 1 ? "" : "s"} · ${bugCount} log${bugCount === 1 ? "" : "s"}`);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        toast.error(t("toasts.loadDataFailed"));
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, authLoading, currentUser, t]);

  const handleCreateBugReport = async (e) => {
    e.preventDefault();
    if (!newBug.title.trim() || !newBug.description.trim()) {
      toast.error(t("toasts.provideTitleDesc"));
      return;
    }
    setSubmittingBug(true);
    try {
      const bugData = {
        title: newBug.title.trim(),
        description: newBug.description.trim(),
        priority: newBug.priority,
        status: "Open",
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || "admin",
      };
      const docRef = await addDoc(collection(db, "BugReports"), bugData);
      setBugReports((prev) => [{ id: docRef.id, ...bugData, createdAt: new Date() }, ...prev]);
      setShowNewBugModal(false);
      setNewBug({ title: "", description: "", priority: "Medium" });
      toast.success(t("toasts.logSaved"));
    } catch (err) {
      console.error("Error logging bug report:", err);
      toast.error(t("toasts.saveLogFailed"));
    } finally {
      setSubmittingBug(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        (s.fullName && s.fullName.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q)) ||
        (s.uid && s.uid.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  const totalPoints = useMemo(
    () => students.reduce((acc, s) => acc + (s.totalPoints || 0), 0),
    [students]
  );

  const topStudents = useMemo(
    () => [...students].sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)).slice(0, 5),
    [students]
  );

  const exportStudentsCSV = () => {
    if (students.length === 0) {
      toast.error(t("toasts.noStudentData"));
      return;
    }
    const headers = "Name,Email,UID,Total Points,Streak,Badges Count\n";
    const rows = students
      .map(
        (s) =>
          `"${s.fullName || "N/A"}","${s.email || "N/A"}","${s.uid || s.id}",${s.totalPoints || 0},${s.streak || 1},${(s.badges || []).length}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Learntopia_Students_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("toasts.exportedCsv"));
  };

  const clock = useLiveClock();
  const timeStr = clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = clock.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Skeleton className="mb-4 h-10 w-56 rounded-xl" />
        <Skeleton className="h-72 w-full max-w-lg rounded-2xl" />
      </div>
    );
  }

  // Dedicated Admin Portal Login Screen when not authenticated as Admin
  if (!isAdmin || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* ── Minimal Top Bar (Login State) ── */}
        <header className="flex items-center justify-between border-b border-white/[0.06] bg-surface px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-sky text-white shadow-md">
              <Icon name="shield" size={16} />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">Learntopia <span className="text-violet-300">Admin</span></span>
          </div>
          <div className="hidden items-center gap-3 text-[11px] text-ink-faint sm:flex">
            <span>{dateStr}</span>
            <span className="font-mono tabular-nums">{timeStr}</span>
          </div>
        </header>

        {/* ── Login Card ── */}
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md border-violet-500/30 p-6 md:p-8 shadow-2xl">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/15 text-violet-400 border border-violet-500/30 shadow-[0_0_20px_rgba(139,124,246,0.25)]">
                <Icon name="shield" size={28} />
              </div>
              <span className="inline-block rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-violet-300 mb-2">
                System Administrator Portal
              </span>
              <h2 className="text-2xl font-extrabold text-ink-hi">Admin Operations</h2>
              <p className="mt-1 text-xs text-ink-low leading-relaxed">
                Restricted Access &middot; Executive Google Authentication required.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="button"
                disabled={adminLoading}
                onClick={handleAdminGoogleAuth}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-violet-500/40 bg-violet-500/10 p-3.5 text-xs font-bold uppercase tracking-wider text-violet-300 transition-colors hover:bg-violet-500/20 disabled:opacity-50 shadow-lg"
              >
                <img src={google} alt="" className="h-5 w-5 object-contain" />
                {adminLoading ? "Authenticating Admin…" : "Authenticate Admin with Google"}
              </button>
            </div>

            <div className="mt-6 border-t border-white/[0.06] pt-4 text-center">
              <Link to="/" className="text-xs text-ink-low transition-colors hover:text-sky hover:underline">
                &larr; Back to Learntopia Main Platform
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const counts = {
    students: students.length,
    messages: contactMessages.length,
    bugs: bugReports.length,
  };

  const KPIS = [
    { label: "Students", value: students.length, icon: "users", tint: "text-violet-300", ring: "border-violet-500/25" },
    { label: "Messages", value: contactMessages.length, icon: "mail", tint: "text-sky", ring: "border-sky/25" },
    { label: "System Logs", value: bugReports.length, icon: "alert-circle", tint: "text-gold-300", ring: "border-gold-500/25" },
    { label: "Total Points", value: totalPoints, icon: "trophy", tint: "text-state-success", ring: "border-state-success/25" },
  ];

  const meta = SECTION_META[activeTab];

  const navItem = (item) => {
    const active = activeTab === item.id;
    const count = counts[item.id];
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
          active ? "bg-violet-500/15 text-violet-300" : "text-ink-low hover:bg-white/[0.04] hover:text-ink-hi"
        }`}
      >
        <Icon name={item.icon} size={17} className={active ? "text-violet-300" : ""} />
        <span className="flex-1 text-left">{item.label}</span>
        {count !== undefined && (
          <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${active ? "bg-violet-500/25 text-violet-300" : "bg-white/[0.06] text-ink-low"}`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex min-h-screen flex-col text-ink-hi">
      {/* ── Executive Top Bar ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-surface px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-sky text-white shadow-md">
            <Icon name="shield" size={16} />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">Learntopia <span className="text-violet-300">Admin</span></span>
          <span className="ml-2 hidden rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-violet-300 sm:inline-block">Operations Center</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 text-[11px] text-ink-faint md:flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-state-success" />
            <span>{dateStr}</span>
            <span className="font-mono tabular-nums">{timeStr}</span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1">
              <Icon name="shield" size={12} className="text-violet-400" />
              <span className="text-[11px] font-bold text-violet-300 truncate max-w-[120px]">{currentUser?.displayName || "Admin"}</span>
            </div>
          </div>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 rounded-lg border border-state-danger/20 bg-state-danger/10 px-3 py-1.5 text-[11px] font-semibold text-state-danger transition-colors hover:bg-state-danger/20"
          >
            <Icon name="log-out" size={13} />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      <div className="flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* Mobile section nav */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-none items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  active ? "border-violet-500/40 bg-violet-500/15 text-violet-300" : "border-white/10 bg-surface-2 shadow-clay-sm text-ink-low"
                }`}
              >
                <Icon name={item.icon} size={14} /> {item.label}
                {counts[item.id] !== undefined && <span className="tabular-nums">({counts[item.id]})</span>}
              </button>
            );
          })}
        </div>

        <div className="flex gap-8">

          {/* ── Sidebar ── */}
          <aside className="hidden w-60 flex-none lg:block">
            <div className="sticky top-20">
              <div className="rounded-xl border border-violet-500/30 bg-surface shadow-clay p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-sky text-white shadow-md">
                    <Icon name="shield" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">
                      {currentUser?.displayName || "Tajamul Wani"}
                    </p>
                    <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-violet-500/40 bg-violet-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-violet-300 shadow-[0_0_10px_rgba(139,124,246,0.25)]">
                      <Icon name="shield" size={11} className="text-violet-400" />
                      ADMIN
                    </div>
                  </div>
                </div>
              </div>

              <nav className="mt-3 space-y-1 rounded-xl border border-white/10 bg-surface shadow-clay p-2">
                {NAV_ITEMS.map(navItem)}
              </nav>

              <button
                onClick={handleAdminLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-state-danger/20 bg-state-danger/10 py-2.5 text-xs font-semibold text-state-danger hover:bg-state-danger/20 transition-colors"
              >
                <Icon name="log-out" size={14} /> Exit Admin Portal
              </button>

              <div className="mt-3 flex items-center gap-1.5 px-2 text-[11px] text-ink-faint">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-state-success" /> Live system
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="min-w-0 flex-1">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{meta.title}</h1>
                <p className="mt-1 text-sm text-ink-low">{meta.subtitle}</p>
              </div>
              <div className="flex flex-none gap-2.5">
                {(activeTab === "students" || activeTab === "overview") && (
                  <Button variant="secondary" size="sm" onClick={exportStudentsCSV}>
                    <Icon name="clipboard" size={15} /> Export CSV
                  </Button>
                )}
                {(activeTab === "bugs" || activeTab === "overview") && (
                  <Button size="sm" onClick={() => setShowNewBugModal(true)}>
                    <Icon name="alert-circle" size={15} /> Log note
                  </Button>
                )}
              </div>
            </div>

            {/* ══ OVERVIEW ══ */}
            {activeTab === "overview" && (
              <div className="mt-6 space-y-6">
                {/* KPI cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {KPIS.map((k) => (
                    <div key={k.label} className={`rounded-xl border bg-surface shadow-clay p-5 ${k.ring}`}>
                      <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${k.tint}`}>
                        <Icon name={k.icon} size={16} /> {k.label}
                      </div>
                      <p className="mt-3 text-3xl font-extrabold tabular-nums text-white">{loading ? "—" : k.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent activity split */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Top students */}
                  <div className="rounded-xl border border-white/10 bg-surface shadow-clay p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Icon name="trophy" size={16} className="text-gold-400" /> Top students</h3>
                      <button onClick={() => setActiveTab("students")} className="text-xs font-semibold text-violet-400 hover:underline">View all</button>
                    </div>
                    {loading ? (
                      <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-11 rounded-lg" />)}</div>
                    ) : topStudents.length > 0 ? (
                      <ul className="space-y-2">
                        {topStudents.map((s, i) => (
                          <li key={s.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface-2 shadow-clay-sm px-3 py-2.5">
                            <span className="w-4 flex-none text-center text-xs font-bold text-ink-faint tabular-nums">{i + 1}</span>
                            <div className="grid h-8 w-8 flex-none place-items-center rounded-full bg-gradient-to-tr from-violet-600 to-sky text-xs font-bold text-white">
                              {s.fullName ? s.fullName.charAt(0).toUpperCase() : "S"}
                            </div>
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-hi">{s.fullName || "Learner"}</span>
                            <span className="flex-none text-sm font-bold tabular-nums text-gold-300">{s.totalPoints || 0} pts</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="py-6 text-center text-sm text-ink-low">No students yet.</p>
                    )}
                  </div>

                  {/* Recent messages */}
                  <div className="rounded-xl border border-white/10 bg-surface shadow-clay p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold text-white"><Icon name="mail" size={16} className="text-sky" /> Recent messages</h3>
                      <button onClick={() => setActiveTab("messages")} className="text-xs font-semibold text-violet-400 hover:underline">View all</button>
                    </div>
                    {loading ? (
                      <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-11 rounded-lg" />)}</div>
                    ) : contactMessages.length > 0 ? (
                      <ul className="space-y-2">
                        {contactMessages.slice(0, 4).map((m) => (
                          <li key={m.id}>
                            <button onClick={() => setSelectedMessage(m)} className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-surface-2 shadow-clay-sm px-3 py-2.5 text-left transition-colors hover:bg-surface">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-ink-hi">{m.subject || "(No subject)"}</p>
                                <p className="truncate text-[11px] text-ink-low">{m.name}</p>
                              </div>
                              <Icon name="arrow-right" size={14} className="flex-none text-ink-faint" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="py-6 text-center text-sm text-ink-low">No messages received yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ══ STUDENTS ══ */}
            {activeTab === "students" && (
              <div className="mt-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-ink-low">{filteredStudents.length} of {students.length} students</p>
                  <div className="relative w-full sm:w-72">
                    <Icon name="search" size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-low" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email…"
                      className="w-full rounded-lg border border-white/[0.1] bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-ink-hi outline-none placeholder:text-ink-low/60 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-surface shadow-clay py-14 text-center text-ink-low">
                    <Icon name="users" size={36} className="mx-auto mb-3 text-ink-faint" />
                    <p className="font-semibold">No students found</p>
                    <p className="text-sm">Try a different search term.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-surface shadow-clay">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-white/[0.08] bg-surface-2 text-xs font-bold uppercase tracking-wider text-ink-low">
                        <tr>
                          <th className="px-5 py-3.5">Student</th>
                          <th className="px-5 py-3.5">Email</th>
                          <th className="px-5 py-3.5 text-right">Points</th>
                          <th className="px-5 py-3.5 text-right">Streak</th>
                          <th className="px-5 py-3.5 text-right">Badges</th>
                          <th className="px-5 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="transition-colors hover:bg-white/[0.02]">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gradient-to-tr from-violet-600 to-sky text-sm font-bold text-white">
                                  {s.fullName ? s.fullName.charAt(0).toUpperCase() : "S"}
                                </div>
                                <span className="font-semibold text-white">{s.fullName || "Learner"}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-xs text-ink-low">{s.email || "N/A"}</td>
                            <td className="px-5 py-3.5 text-right font-bold tabular-nums text-gold-300">{s.totalPoints || 0}</td>
                            <td className="px-5 py-3.5 text-right font-semibold tabular-nums text-gold-400">{s.streak || 1}d</td>
                            <td className="px-5 py-3.5 text-right tabular-nums text-sky">{(s.badges || []).length}</td>
                            <td className="px-5 py-3.5 text-right">
                              <Button size="sm" variant="ghost" onClick={() => setSelectedStudent(s)}>View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ══ MESSAGES ══ */}
            {activeTab === "messages" && (
              <div className="mt-6">
                {loading ? (
                  <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
                ) : contactMessages.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-surface shadow-clay py-14 text-center text-ink-low">
                    <Icon name="mail" size={36} className="mx-auto mb-3 text-ink-faint" />
                    <p className="font-semibold">No messages received yet</p>
                    <p className="text-sm">Contact-form submissions appear here instantly.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {contactMessages.map((msg) => (
                      <div key={msg.id} className="flex flex-col rounded-xl border border-white/10 bg-surface shadow-clay p-5 transition-colors hover:border-violet-500/30">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h4 className="font-bold text-white">{msg.subject || "(No subject)"}</h4>
                          <span className="flex-none text-[11px] text-ink-faint">{msg.submittedAt?.toDate ? msg.submittedAt.toDate().toLocaleDateString() : "Recent"}</span>
                        </div>
                        <p className="text-xs text-ink-low">From <span className="font-semibold text-violet-300">{msg.name}</span></p>
                        <p className="mt-3 line-clamp-2 flex-1 rounded-lg clay-inset p-3 text-sm leading-relaxed text-ink-low">
                          &ldquo;{msg.message}&rdquo;
                        </p>
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedMessage(msg)}>Read full</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ SYSTEM LOGS ══ */}
            {activeTab === "bugs" && (
              <div className="mt-6">
                {loading ? (
                  <div className="grid gap-3 sm:grid-cols-2">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}</div>
                ) : bugReports.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-surface shadow-clay py-14 text-center text-ink-low">
                    <Icon name="alert-circle" size={36} className="mx-auto mb-3 text-ink-faint" />
                    <p className="font-semibold">No logs yet</p>
                    <p className="text-sm">Use &ldquo;Log note&rdquo; to record an issue or maintenance note.</p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {bugReports.map((bug) => (
                      <div key={bug.id} className="rounded-xl border border-white/10 bg-surface shadow-clay p-5">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gold-300">{bug.priority || "Medium"} priority</span>
                          <span className="rounded-full bg-state-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-state-success">{bug.status || "Open"}</span>
                        </div>
                        <h4 className="font-bold text-white">{bug.title}</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-low">{bug.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

      {/* ── Student detail modal ── */}
      {selectedStudent && (
        <Modal isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} title={selectedStudent.fullName || "Learner"}>
          <div className="space-y-4 text-sm text-ink-hi">
            <div className="space-y-2 rounded-xl clay-inset p-4">
              <p><span className="text-ink-low">Email:</span> {selectedStudent.email || "N/A"}</p>
              <p><span className="text-ink-low">User ID:</span> <code className="font-mono text-xs text-violet-300">{selectedStudent.uid || selectedStudent.id}</code></p>
              <p><span className="text-ink-low">Total points:</span> <strong className="text-gold-300">{selectedStudent.totalPoints || 0}</strong></p>
              <p><span className="text-ink-low">Streak:</span> <strong className="text-gold-400">{selectedStudent.streak || 1} days</strong></p>
            </div>
            <div>
              <h5 className="mb-2 font-bold text-white">Earned badges</h5>
              <div className="flex flex-wrap gap-2">
                {selectedStudent.badges && selectedStudent.badges.length > 0 ? (
                  selectedStudent.badges.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-300">
                      <Icon name={typeof b === "string" ? "award" : (b.icon || "award")} size={14} /> {typeof b === "string" ? b : b.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink-low">No badges earned yet.</span>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="ghost" onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Message detail modal ── */}
      {selectedMessage && (
        <Modal isOpen={!!selectedMessage} onClose={() => setSelectedMessage(null)} title={`Inquiry from ${selectedMessage.name}`}>
          <div className="space-y-4 text-sm text-ink-hi">
            <div className="space-y-1.5 rounded-xl clay-inset p-4">
              <p><span className="text-ink-low">Name:</span> <strong>{selectedMessage.name}</strong></p>
              <p><span className="text-ink-low">Email:</span> <a href={`mailto:${selectedMessage.email}`} className="text-sky underline">{selectedMessage.email}</a></p>
              <p><span className="text-ink-low">Subject:</span> <strong>{selectedMessage.subject}</strong></p>
            </div>
            <div>
              <h5 className="mb-2 font-bold text-white">Message</h5>
              <div className="whitespace-pre-line rounded-xl clay-inset p-4 leading-relaxed text-ink-low">
                {selectedMessage.message}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || "Learntopia Support")}`}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-clay-btn transition-colors hover:bg-violet-500"
              >
                <Icon name="mail" size={16} /> Reply via email
              </a>
              <Button variant="ghost" onClick={() => setSelectedMessage(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── New log modal ── */}
      {showNewBugModal && (
        <Modal isOpen={showNewBugModal} onClose={() => setShowNewBugModal(false)} title="Log a note / bug report">
          <form onSubmit={handleCreateBugReport} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-low">Title</label>
              <input
                type="text"
                value={newBug.title}
                onChange={(e) => setNewBug((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Quiz timer latency on Safari"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-ink-hi outline-none focus:border-violet-500"
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-low">Priority</label>
              <select
                value={newBug.priority}
                onChange={(e) => setNewBug((p) => ({ ...p, priority: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.1] bg-ground-900 px-4 py-2.5 text-sm text-ink-hi outline-none focus:border-violet-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ink-low">Description</label>
              <textarea
                value={newBug.description}
                onChange={(e) => setNewBug((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe the issue, steps to reproduce, or a maintenance note…"
                rows={4}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 py-2.5 text-sm text-ink-hi outline-none focus:border-violet-500"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" type="button" onClick={() => setShowNewBugModal(false)}>Cancel</Button>
              <Button type="submit" loading={submittingBug}>Save log</Button>
            </div>
          </form>
        </Modal>
      )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
