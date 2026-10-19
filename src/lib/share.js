/** Copies text to the clipboard. Returns false when the API is unavailable. */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* Clipboard access is blocked outside secure contexts / without permission. */
    return false;
  }
}

/** Absolute, shareable URL for a single post. */
export function postLink(postId) {
  return `${window.location.origin}/post/${postId}`;
}
