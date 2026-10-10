// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { revealTop } from "./reveal";

// The rule this file exists to protect: the page moves when the learner has
// lost the thing they were looking at, and otherwise it holds still. Getting
// that backwards is what made the course feel like it scrolled on its own.

const nodeAt = (top) => ({ getBoundingClientRect: () => ({ top }) });

describe("revealTop", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    window.scrollY = 400;
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  });

  it("leaves the page alone when the node is already in view", () => {
    revealTop(nodeAt(300));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("leaves the page alone when the node sits just under the header", () => {
    revealTop(nodeAt(72));
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls when the node has gone above the header", () => {
    revealTop(nodeAt(-260));
    // document position of the node, less the header it would otherwise hide under
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 68, behavior: "smooth" });
  });

  it("scrolls regardless when forced, for a layout that changed out from under them", () => {
    revealTop(nodeAt(900));
    expect(window.scrollTo).not.toHaveBeenCalled();
    revealTop(nodeAt(900), { force: true });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 1228, behavior: "smooth" });
  });

  it("never scrolls past the top of the document", () => {
    window.scrollY = 10;
    revealTop(nodeAt(-5), { force: true });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("jumps rather than animates for a reader who asked for less motion", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    revealTop(nodeAt(-100), { force: true });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 228, behavior: "auto" });
  });

  it("does nothing without a node, so a caller need not guard", () => {
    expect(() => revealTop(null)).not.toThrow();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
