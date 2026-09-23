// @vitest-environment jsdom
import { test, expect, describe, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IdentityPrompt from "./IdentityPrompt";

// The first component test in the project. It renders the real component with
// its collaborators stubbed, which is the point: no browser, no Firestore, no
// sign-in — just "given this state, what does a learner see, and what happens
// when they answer?"

const skipIdentityChoice = vi.fn();
const navigate = vi.fn();
let needsIdentityChoice = true;

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ needsIdentityChoice, skipIdentityChoice }),
}));
vi.mock("../context/LanguageContext", () => ({
  // Render the key itself: the test is about behaviour, not copy, and this way
  // it cannot break when wording changes.
  useLanguage: () => ({ t: (key) => key }),
}));
vi.mock("../context/ToastContext", () => ({
  toast: { profileSaved: vi.fn(), error: vi.fn() },
}));
vi.mock("react-router-dom", () => ({ useNavigate: () => navigate }));

beforeEach(() => {
  vi.clearAllMocks();
  needsIdentityChoice = true;
});

describe("IdentityPrompt", () => {
  test("offers both answers when the learner has never chosen", () => {
    render(<IdentityPrompt />);
    expect(screen.getByText("identityPrompt.title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "identityPrompt.choose" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "identityPrompt.skip" })).toBeInTheDocument();
  });

  test("shows nothing to a learner who already chose", () => {
    needsIdentityChoice = false;
    const { container } = render(<IdentityPrompt />);
    expect(container).toBeEmptyDOMElement();
  });

  test("skipping records the choice", async () => {
    render(<IdentityPrompt />);
    await userEvent.click(screen.getByRole("button", { name: "identityPrompt.skip" }));
    expect(skipIdentityChoice).toHaveBeenCalledTimes(1);
  });

  test("choosing opens the profile editor and answers nothing", async () => {
    render(<IdentityPrompt />);
    await userEvent.click(screen.getByRole("button", { name: "identityPrompt.choose" }));
    expect(navigate).toHaveBeenCalledWith("/dashboard?edit=profile");
    expect(skipIdentityChoice, "choosing must not silently skip").not.toHaveBeenCalled();
  });

  // Closing the dialog is not an answer: the profile is untouched, so the
  // question comes back next visit rather than being decided for them.
  test("dismissing answers nothing and leaves the profile alone", async () => {
    render(<IdentityPrompt />);
    await userEvent.click(screen.getByRole("button", { name: "common.close" }));
    expect(skipIdentityChoice).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
