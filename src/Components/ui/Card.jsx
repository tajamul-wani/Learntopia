import { forwardRef } from "react";

// Clay surface card. Set `hoverable` for the lift-on-hover interaction used by
// clickable cards (courses, quizzes). Surface + clay shadow come from `.glass`.

// Ref-forwarding so a caller can scroll a card into view — My Profile moves the
// learner to a course it has just paused, which needs the node itself.
const Card = forwardRef(({ hoverable = false, className = "", children, ...rest }, ref) => (
  <div
    ref={ref}
    className={`glass rounded-2xl transition-all duration-300
      ${hoverable ? "cursor-pointer hover:-translate-y-1.5 hover:border-violet-500/35 hover:bg-surface-2" : ""}
      ${className}`}
    {...rest}
  >
    {children}
  </div>
));

Card.displayName = "Card";

export default Card;
