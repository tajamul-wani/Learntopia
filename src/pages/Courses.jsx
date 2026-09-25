import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSound } from "../context/SoundContext";
import { useLanguage } from "../context/LanguageContext";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import Card from "../Components/ui/Card";
import Button from "../Components/ui/Button";
import ImageWithSkeleton from "../Components/ui/ImageWithSkeleton";
import SearchInput from "../Components/ui/SearchInput";
import SectionHeading from "../Components/ui/SectionHeading";
import EmptyState from "../Components/ui/EmptyState";
import Icon from "../Components/ui/Icon";
import { COURSES } from "../data/coursesData";
import { getLocalizedCourse } from "../utils/localizationUtils";
import star from "../assets/CourseImg/star.png";

const Courses = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { playClick } = useSound();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [enrolledIds, setEnrolledIds] = useState([]);
  // Courses the user left but can rejoin — their saved progress still exists.
  const [unenrolledIds, setUnenrolledIds] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchEnrolled = async () => {
        try {
          const snap = await getDocs(collection(db, "Users", currentUser.uid, "enrolledCourses"));
          const active = [];
          const left = [];
          const finished = [];
          snap.docs.forEach((d) => {
            const data = d.data();
            if (data.unenrolled) return left.push(d.id);
            if (data.completed) finished.push(d.id);
            return active.push(d.id);
          });
          setEnrolledIds(active);
          setUnenrolledIds(left);
          setCompletedIds(finished);
        } catch (e) {
          console.error("Error fetching enrolled courses", e);
        }
      };
      fetchEnrolled();
    }
  }, [currentUser]);

  // A card sends a learner to the course, and nothing else. Joining is one
  // explicit action on the course page now, so nobody is enrolled for looking.
  const openCourse = (course) => {
    playClick();
    if (!currentUser) {
      navigate("/login", { state: { returnTo: `/course/${course.id}` } });
      return;
    }
    navigate(`/course/${course.id}`);
  };

  const localizedCourses = useMemo(() => {
    return COURSES.map((c) => getLocalizedCourse(c, t));
  }, [t]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return localizedCourses;
    return localizedCourses.filter(
      (c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)
    );
  }, [query, localizedCourses]);

  return (
    <div className="container-page py-16 md:py-20">
      <SectionHeading
        centered
        eyebrow={t("nav.courses")}
        title={t("courses.title")}
        description={t("courses.subtitle")}
      />

      {/* Search */}
      <div className="mx-auto mt-8 max-w-xl">
        <SearchInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          placeholder={t("courses.searchPlaceholder")}
        />
        {query && (
          <p className="mt-3 text-center text-sm text-ink-low">
            {filtered.length === 1
              ? t("courses.searchResultsSingle", { count: filtered.length, query })
              : t("courses.searchResultsPlural", { count: filtered.length, query })}
          </p>
        )}
      </div>

      {/* Grid or empty state */}
      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => {
            const isEnrolled = enrolledIds.includes(course.id.toString());
            const isRejoin = !isEnrolled && unenrolledIds.includes(course.id.toString());
            const isCompleted = completedIds.includes(course.id.toString());

            return (
              <Card key={course.id} hoverable className="group flex flex-col p-5">
                {/* The header holds a category of unknown length and up to two
                    badges. Without wrapping and a shrinkable category, a long
                    word like MATHEMATICS and a two-line badge sit on top of
                    each other. */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-[0.06em] text-ink-low">
                    {course.category}
                  </span>
                  <div className="flex flex-none items-center gap-2">
                    {isEnrolled && (
                      <span className="flex items-center gap-1 whitespace-nowrap rounded-md border border-state-success/20 bg-state-success/10 px-2 py-0.5 text-xs font-bold text-state-success">
                        <Icon name={isCompleted ? "trophy" : "check-circle"} size={12} className="flex-none" />
                        {isCompleted ? t("courses.completedBadge") : t("courses.enrolledBadge")}
                      </span>
                    )}
                    {isRejoin && (
                      <span className="flex items-center gap-1 whitespace-nowrap rounded-md border border-state-warning/20 bg-state-warning/10 px-2 py-0.5 text-xs font-bold text-state-warning">
                        <Icon name="refresh-cw" size={12} className="flex-none" />
                        {t("courses.rejoinBadge")}
                      </span>
                    )}
                    <span className="flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-surface-2 px-3 py-1 text-xs font-bold text-ink-hi shadow-clay-sm">
                      <img src={star} alt="" className="h-3.5 w-3.5" />
                      {course.rating}
                    </span>
                  </div>
                </div>

                <div className="relative mb-4 flex justify-center overflow-hidden rounded-2xl clay-inset py-8">
                  <div className="pointer-events-none absolute left-1/2 top-3 h-20 w-32 -translate-x-1/2 rounded-full bg-violet-500/30 blur-2xl transition-opacity duration-500 group-hover:bg-sky/30" />
                  <ImageWithSkeleton
                    src={course.image}
                    alt={course.title}
                    imgClassName="relative h-24 w-auto object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-500 group-hover:scale-[1.07]"
                  />
                </div>

                <h3 className="text-lg font-bold leading-snug text-ink-hi">{course.title}</h3>
                <p className="mt-2 mb-6 text-xs leading-relaxed text-ink-low line-clamp-2">{course.desc}</p>

                <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <div>
                    <div className="flex -space-x-2">
                      {course.avatars.map((a, i) => (
                        <img key={i} src={a} alt="" className="h-6 w-6 rounded-full border-2 border-ground-800 object-cover" />
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-ink-low">{course.students} {String(t("stats.studentsLegend") || "").toLowerCase()}</p>
                  </div>
                  {isCompleted ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCourse(course)}
                      className="gap-1.5 border-state-success/30 bg-state-success/[0.08] text-state-success hover:bg-state-success/[0.15]"
                    >
                      <Icon name="refresh-cw" size={14} />
                      {t("courses.restart")}
                    </Button>
                  ) : isEnrolled ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openCourse(course)}
                      className="border-state-success/30 bg-state-success/[0.08] text-state-success hover:bg-state-success/[0.15]"
                    >
                      {t("courses.continueLearning")}
                    </Button>
                  ) : isRejoin ? (
                    <Button
                      size="sm"
                      onClick={() => openCourse(course)}
                      className="gap-1.5 border-state-warning/30 bg-state-warning/[0.10] text-state-warning hover:bg-state-warning/[0.18]"
                    >
                      <Icon name="refresh-cw" size={14} />
                      {t("courses.rejoin")}
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => openCourse(course)}>
                      {t("courses.viewCourse")}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState
            icon="search"
            title={t("courses.noResults", { query })}
            description={t("courses.noResultsDesc")}
            action={
              <Button variant="secondary" size="sm" onClick={() => setQuery("")}>
                {t("courses.clearSearch")}
              </Button>
            }
          />
        </div>
      )}

    </div>
  );
};

export default Courses;
