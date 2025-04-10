(function () {
  const imgElement = document.getElementById("thumbnail")?.querySelector("#img");
  const titleElement = document
    .querySelector("ytmusic-player-bar")
    ?.querySelector(".content-info-wrapper  yt-formatted-string");
  const baseName =
    titleElement
      ?.getAttribute("title")
      ?.replace(/[\\/:*?"<>|]/g, "_")
      .trim() || "noname";
  navigator.clipboard.writeText(`${baseName}`).catch(function (err) {
    console.error("Failed to copy shortlink: ", err);
  });
  if (imgElement && imgElement.src) {
    const newUrl = imgElement.src.replace(/=w\d+-h\d+-l\d+-r\w+$/, "=w800-h800-l95-rw");
    window.open(newUrl, "_blank");
  } else {
    alert("画像要素が見つからないか、URLが正しくありません。");
  }
})();
