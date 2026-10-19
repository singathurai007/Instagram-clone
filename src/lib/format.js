/**
 * Small presentation helpers shared by the feed components.
 */

/** 1234 -> "1,234" */
export function formatNumber(value) {
  return Number(value ?? 0).toLocaleString("en-US");
}

/** 1234 -> "1.2K", 1_200_000 -> "1.2M" */
export function formatCompact(value) {
  const count = Number(value ?? 0);

  if (count < 1000) {
    return formatNumber(count);
  }

  const units = [
    { limit: 1_000_000_000, suffix: "B" },
    { limit: 1_000_000, suffix: "M" },
    { limit: 1000, suffix: "K" }
  ];

  const unit = units.find((item) => count >= item.limit);
  const short = (count / unit.limit).toFixed(1);

  return `${short.endsWith(".0") ? short.slice(0, -2) : short}${unit.suffix}`;
}

/** "100 likes" / "1 like" / "Be the first to like this" */
export function formatLikes(count) {
  if (!count) {
    return "Be the first to like this";
  }

  return `${formatNumber(count)} ${count === 1 ? "like" : "likes"}`;
}

/** "No comments" / "1 comment" / "4 comments" */
export function formatComments(count) {
  if (!count) {
    return "No comments";
  }

  return `${count} ${count === 1 ? "comment" : "comments"}`;
}

/** Turns an ISO timestamp into "3h ago" style text. */
export function formatRelativeTime(isoDate) {
  if (!isoDate) {
    return "";
  }

  const elapsed = Date.now() - new Date(isoDate).getTime();

  if (Number.isNaN(elapsed)) {
    return "";
  }

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (elapsed < minute) {
    return "just now";
  }

  if (elapsed < hour) {
    return `${Math.floor(elapsed / minute)}m ago`;
  }

  if (elapsed < day) {
    return `${Math.floor(elapsed / hour)}h ago`;
  }

  if (elapsed < week) {
    return `${Math.floor(elapsed / day)}d ago`;
  }

  return `${Math.floor(elapsed / week)}w ago`;
}
