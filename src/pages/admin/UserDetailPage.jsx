import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { COURSES } from "../../data/coursesData";
import { ONLINE_WINDOW_MS } from "../../hooks/usePresence";
import { useAuth } from "../../context/AuthContext";
import Icon from "../../Components/ui/Icon";
import { Skeleton } from "../../Components/ui/Skeleton";
import { Bars, Line } from "./ActivityChart";
import { lastDays } from "./days";

const courseById = new Map(COURSES.map((c) => [String(c.id), c]));
const ms = (v) => (v?.toMillis ? v.toMillis() : v instanceof Date ? v.getTime() : 0);

const Panel = ({ title, children }) => (
  <section className="min-w-0 rounded-xl border border-white/10 bg-surface p-5 shadow-clay">
    <h2 className="mb-3 text-sm font-bold text-white">{title}</h2>
    {children}
  </section>
);

const Stat = ({ label, value, tone = "text-white" }) => (
  <div className="rounded-xl border border-white/10 bg-surface p-4 shadow-clay">
    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-low">{label}</p>
    <p className={`mt-1 text-2xl font-extrabold tabular-nums ${tone}`}>{value}</p>
  </div>
);

const ago = (t, now) => {
  if (!t) return "never";
  const mins = Math.max(0, Math.round((now - t) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  return `${Math.round(mins / 1440)} d ago`;
};

/**
 * One learner, on their own page: live presence, and graphs built from what
 * the app already stores (days opened, the XP ledger, quiz attempts), so
 * nothing new is written to produce them.
 */
const UserDetailPage = () => {
  const { uid } = useParams();
  const { isAdmin, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(undefined);
  const [extra, setExtra] = useState(null);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isAdmin || !uid) return undefined;
    const unsub = onSnapshot(
      doc(db, "Users", uid),
      (snap) => setProfile(snap.exists() ? { uid, ...snap.data() } : null),
      () => setFailed(true)
    );
    return unsub;
  }, [isAdmin, uid]);

  useEffect(() => {
    if (!isAdmin || !uid) return undefined;
    let cancelled = false;
    Promise.all(
      ["enrolledCourses", "quizAttempts", "xpLedger"].map((sub) => getDocs(collection(db, "Users", uid, sub)))
    )
      .then(([courses, attempts, ledger]) => {
        if (cancelled) return;
        setExtra({
          courses: courses.docs.map((d) => ({ id: d.id, ...d.data() })),
          attempts: attempts.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => ms(a.completedAt) - ms(b.completedAt)),
          ledger: ledger.docs.map((d) => ({ id: d.id, ...d.data() })).sort((a, b) => ms(a.grantedAt) - ms(b.grantedAt)),
        });
      })
      .catch((err) => {
        console.error("Error loading learner activity:", err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdmin, uid]);

  if (authLoading) return <Skeleton className="m-6 h-72 rounded-2xl" />;
  if (!isAdmin) return <Navigate to="/admin" replace />;

  const back = (
    <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:underline">
      <Icon name="arrow-left" size={14} /> All students
    </Link>
  );

  if (profile === null) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
        {back}
        <p className="mt-6 text-ink-low">This learner no longer exists.</p>
      </div>
    );
  }
  if (profile === undefined || !extra) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6">
        {back}
        {failed ? (
          <p className="mt-6 text-state-danger">Could not load this learner.</p>
        ) : (
          <Skeleton className="mt-6 h-72 rounded-2xl" />
        )}
      </div>
    );
  }

  const lastActive = ms(profile.lastActive);
  const online = lastActive > 0 && now - lastActive < ONLINE_WINDOW_MS;
  const days = new Set(Array.isArray(profile.activeDays) ? profile.activeDays : []);
  const dayBars = lastDays(30).map((key) => ({ key, value: days.has(key) ? 1 : 0 }));
  let running = 0;
  const xpPoints = extra.ledger
    .filter((g) => ms(g.grantedAt) > 0)
    .map((g) => {
      running += g.amount || 0;
      return { t: ms(g.grantedAt), y: running };
    });
  const quizBars = extra.attempts.slice(-20).map((a, i) => ({
    key: `${String(i + 1).padStart(2, "0")}-${a.quizTitle || a.quizId || "quiz"}`,
    value: a.totalQuestions ? Math.round((a.score / a.totalQuestions) * 100) : 0,
  }));
  const log = [
    ...extra.ledger.map((g) => ({ at: ms(g.grantedAt), text: `Earned ${g.amount} XP (${g.type})` })),
    ...extra.attempts.map((a) => ({ at: ms(a.completedAt), text: `Quiz ${a.quizTitle || a.quizId}: ${a.score}/${a.totalQuestions}` })),
  ]
    .sort((a, b) => b.at - a.at)
    .slice(0, 40);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      {back}
      <header className="flex flex-col gap-2 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold text-white sm:text-3xl">{profile.fullName || "Learner"}</h1>
          <p className="mt-1 break-all text-sm text-ink-low">{profile.email || "No email"}</p>
        </div>
        <p className="flex items-center gap-2 text-sm text-ink-low" data-testid="presence">
          <span className={`h-2 w-2 rounded-full ${online ? "bg-state-success" : "bg-white/20"}`} />
          {online ? "Online now" : `Last active ${ago(lastActive, now)}`}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Points" value={profile.totalPoints || 0} tone="text-gold-300" />
        <Stat label="Streak" value={`${profile.streak || 1}d`} tone="text-gold-400" />
        <Stat label="Days active" value={days.size} tone="text-violet-300" />
        <Stat label="Badges" value={(profile.badges || []).length} tone="text-sky" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Days opened, last 30 days">
          <Bars data={dayBars} label="Days this learner opened the app in the last 30 days" />
        </Panel>
        <Panel title="XP over time">
          <Line points={xpPoints} label="Cumulative XP over time" />
        </Panel>
        <Panel title="Quiz performance (percent)">
          {quizBars.length ? (
            <Bars data={quizBars} label="Quiz scores as a percentage, oldest to newest" unit="%" />
          ) : (
            <p className="py-6 text-center text-xs text-ink-low">No quizzes taken.</p>
          )}
        </Panel>
        <Panel title="Courses">
          {extra.courses.length === 0 ? (
            <p className="text-xs text-ink-low">Not enrolled in any course.</p>
          ) : (
            <ul className="space-y-2">
              {extra.courses.map((c) => {
                const course = courseById.get(String(c.id));
                const total = course?.modules?.length || c.totalModules || 0;
                const done = Array.isArray(c.completedModules) ? c.completedModules.length : 0;
                const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
                return (
                  <li key={c.id} className="rounded-xl border border-white/10 bg-surface-2 p-3 shadow-clay-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate font-semibold text-ink-hi">{course?.title || c.title || `Course ${c.id}`}</span>
                      {c.unenrolled && <span className="flex-none text-[10px] font-bold uppercase tracking-wider text-ink-faint">Unenrolled</span>}
                      <span className="flex-none text-xs font-bold tabular-nums text-violet-300">{done}/{total || "?"}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Activity log">
        {log.length === 0 ? (
          <p className="text-xs text-ink-low">Nothing recorded yet.</p>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {log.map((e, i) => (
              <li key={i} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate text-ink-hi">{e.text}</span>
                <span className="flex-none text-[11px] text-ink-faint">{e.at ? new Date(e.at).toLocaleString() : ""}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
};

export default UserDetailPage;
