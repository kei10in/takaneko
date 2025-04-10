// This bookmarklet script extracts the YouTube video thumbnail and opens it in a new tab.
(function () {
  const videoIdMatch = window.location.href.match(/v=([a-zA-Z0-9_-]{11})/);
  if (!videoIdMatch) {
    alert("This does not appear to be a valid YouTube video page.");
    return;
  }

  const videoId = videoIdMatch[1];
  const thumbnailUrl = `https://img.youtube.com/vi_webp/${videoId}/maxresdefault.webp`;

  // Open the thumbnail in a new tab
  window.open(thumbnailUrl, "_blank");
})();
