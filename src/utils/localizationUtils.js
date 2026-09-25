/**
 * Helper utilities to dynamically localize Course and Quiz data objects
 * based on the current active language in LanguageContext (t function).
 *
 * t(path) returns the translated string, or the key path itself if the key is
 * missing. We use that to fall back to the original English value when a
 * translation hasn't been provided yet.
 *
 * IMPORTANT — answer matching:
 * Quizzes and MCQ exercises compare the user's selected option against the
 * `correctAnswer`/`answer` STRING. So when options are translated, the correct
 * answer must be the SAME translated string. We never translate the answer
 * independently: we find the original answer's index in the original options
 * and reuse the translated option at that index. This makes answer matching
 * impossible to break via a mismatched translation.
 */

// Build a resolver bound to the active t(). Returns the translation, or the
// provided fallback when the key is missing (t returns the key path unchanged).
const makeResolve = (t) => (key, fallback) => {
  const result = t(key);
  return result === key ? fallback : result;
};

export const getLocalizedCourse = (course, t) => {
  if (!course || !t) return course;
  const cId = course.id;
  const resolve = makeResolve(t);

  const title = resolve(`courseData.${cId}.title`, course.title);
  const desc = resolve(`courseData.${cId}.desc`, course.desc);
  const category = resolve(`courseData.${cId}.category`, course.category);
  const difficulty = resolve(`courseData.${cId}.difficulty`, course.difficulty);

  const syllabus = (course.syllabus || []).map((m, mIdx) => {
    const mBase = `courseData.${cId}.modules.${mIdx}`;

    const contentSections = (m.contentSections || []).map((s, sIdx) => ({
      ...s,
      title: resolve(`${mBase}.contentSections.${sIdx}.title`, s.title),
      content: resolve(`${mBase}.contentSections.${sIdx}.content`, s.content),
    }));

    const exercises = (m.exercises || []).map((ex, eIdx) => {
      const exBase = `${mBase}.exercises.${eIdx}`;
      const localized = { ...ex, question: resolve(`${exBase}.question`, ex.question) };

      if (Array.isArray(ex.options)) {
        // MCQ: translate options in order, then re-derive the answer by index so
        // the correct answer always matches one of the translated options.
        const options = ex.options.map((o, oIdx) => resolve(`${exBase}.options.${oIdx}`, o));
        localized.options = options;
        if (typeof ex.answer === "string") {
          const aIdx = ex.options.indexOf(ex.answer);
          localized.answer = aIdx >= 0 ? options[aIdx] : resolve(`${exBase}.answer`, ex.answer);
        }
      } else if (Array.isArray(ex.pairs)) {
        localized.pairs = ex.pairs.map((p, pIdx) => ({
          ...p,
          term: resolve(`${exBase}.pairs.${pIdx}.term`, p.term),
          definition: resolve(`${exBase}.pairs.${pIdx}.definition`, p.definition),
        }));
      } else if (typeof ex.answer === "string") {
        // fill-blank: answer is free text (true/false answers are booleans — left as-is)
        localized.answer = resolve(`${exBase}.answer`, ex.answer);
      }

      return localized;
    });

    return {
      ...m,
      title: resolve(`${mBase}.title`, m.title),
      desc: resolve(`${mBase}.desc`, m.desc),
      contentSections,
      exercises,
    };
  });

  const learningObjectives = (course.learningObjectives || []).map((obj, i) =>
    resolve(`courseData.${cId}.learningObjectives.${i}`, obj)
  );
  const prerequisites = (course.prerequisites || []).map((req, i) =>
    resolve(`courseData.${cId}.prerequisites.${i}`, req)
  );
  return {
    ...course,
    title,
    desc,
    category,
    difficulty,
    learningObjectives,
    prerequisites,
    syllabus,
  };
};

export const getLocalizedQuiz = (quiz, t) => {
  if (!quiz || !t) return quiz;
  const qId = quiz.id;
  const resolve = makeResolve(t);

  const title = resolve(`quizzesData.${qId}.title`, quiz.title);
  const description = resolve(`quizzesData.${qId}.description`, quiz.description);
  const subject = resolve(`quizzesData.${qId}.subject`, quiz.subject);

  const questions = (quiz.questions || []).map((q, qIdx) => {
    const base = `quizzesData.${qId}.questions.${qIdx}`;
    const questionText = resolve(`${base}.questionText`, q.questionText);
    const options = (q.options || []).map((opt, oIdx) => resolve(`${base}.options.${oIdx}`, opt));
    // Re-derive correctAnswer by index so it always matches a translated option.
    const correctIdx = (q.options || []).indexOf(q.correctAnswer);
    const correctAnswer = correctIdx >= 0 ? options[correctIdx] : q.correctAnswer;
    return { ...q, questionText, options, correctAnswer };
  });

  return { ...quiz, title, description, subject, questions };
};
