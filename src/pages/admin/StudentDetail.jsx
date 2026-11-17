import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { COURSES } from "../../data/coursesData";
import Icon from "../../Components/ui/Icon";
import Button from "../../Components/ui/Button";
import Modal from "../../Components/ui/Modal";
import { Skeleton } from "../../Components/ui/Skeleton";

const courseById = new Map(COURSES.map((c) => [String(c.id), c]));

const formatWhen = (value) => {
  const date = value?.toDate ? value.toDate() : value instanceof Date ? value : null;
  return date ? date.toLocaleDateString() : "";
};

const Stat = ({ label, value, tone = "text-white" }) => (
  <div className="rounded-xl clay-inset p-3">
    <p className="text-[11px] font-bold uppercase tracking-wider text-ink-low">{label}</p>
    <p className={`mt-1 text-xl font-extrabold tabular-nums ${tone}`}>{value}</p>
  </div>
);

/**
 * Read-only detail for one learner: profile numbers, badges, enrolled courses
 * with module progress, and quiz attempts. The two subcollections are fetched
 * only when an admin opens a learner, never for the whole roster.
 */
const StudentDetail = ({ student, onClose }) => {
  const [courses, setCourses] = useState(null);
  const [attempts, setAttempts] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [courseSnap, attemptSnap] = await Promise.all([
          getDocs(collection(db, "Users", student.uid, "enrolledCourses")),
          getDocs(collection(db, "Users", student.uid, "quizAttempts")),
        ]);
        if (cancelled) return;
        setCourses(courseSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        const list = attemptSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0));
        setAttempts(list);
      } catch (err) {
        console.error("Error loading learner detail:", err);
        if (!cancelled) setFailed(true);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [student.uid]);

  const loading = !failed && (courses === null || attempts === null);

  return (
    <Modal isOpen onClose={onClose} title={student.fullName || "Learner"}>
      <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1 text-sm text-ink-hi">
        <div className="space-y-1.5 rounded-xl clay-inset p-4">
          <p className="break-all"><span className="text-ink-low">Email:</span> {student.email || "N/A"}</p>
          <p className="break-all"><span className="text-ink-low">User ID:</span> <code className="font-mono text-xs text-violet-300">{student.uid}</code></p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <Stat label="Points" value={student.totalPoints || 0} tone="text-gold-300" />
          <Stat label="Streak" value={`${student.streak || 1}d`} tone="text-gold-400" />
          <Stat label="Badges" value={(student.badges || []).length} tone="text-sky" />
        </div>

        <section>
          <h5 className="mb-2 font-bold text-white">Courses</h5>
          {loading ? (
            <Skeleton className="h-16 rounded-xl" />
          ) : failed ? (
            <p className="text-xs text-state-danger">Could not load this learner&apos;s activity.</p>
          ) : courses.length === 0 ? (
            <p className="text-xs text-ink-low">Not enrolled in any course.</p>
          ) : (
            <ul className="space-y-2">
              {courses.map((c) => {
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
        </section>

        <section>
          <h5 className="mb-2 font-bold text-white">Quiz attempts</h5>
          {loading ? (
            <Skeleton className="h-16 rounded-xl" />
          ) : failed ? null : attempts.length === 0 ? (
            <p className="text-xs text-ink-low">No quizzes taken.</p>
          ) : (
            <ul className="space-y-2">
              {attempts.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-surface-2 px-3 py-2 shadow-clay-sm">
                  <span className="min-w-0 flex-1 truncate text-ink-hi">{a.quizTitle || a.quizId}</span>
                  <span className="flex-none text-[11px] text-ink-faint">{formatWhen(a.completedAt)}</span>
                  <span className="flex-none font-bold tabular-nums text-sky">{a.score}/{a.totalQuestions}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h5 className="mb-2 font-bold text-white">Earned badges</h5>
          <div className="flex flex-wrap gap-2">
            {student.badges && student.badges.length > 0 ? (
              student.badges.map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-300">
                  <Icon name={typeof b === "string" ? "award" : b.icon || "award"} size={14} /> {typeof b === "string" ? b : b.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-ink-low">No badges earned yet.</span>
            )}
          </div>
        </section>

        <div className="flex justify-end pt-1">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentDetail;
