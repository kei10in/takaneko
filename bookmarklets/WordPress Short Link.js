(function () {
  var shortlink = document.querySelector('link[rel="shortlink"]');
  if (shortlink) {
    var url = shortlink.href;
    navigator.clipboard.writeText(url).catch(function (err) {
      console.error("Failed to copy shortlink: ", err);
    });
  }
})();
