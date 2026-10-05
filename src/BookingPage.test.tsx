// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("booking request", () => {
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
    await user.click(screen.getByRole("button", { name: "Send request" }));
    expect(document.activeElement).toBe(screen.getByLabelText("Your name"));
    expect(
      screen.getByLabelText("Your name").getAttribute("aria-invalid"),
    ).toBe("true");
    expect(
      screen.getByLabelText("Phone").getAttribute("aria-describedby"),
    ).toBe("phone-error");
    await user.type(screen.getByLabelText("Your name"), "Taylor");
    await user.type(screen.getByLabelText("Phone"), "letters");
    await user.click(screen.getByRole("button", { name: "Send request" }));
    expect(document.activeElement).toBe(screen.getByLabelText("Phone"));
    expect(
      screen.queryByRole("heading", { name: "Request sent." }),
    ).toBeNull();
  });

  it("sends escaped values and lets the visitor start another request", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    render(<BookingPage service="Boilers" />);
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Taylor" } });
    fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "(206) 555-0123" } });
    fireEvent.change(screen.getByLabelText("What is going on?"), { target: { value: "<script>alert(1)</script>" } });
    await user.click(screen.getByLabelText("Today"));
    await user.click(screen.getByLabelText("Afternoon"));
    await user.click(screen.getByRole("button", { name: "Send request" }));
    await screen.findByRole("heading", { name: "Request sent." });
    expect(fetch).toHaveBeenCalledOnce();
    const [, init] = fetch.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.message).toBe("<script>alert(1)</script>");
    expect(body.urgency).toBe("Today");
    expect(body.companyWebsite).toBe("");
    expect(screen.getByText("<script>alert(1)</script>")).toBeDefined();
    expect(document.querySelector("script")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { name: "Request sent." }),
    );
    expect(screen.getByText("Boilers", { selector: "dd" })).toBeDefined();
    expect(screen.getByText("Today", { selector: "dd" })).toBeDefined();
    expect(screen.getByText("Afternoon", { selector: "dd" })).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Send another request" }));
    expect(screen.getByLabelText("Your name")).toBeDefined();
    expect(
      screen.queryByRole("heading", { name: "Request sent." }),
    ).toBeNull();
  });

  it("shows a retry message when delivery fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("failure", { status: 502 })),
    );
    const user = userEvent.setup();
    render(<BookingPage />);
    await user.type(screen.getByLabelText("Your name"), "Taylor");
    await user.type(screen.getByLabelText("Phone"), "(206) 555-0123");
    await user.click(screen.getByRole("button", { name: "Send request" }));
    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch(/could not send/),
    );
    expect(
      (screen.getByRole("button", { name: "Send request" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
  });
});
