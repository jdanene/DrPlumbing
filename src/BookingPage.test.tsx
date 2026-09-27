// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import BookingPage from "./BookingPage";
import { validateBooking } from "./booking";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("booking validation", () => {
  it("requires a nonblank name and rejects short, alphabetic, and excessive numbers", () => {
    expect(validateBooking(" ", "")).toEqual({
      name: "Enter your name.",
      phone: "Enter a phone number we can call.",
    });
    for (const phone of ["1234567", "abcdefghij", "1234567890123456"])
      expect(validateBooking("Taylor", phone).phone).toBeDefined();
  });
  it("accepts formatted US and international callback numbers", () => {
    expect(validateBooking("Taylor", "(206) 555-0123")).toEqual({});
    expect(validateBooking("Taylor", "+44 20 7946 0958")).toEqual({});
  });
});

describe("booking preview", () => {
  it("starts with the requested service and defaults unknown services to Not sure", () => {
    const { unmount } = render(<BookingPage service="Water heaters" />);
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe(
      "Water heaters",
    );
    unmount();
    render(<BookingPage service="Unknown" />);
    expect((screen.getByLabelText("Service") as HTMLSelectElement).value).toBe(
      "Not sure",
    );
  });

  it("links validation errors to inputs and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    render(<BookingPage />);
    await user.click(screen.getByRole("button", { name: "Preview request" }));
    expect(document.activeElement).toBe(screen.getByLabelText("Your name"));
    expect(
      screen.getByLabelText("Your name").getAttribute("aria-invalid"),
    ).toBe("true");
    expect(
      screen.getByLabelText("Phone").getAttribute("aria-describedby"),
    ).toBe("phone-error");
    await user.type(screen.getByLabelText("Your name"), "Taylor");
    await user.type(screen.getByLabelText("Phone"), "letters");
    await user.click(screen.getByRole("button", { name: "Preview request" }));
    expect(document.activeElement).toBe(screen.getByLabelText("Phone"));
    expect(
      screen.queryByRole("heading", { name: "Request preview." }),
    ).toBeNull();
  });

  it("previews escaped values without claiming submission and preserves them for editing", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    render(<BookingPage service="Boilers" />);
    await user.type(screen.getByLabelText("Your name"), "Taylor");
    await user.type(screen.getByLabelText("Phone"), "(206) 555-0123");
    await user.type(
      screen.getByLabelText("What is going on?"),
      "<script>alert(1)</script>",
    );
    await user.click(screen.getByLabelText("Afternoon"));
    await user.click(screen.getByRole("button", { name: "Preview request" }));
    expect(screen.getByText(/Nothing was sent or booked/)).toBeDefined();
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.getByText("<script>alert(1)</script>")).toBeDefined();
    expect(document.querySelector("script")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { name: "Request preview." }),
    );
    expect(screen.getByText("Boilers", { selector: "dd" })).toBeDefined();
    expect(screen.getByText("Afternoon", { selector: "dd" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Edit request" }));
    expect((screen.getByLabelText("Your name") as HTMLInputElement).value).toBe(
      "Taylor",
    );
    expect(
      (screen.getByLabelText("What is going on?") as HTMLTextAreaElement).value,
    ).toBe("<script>alert(1)</script>");
    expect(
      screen.queryByRole("heading", { name: "Request preview." }),
    ).toBeNull();
  });
});
