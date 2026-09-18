const resolveCardId = (body) => {
  const value = body?.card_id ?? body?.cardId;

  if (typeof value !== "string") {
    return null;
  }

  const normalizedCardId = value.trim().toUpperCase();

  return normalizedCardId || null;
};

module.exports = { resolveCardId };
