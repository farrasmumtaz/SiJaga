const resolveCardId = (body) => {
  const value = body?.card_id ?? body?.cardId;

  if (typeof value !== "string") {
    return null;
  }

  const normalizedCardId = value.trim().toUpperCase();

  return normalizedCardId || null;
};

const resolveCardScanId = (body) => {
  const value = body?.card_scan_id ?? body?.cardScanId;
  const scanId = Number(value);

  if (!Number.isSafeInteger(scanId) || scanId <= 0) {
    return null;
  }

  return scanId;
};

module.exports = { resolveCardId, resolveCardScanId };
