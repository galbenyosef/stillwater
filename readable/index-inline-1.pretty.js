// Keep recovery available even if the application bundle cannot download.
window.addEventListener(
  "error",
  (event) => {
    if (event.target?.tagName !== "SCRIPT") return;
    document.getElementById("error-message").textContent =
      "Stillwater could not start. Check your connection, then try again.";
    document.getElementById("error").hidden = false;
  },
  true,
);
