import Icon from "./ui/Icon";
import { courseFacts } from "../utils/courseFacts";
import { useLanguage } from "../context/LanguageContext";

/**
 * The four things worth knowing before starting a course, as a meta line.
 *
 * These used to be four bordered tiles with filled icon chips. That outweighed
 * the title, the description and the button a learner is actually deciding on,
 * and on a phone it ate roughly a third of the first screen. They are
 * supporting facts, so they now read like a byline under a headline — which is
 * also what the catalog cards already do, so the course page matches the rest
 * of the app instead of carrying a treatment of its own.
 *
 * Every value is counted from the course itself (see utils/courseFacts.js) and
 * is written to stand alone: "4 modules" rather than a 4 with a MODULES label
 * beneath it. That is what lets the chrome go.
 */
const CourseFacts = ({ course, className = "" }) => {
  const { t } = useLanguage();
  const facts = courseFacts(course);

  const items = [
    { icon: "book-open", value: t("courses.moduleCount", { count: facts.modules }) },
    { icon: "clock", value: facts.duration },
    { icon: "bar-chart", value: facts.difficulty },
    { icon: "zap", value: facts.xp ? `${facts.xp} XP` : "" },
  ].filter((item) => item.value);

  if (items.length === 0) return null;

  return (
    <div
      // One row is the default at every width. Only below 500px, where the four
      // facts cannot share a line and a wrapping row strands the fourth on its
      // own, does it become a two-column grid that pairs them evenly. Items sit
      // at the start of their column so they line up with the description above;
      // a caller whose heading is centred passes justify-items-center back.
      className={`flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm font-semibold text-ink max-[499px]:grid max-[499px]:grid-cols-2 max-[499px]:justify-items-start max-[499px]:gap-x-4 max-[499px]:gap-y-3 sm:gap-x-6 sm:text-[0.9375rem] ${className}`}
    >
      {items.map((item) => (
        // items-center on the row and the item, with a fixed-size mark, is what
        // keeps the glyph on the same line as its text at every type size.
        <span key={item.icon} className="inline-flex items-center gap-2">
          <Icon name={item.icon} size={17} className="flex-none text-violet-400" />
          {item.value}
        </span>
      ))}
    </div>
  );
};

export default CourseFacts;
