import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, limit, getDocs, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { quizzes } from "../data/quizData";
import Card from "../Components/ui/Card";
import Icon from "../Components/ui/Icon";
import { Skeleton } from "../Components/ui/Skeleton";
import SectionHeading from "../Components/ui/SectionHeading";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { useLanguage } from "../context/LanguageContext";
import Avatar from "../Components/Avatar";
import LottieIcon from "../Components/ui/LottieIcon";
import crownLottie from "../assets/lottie/crown.lottie?url";
import { parseProfileName } from "../utils/profileUtils";
import { getLocalizedQuiz } from "../utils/localizationUtils";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { triggerCelebration } = useGamification();
  const { t } = useLanguage();
  const [allEntries, setAllEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const TABS = useMemo(() => [
    { id: "all", label: t("leaderboard.allQuizzes") },
    ...quizzes.map((q) => ({ id: q.id, label: getLocalizedQuiz(q, t)?.title || q.title })),
  ], [t]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { returnTo: "/leaderboard" }, replace: true });
    }
  }, [currentUser, navigate]);

  // ── Live leaderboard subscription. Uses onSnapshot so every viewer sees rank
  // and point changes in real time (no refresh), and every device shows the
  // same global numbers straight from Firestore. ──
  useEffect(() => {
    if (!currentUser) return undefined;
    setLoading(true);

    const liveQuery =
      activeTab === "all"
        ? query(collection(db, "PublicLeaderboard"), orderBy("totalPoints", "desc"), limit(50))
        : query(collection(db, "QuizLeaderboards", activeTab, "Scores"), orderBy("score", "desc"), limit(50));

    const unsub = onSnapshot(
      liveQuery,
      async (snap) => {
        const entries = [];

        if (activeTab === "all") {
          snap.forEach((d) => {
            const data = d.data();
            const { displayName, avatarId } = parseProfileName(data, "Learner");
            entries.push({
              id: d.id,
              userId: d.id,
              userName: displayName,
              avatarId: avatarId,
              quizId: "all",
              quizTitle: "Overall Points",
              score: Number(data.totalPoints) || 0,
              rawScore: (Number(data.totalPoints) || 0) / 10,
              isCurrent: d.id === currentUser?.uid,
            });
          });
        } else {
          const activeQuizDef = quizzes.find((q) => q.id === activeTab);
          snap.forEach((d) => {
            const data = d.data();
            const { displayName, avatarId } = parseProfileName(data, "Learner");
            entries.push({
              id: `${activeTab}_${d.id}`,
              userId: d.id,
              userName: displayName,
              avatarId: avatarId,
              quizId: activeTab,
              quizTitle: activeQuizDef?.title || "Quiz",
              score: Number(data.score) || 0,
              rawScore: Number(data.rawScore) || 0,
              isCurrent: d.id === currentUser?.uid,
            });
          });
        }

        // Fallback to the current user's own record if the live list is empty.
        if (entries.length === 0 && currentUser) {
          try {
            if (activeTab === "all") {
              const userSnap = await getDoc(doc(db, "Users", currentUser.uid));
              if (userSnap.exists()) {
                const data = userSnap.data();
                const { displayName, avatarId } = parseProfileName(data, "Learner");
                entries.push({
                  id: currentUser.uid,
                  userId: currentUser.uid,
                  userName: displayName,
                  avatarId: avatarId,
                  quizId: "all",
                  quizTitle: "Overall Points",
                  score: Number(data.totalPoints) || 0,
                  rawScore: (Number(data.totalPoints) || 0) / 10,
                  isCurrent: true,
                });
              }
            } else {
              const attemptsSnap = await getDocs(collection(db, "Users", currentUser.uid, "quizAttempts"));
              const userSnap = await getDoc(doc(db, "Users", currentUser.uid));
              const data = userSnap.exists() ? userSnap.data() : {};
              const { displayName: userName, avatarId } = parseProfileName(data, "Learner");
              attemptsSnap.forEach((qd) => {
                const data = qd.data();
                if (data.quizId === activeTab && data.score !== undefined) {
                  const quizDef = quizzes.find((q) => q.id === data.quizId);
                  entries.push({
                    id: `${currentUser.uid}_${qd.id}`,
                    userId: currentUser.uid,
                    userName,
                    avatarId,
                    quizId: data.quizId,
                    quizTitle: quizDef?.title || "Quiz",
                    score: Number(data.score) * 10,
                    rawScore: Number(data.score),
                    isCurrent: true,
                  });
                }
              });
            }
          } catch (err) {
            console.error("Leaderboard fallback error:", err);
          }
        }

        // Deduplicate - keep highest score per user.
        const bestScores = new Map();
        for (const entry of entries) {
          const key = activeTab === "all" ? entry.userId : `${entry.userId}_${entry.quizId}`;
          const existing = bestScores.get(key);
          if (!existing || entry.score > existing.score) bestScores.set(key, entry);
        }

        setAllEntries(Array.from(bestScores.values()));
        setLoading(false);
      },
      (err) => {
        console.error("Error building leaderboard:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser, activeTab]);

  // ── Champion is DYNAMIC: only the CURRENT overall #1 holds it (shown as the
  // crown on rank 1 here, and as a live medallion on the dashboard). It is NOT a
  // stored badge — a former #1 must lose it. Here we only CELEBRATE the moment the
  // current user newly overtakes #1 while watching (a real transition), never on a
  // plain visit and never for someone who was #1 before. Needs a board of 2+. ──
  const prevTopRef = useRef(null);
  useEffect(() => {
    if (activeTab !== "all" || allEntries.length < 2) return;
    const ranked = [...allEntries].sort((a, b) => b.score - a.score);
    const topUid = ranked[0]?.score > 0 ? ranked[0].userId : null;
    const prev = prevTopRef.current;
    prevTopRef.current = topUid;
    if (prev && prev !== currentUser?.uid && topUid === currentUser?.uid) {
      triggerCelebration({ type: "champion", art: "crown", kind: "champion" });
    }
  }, [allEntries, activeTab, currentUser, triggerCelebration]);

  // ── Filter by search query and sort ──
  const filteredEntries = useMemo(() => {
    let data = allEntries;

    // Search filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      data = data.filter(
        (e) =>
          e.userName.toLowerCase().includes(q) ||
          e.quizTitle.toLowerCase().includes(q)
      );
    }

    // Sort descending by score, limit to top 10
    return [...data].sort((a, b) => b.score - a.score).slice(0, 10);
  }, [allEntries, searchQuery]);

  // ── Animate rows on change ──
  useGSAP(() => {
    if (!loading && filteredEntries.length > 0) {
      gsap.from(".lb-row", {
        y: 12,
        opacity: 0,
        duration: 0.25,
        stagger: 0.04,
        ease: "power2.out",
      });
    }
  }, [loading, activeTab, searchQuery]);

  // ── Rank medal helpers ──
  const getMedal = (rank) => {
    if (rank === 1) return "trophy";
    if (rank === 2) return "award";
    if (rank === 3) return "award";
    return null;
  };

  // Medal colours (gold / silver / bronze) are intentional for a leaderboard;
  // everything else uses the neutral ink token.
  const getRankColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-slate-300";
    if (rank === 3) return "text-gold-400";
    return "text-ink-faint";
  };

  return (
    <div className="container-page flex min-h-[85vh] flex-col items-center py-8 md:py-16 text-white">

      {/* ── Header ── */}
      <div className="w-full max-w-5xl mb-8 animate-fade-in">
        <SectionHeading
          centered
          eyebrow={t("leaderboard.badge")}
          title={t("leaderboard.title")}
          description={t("leaderboard.subtitle")}
        />
      </div>

      {/* ── Quiz Filter: Dropdown on mobile, tabs on desktop ── */}
      <div className="w-full max-w-5xl mb-5">
        {/* Mobile: Dropdown */}
        <div className="block md:hidden">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint mb-1.5 block">{t("leaderboard.filterByQuiz")}</label>
          <div className="relative">
            <select
              value={activeTab}
              onChange={(e) => { setActiveTab(e.target.value); setSearchQuery(""); }}
              className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 pr-10 text-sm font-semibold text-white focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 focus:outline-none transition-all"
            >
              {TABS.map((tab) => (
                <option key={tab.id} value={tab.id} className="bg-ground-900 text-ink-hi">
                  {tab.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-ink-low">
              <Icon name="chevron-down" size={16} />
            </div>
          </div>
        </div>

        {/* Desktop: Tabs */}
        <div className="hidden md:flex items-center gap-2 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 border ${
                activeTab === tab.id
                  ? "bg-violet-600 border-violet-500 text-white shadow-glow"
                  : "bg-surface-2 shadow-clay-sm border-white/10 text-ink-low hover:text-white hover:border-white/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="w-full max-w-5xl mb-6">
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
            <Icon name="search" size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("leaderboard.searchPlaceholder")}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-10 pr-8 py-2.5 text-sm text-white placeholder-ink-faint focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink-faint hover:text-white transition-colors"
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="w-full max-w-5xl space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredEntries.length === 0 ? (
        <Card className="w-full max-w-md p-10 text-center my-6">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-xl border border-violet-500/30 bg-violet-500/15 text-violet-400 shadow-clay-sm">
            <Icon name="award" size={26} />
          </div>
          <h3 className="text-base font-bold text-white">{t("leaderboard.noRankings")}</h3>
          <p className="mt-2 text-sm text-ink-low">
            {searchQuery
              ? `No results for "${searchQuery}".`
              : activeTab === "all"
                ? t("leaderboard.noRankingsDesc")
                : `No one has attempted "${TABS.find((t) => t.id === activeTab)?.label}" yet.`}
          </p>
        </Card>
      ) : (
        <>
          {/* ── Mobile: Card Layout ── */}
          <div className="w-full max-w-5xl space-y-2.5 md:hidden">
            {filteredEntries.map((item, index) => {
              const rank = index + 1;
              const medal = getMedal(rank);
              const isYou = item.isCurrent;

              return (
                <div
                  key={item.id}
                  className={`lb-row flex items-center gap-3 rounded-xl px-4 py-3.5 border border-white/10 transition-all ${
                    rank <= 3
                      ? "bg-surface shadow-clay"
                      : "bg-surface-2 shadow-clay-sm"
                  } ${isYou ? "!bg-violet-500/[0.1] !border-violet-500/20" : ""}`}
                >
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center flex items-center justify-center">
                    {rank === 1 ? (
                      <LottieIcon src={crownLottie} size={26} fallbackIcon="crown" />
                    ) : medal ? (
                      <Icon name={medal} size={20} className={getRankColor(rank)} />
                    ) : (
                      <span className={`text-sm font-bold tabular-nums ${getRankColor(rank)}`}>{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar
                    avatarId={item.avatarId}
                    size={40}
                    name={item.userName}
                    className={`border-2 ${
                      rank === 1 ? "border-yellow-400" :
                      rank === 2 ? "border-slate-300" :
                      rank === 3 ? "border-gold-500" :
                      "border-white/10"
                    }`}
                  />

                  {/* Name + Quiz */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-semibold truncate ${rank <= 3 ? "text-white" : "text-ink"}`}>
                        {item.userName}
                      </span>
                      {isYou && (
                        <span className="shrink-0 rounded-full bg-sky/15 border border-sky/30 px-1.5 py-px text-[9px] font-bold uppercase text-sky">
                          {t("leaderboard.youBadge")}
                        </span>
                      )}
                    </div>
                    {activeTab === "all" && (
                      <p className="text-[11px] text-ink-faint mt-0.5 truncate">{t("leaderboard.allQuizzes")}</p>
                    )}
                  </div>

                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <span className={`text-sm font-bold tabular-nums ${rank <= 3 ? getRankColor(rank) : "text-violet-400"}`}>
                      {item.score}
                    </span>
                    <span className="ml-0.5 text-[9px] font-medium text-ink-faint uppercase">pts</span>
                  </div>
                </div>
              );
            })}

            {/* Mobile footer */}
            <div className="flex items-center justify-between px-2 pt-2">
              <span className="text-[11px] text-ink-faint">
                {filteredEntries.length} {filteredEntries.length === 1 ? t("leaderboard.entry") : t("leaderboard.entries")}
              </span>
              <span className="text-[11px] text-ink-faint">
                {activeTab === "all" ? t("leaderboard.allQuizzes") : TABS.find((t) => t.id === activeTab)?.label}
              </span>
            </div>
          </div>

          {/* ── Desktop: Table Layout ── */}
          <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-surface shadow-clay overflow-hidden hidden md:block">
            <table className="w-full text-left">

              {/* Header */}
              <thead>
                <tr className="border-b-2 border-white/10 bg-surface-2">
                  <th className="py-4 pl-7 pr-3 text-xs font-bold uppercase tracking-wider text-ink-low w-20">{t("leaderboard.rank")}</th>
                  <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-ink-low">{t("leaderboard.student")}</th>
                  {activeTab === "all" && (
                    <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-ink-low">{t("leaderboard.quizCol")}</th>
                  )}
                  <th className="py-4 pl-5 pr-7 text-xs font-bold uppercase tracking-wider text-ink-low text-right">{t("leaderboard.score")}</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {filteredEntries.map((item, index) => {
                  const rank = index + 1;
                  const medal = getMedal(rank);
                  const isYou = item.isCurrent;

                  return (
                    <tr
                      key={item.id}
                      className={`lb-row group transition-colors duration-150 border-b border-white/[0.06] last:border-b-0 ${
                        isYou
                          ? "bg-violet-500/10"
                          : index % 2 === 0
                            ? "bg-transparent"
                            : "bg-white/[0.015]"
                      } hover:bg-white/[0.05]`}
                    >
                      {/* Rank */}
                      <td className="py-5 pl-7 pr-3">
                        <div className="flex items-center gap-2">
                          {rank === 1 ? (
                            <LottieIcon src={crownLottie} size={30} fallbackIcon="crown" />
                          ) : medal ? (
                            <Icon name={medal} size={20} className={getRankColor(rank)} />
                          ) : (
                            <span className={`text-sm font-bold tabular-nums ${getRankColor(rank)}`}>{rank}</span>
                          )}
                        </div>
                      </td>

                      {/* Student */}
                      <td className="py-5 px-5">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Avatar
                            avatarId={item.avatarId}
                            size={40}
                            name={item.userName}
                            className={`border-2 ${
                              rank === 1 ? "border-yellow-400" :
                              rank === 2 ? "border-slate-300" :
                              rank === 3 ? "border-gold-500" :
                              "border-white/10"
                            }`}
                          />
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`text-[15px] font-semibold truncate ${rank <= 3 ? "text-white" : "text-ink"}`}>
                              {item.userName}
                            </span>
                            {isYou && (
                              <span className="shrink-0 rounded-full bg-sky/15 border border-sky/30 px-2 py-0.5 text-[10px] font-bold uppercase text-sky">
                                {t("leaderboard.youBadge")}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Quiz */}
                      {activeTab === "all" && (
                        <td className="py-5 px-5">
                          <span className="text-sm text-ink-low group-hover:text-ink transition-colors">
                            {t("leaderboard.allQuizzes")}
                          </span>
                        </td>
                      )}

                      {/* Score */}
                      <td className="py-5 pl-5 pr-7 text-right">
                        <span className={`text-base font-bold tabular-nums ${rank <= 3 ? getRankColor(rank) : "text-violet-400"}`}>
                          {item.score}
                        </span>
                        <span className="ml-1.5 text-[11px] font-medium text-ink-faint uppercase">pts</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Desktop footer */}
            <div className="border-t border-white/[0.06] bg-surface-2 px-7 py-3.5 flex items-center justify-between">
              <span className="text-xs font-medium text-ink-faint">
                {t("leaderboard.top")} {filteredEntries.length} {filteredEntries.length === 1 ? t("leaderboard.entry") : t("leaderboard.entries")}
              </span>
              <span className="text-xs font-medium text-ink-faint">
                {activeTab === "all" ? t("leaderboard.allQuizzes") : TABS.find((tab) => tab.id === activeTab)?.label}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
