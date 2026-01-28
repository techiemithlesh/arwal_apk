// utils/validators.js

// ✅ Helper: format field names nicely
const formatField = (field) =>
  field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

// ✅ Generic validator runner
export const validateForm = (formData, rules) => {
  const errors = {};
  for (const field in rules) {
    const value = formData[field] || "";
    const fieldRules = rules[field];

    if (fieldRules.required && !value.trim()) {
      errors[field] = fieldRules.requiredMessage || `${formatField(field)} is required.`;
      continue;
    }

    if (fieldRules.regex && !fieldRules.regex.test(value)) {
      errors[field] = fieldRules.regexMessage || `${formatField(field)} format is invalid.`;
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = fieldRules.minLengthMessage || `${formatField(field)} must be at least ${fieldRules.minLength} characters.`;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = fieldRules.maxLengthMessage || `${formatField(field)} must be no more than ${fieldRules.maxLength} characters.`;
    }
  }
  return errors;
};

// ✅ Common field validators
export const validateRequired = (value, fieldName) => {
  if (!value?.trim()) return `${fieldName} is required`;
  return "";
};

export const validateEmail = (email) => {
  if (!email.trim()) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validateUsername = (username) => {
  if (!username) {
    return "Username is required";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }
  return "";
};

export const validatePhone = (phone) => {
  if (!phone.trim()) return "Phone number is required";
  const regex = /^[0-9]{10}$/;
  return regex.test(phone) ? "" : "Phone number must be 10 digits";
};

export const validatePincode = (pincode) => {
  if (!pincode.trim()) return "Pincode is required";
  const regex = /^[0-9]{6}$/;
  return regex.test(pincode) ? "" : "Pincode must be 6 digits";
};

// ✅ Generic date validator
export const validatePastDate = (dateStr, fieldName = "Date") => {
  if (!dateStr.trim()) return `${fieldName} is required`;

  let inputDate;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    inputDate = new Date(dateStr);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [d, m, y] = dateStr.split("/");
    inputDate = new Date(y, m - 1, d);
  } else {
    inputDate = new Date(dateStr);
  }

  if (isNaN(inputDate.getTime())) return `Invalid ${fieldName} format`;
  if (inputDate > new Date()) return `${fieldName} cannot be in the future`;

  return "";
};



