import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { setDoc, doc, addDoc, collection, updateDoc, increment, getDoc, deleteField } from "firebase/firestore";
import { toast } from "../context/ToastContext";
import Card from "../Components/ui/Card";
import Button from "../Components/ui/Button";
import Field from "../Components/ui/Field";
import Icon from "../Components/ui/Icon";
import ImageWithSkeleton from "../Components/ui/ImageWithSkeleton";
import google from "../assets/Icons/google.png";
import signIn from "../assets/Icons/signIn.png";
import signUpImage from "../assets/Icons/auth-image.jpg";
import { publicNameFor } from "../utils/publicName";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleSignIn, currentUser } = useAuth();
  const { t } = useLanguage();

  const returnTo = location.state?.returnTo || "/dashboard";

  useEffect(() => {
    if (currentUser) {
      navigate(returnTo, { replace: true });
    }
  }, [currentUser, navigate, returnTo]);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userEmail, setUserEmail] = useState(location.state?.email || "");
  const [userPassword, setUserPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFoundEmail, setNotFoundEmail] = useState(null);

  useEffect(() => {
    if (location.state?.email) {
      setUserEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handlePendingQuizResult = async (user, userDisplayName) => {
    if (location.state?.pendingQuizResult) {
      try {
        const { quizId, quizTitle, score, totalQuestions } = location.state.pendingQuizResult;
        const attempt = {
          quizId,
          quizTitle,
          score,
          totalQuestions,
          completedAt: new Date(),
        };
        await addDoc(collection(db, "Users", user.uid, "quizAttempts"), attempt);

        const pointsEarned = score * 10;
        if (pointsEarned > 0) {
          await updateDoc(doc(db, "Users", user.uid), {
            totalPoints: increment(pointsEarned)
          });

          // Display data only, written whole: the quiz board never carries a
          // real account name, and the rules reject any other shape.
          const globalScoreRef = doc(db, "QuizLeaderboards", quizId, "Scores", user.uid);
          await setDoc(globalScoreRef, {
            userId: user.uid,
            displayName: userDisplayName || "Learner",
            avatarId: "",
            score: pointsEarned,
            rawScore: score,
            totalQuestions,
            completedAt: new Date(),
          });

          const userSnap = await getDoc(doc(db, "Users", user.uid));
          if (userSnap.exists()) {
            const uData = userSnap.data();
            const publicRef = doc(db, "PublicLeaderboard", user.uid);
            await setDoc(publicRef, {
              uid: user.uid,
              // Never the account name: their chosen name, or a nickname.
              displayName: publicNameFor(uData),
              fullName: deleteField(),
              totalPoints: (uData.totalPoints || 0) + pointsEarned,
              updatedAt: new Date()
            }, { merge: true });
          }
        }
      } catch (err) {
        console.error("Error saving pending quiz score:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
      const user = userCredential.user;
      await handlePendingQuizResult(user, null);
      toast.login(t("toasts.loginSuccess"));
      navigate(returnTo, { replace: true });
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setNotFoundEmail(userEmail);
        toast.info(t("toasts.noAccount"), { autoClose: 3000 });
      } else if (err.code === "auth/wrong-password") {
        toast.error(t("toasts.wrongPassword"));
      } else if (err.code === "auth/invalid-email") {
        toast.error(t("toasts.invalidEmail"));
      } else {
        toast.error(t("toasts.invalidCredentials"));
      }
      setUserPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await googleSignIn();
      if (user) {
        await handlePendingQuizResult(user, user.displayName);
      }
      toast.login(t("toasts.loginGoogleSuccess"));
      navigate(returnTo, { replace: true });
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error(t("toasts.googleFailed"));
    }
  };

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center py-12">
      {/* Account Not Found Smart Guidance Modal */}
      {notFoundEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-md p-6 border-violet-500/30">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400">
              <Icon name="alert-circle" size={24} />
            </div>
            <h3 className="text-xl font-bold text-ink-hi mb-2">{t("authGuidance.noAccountTitle")}</h3>
            <p className="text-sm text-ink-low leading-relaxed mb-6">
              {t("authGuidance.noAccountMsg", { email: notFoundEmail })}
            </p>

            <div className="flex flex-col gap-3">
              <Button
                fullWidth
                onClick={() => {
                  const emailToPass = notFoundEmail;
                  setNotFoundEmail(null);
                  navigate("/signUp", { state: { email: emailToPass, returnTo } });
                }}
              >
                {t("authGuidance.createAccountBtn")}
              </Button>
              <button
                type="button"
                onClick={() => setNotFoundEmail(null)}
                className="w-full rounded-xl border border-white/10 bg-surface-2 shadow-clay-sm py-2.5 text-xs font-semibold text-ink-low transition-colors hover:bg-surface-3 hover:text-ink-hi"
              >
                {t("common.cancel")}
              </button>
            </div>
          </Card>
        </div>
      )}

      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        {/* Banner */}
        <div className="relative hidden aspect-[4/5] max-h-[560px] overflow-hidden rounded-3xl border border-white/10 shadow-clay lg:block">
          <ImageWithSkeleton src={signUpImage} alt="" imgClassName="h-full w-full object-cover transition-opacity duration-500" />
          
          {/* Overlay and Text */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
          <div className="absolute left-6 top-8 right-6 z-20">
            <h3 className="text-3xl font-extrabold leading-tight text-white drop-shadow-md">
              Let us learn <br /> something new
            </h3>
          </div>
        </div>

        {/* Form */}
        <Card className="w-full p-6 md:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <img src={signIn} alt="" className="mb-2 max-w-[56px]" />
            <h2 className="text-2xl font-extrabold text-ink-hi md:text-3xl">{t("auth.loginTitle")}</h2>
            <p className="mt-1 text-sm text-ink-low">
              {t("auth.loginSubtitle")}
            </p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Field
              label={t("auth.emailLabel")}
              id="email"
              type="email"
              icon="mail"
              placeholder="name@example.com"
              required
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />

            <Field
              label={t("auth.passwordLabel")}
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={6}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((v) => !v)}
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  className="grid h-9 w-9 place-items-center rounded-lg text-ink-low transition-colors hover:text-ink-hi"
                >
                  <Icon name={isPasswordVisible ? "eye-off" : "eye"} size={18} />
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs text-ink">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 rounded accent-violet-600"
                />
                Remember me
              </label>
              <Link to="/" className="text-sky transition-colors hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" fullWidth loading={loading} className="mt-1">
              {loading ? "..." : t("nav.login")}
            </Button>
          </form>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-surface-2 shadow-clay-sm py-3 text-sm font-semibold text-ink-hi transition-colors hover:bg-surface-3"
          >
            <img src={google} alt="" className="h-5 w-5" />
            {t("auth.googleAuth")}
          </button>

          <p className="mt-6 text-center text-xs text-ink-low">
            {t("auth.dontHaveAccount")}{" "}
            <Link
              to="/signUp"
              state={{ returnTo }}
              className="font-semibold text-sky transition-colors hover:underline"
            >
              {t("auth.registerHere")}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
