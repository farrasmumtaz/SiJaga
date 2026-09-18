const { resolveCardId } = require("./cardId");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeUserId = (value) => {
  const userId = Number(value);

  if (!Number.isSafeInteger(userId) || userId <= 0) {
    throw new Error("Invalid user ID.");
  }

  return userId;
};

const normalizeProfileInput = (body) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Profile data is required.");
  }

  const profile = {};

  if (Object.hasOwn(body, "name")) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      throw new Error("Name must contain at least 2 characters.");
    }

    profile.name = body.name.trim();
  }

  if (Object.hasOwn(body, "email")) {
    if (typeof body.email !== "string" || !EMAIL_PATTERN.test(body.email.trim())) {
      throw new Error("A valid email is required.");
    }

    profile.email = body.email.trim().toLowerCase();
  }

  if (Object.hasOwn(body, "cardId") || Object.hasOwn(body, "card_id")) {
    const cardId = resolveCardId(body);

    if (!cardId) {
      throw new Error("A valid Card ID is required.");
    }

    profile.card_id = cardId;
  }

  if (Object.keys(profile).length === 0) {
    throw new Error("At least one profile field is required.");
  }

  return profile;
};

module.exports = {
  normalizeProfileInput,
  normalizeUserId,
};
