export type BookingErrors = { name?: string; phone?: string };

/**
 * Description: Rejects missing names and phone numbers that cannot support a callback.
 * Inputs: name and phone are untrusted form text; formatting spaces and punctuation are allowed.
 * Output: Field errors; an empty object means the local preview may be shown. No network calls.
 * Examples: BookingPage.test.tsx covers blanks, alphabetic numbers, formatted US numbers, and international numbers.
 */
export function validateBooking(name: string, phone: string): BookingErrors {
  const errors: BookingErrors = {};
  if (!name.trim()) errors.name = "Enter your name.";
  const digits = phone.replace(/\D/g, "");
  if (
    !/^[+\d\s().-]+$/.test(phone.trim()) ||
    digits.length < 10 ||
    digits.length > 15
  ) {
    errors.phone = "Enter a phone number we can call.";
  }
  return errors;
}
