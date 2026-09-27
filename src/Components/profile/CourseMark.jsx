import Icon from "../ui/Icon";
import { courseTint } from "../../utils/courseTint";
import { COURSES } from "../../data/coursesData";

/**
 * The small tinted square that stands for a course in a list.
 *
 * Both the colour and the icon come from the course itself — `courseTint` keys
 * off the course id so a course keeps its colour everywhere it appears, and the
 * icon is the one its completion badge already uses. Nothing here is chosen per
 * list, so the same course never looks like two different things.
 */
const CourseMark = ({ courseId, size = "md" }) => {
  const course = COURSES.find((c) => String(c.id) === String(courseId));
  const box = size === "sm" ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-2xl";

  return (
    <span
      className={`grid flex-none place-items-center text-ink-hi ${box} ${courseTint(course)}`}
      aria-hidden="true"
    >
      <Icon name={course?.badge?.icon || "book-open"} size={size === "sm" ? 17 : 20} />
    </span>
  );
};

export default CourseMark;
