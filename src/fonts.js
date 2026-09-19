// Brand fonts, served with the app instead of from Google Fonts.
//
// The Google Fonts stylesheet was render-blocking: when fonts.googleapis.com was
// slow or unreachable (school networks, filters, a flaky connection), the app's
// scripts waited on it and learners were left on the splash screen. Bundling the
// files also stops every visit from sending the learner's IP address to Google.
//
// Exactly the weights the app used from Google: Poppins 400-800 (body, UI) and
// Fredoka 500-700 (headings, via `font-display`). Each file only downloads when a
// page uses that character set (unicode-range), and uses font-display: swap.
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
