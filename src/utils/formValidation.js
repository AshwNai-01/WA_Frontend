// Same rules as the backend (WA_Backend/utils/validators.js), checked before
// sending so people see mistakes instantly. The server still validates everything.

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MOBILE_REGEX = /^\+?\d{10,14}$/;

export const isValidEmail = (value) => EMAIL_REGEX.test(value.trim());
export const isValidMobile = (value) => MOBILE_REGEX.test(value.replace(/[\s-]/g, ""));

// Today as "YYYY-MM-DD" in the visitor's own timezone (for <input type="date" min>)
export const todayLocal = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

// Rules shared by the quote and contact forms. Returns { field: "message" } for each problem.
export function validateCommon({ name, email, mobile, consent }) {
  const errors = {};
  if (!name.trim()) errors.name = "Enter your name";
  else if (name.trim().length > 60) errors.name = "Name must be at most 60 characters";

  if (!mobile.trim()) errors.mobile = "Enter your mobile number";
  else if (!isValidMobile(mobile)) errors.mobile = "Enter a valid mobile number, e.g. 9876543210";

  if (!email.trim()) errors.email = "Enter your email";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email, e.g. name@example.com";

  if (!consent) errors.consent = "Please accept to continue";
  return errors;
}
