(function () {
  const videoId = new URL(location.href).searchParams.get("v");
  if (!videoId) {
    alert("This bookmarklet only works on YouTube video pages.");
    return;
  }

  const info = document.querySelector(
    "#container #info #info-text #info-strings yt-formatted-string",
  );
  if (!info) {
    alert("Could not find the third child element with the published date.");
    return;
  }

  const publishedAt = info.textContent.trim();
  const formattedPublishedAt = publishedAt.replace(/\//g, "-");

  const data =
    `{\n` +
    `  videoId: "${videoId}",\n` +
    `  publishedAt: "${formattedPublishedAt}",\n` +
    `  presents: [],\n` +
    `},`;

  navigator.clipboard.writeText(data).catch((err) => {
    alert("Failed to copy data to clipboard.");
    console.error(err);
  });
})();
