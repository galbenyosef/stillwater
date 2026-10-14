// index-inline-1 01 — event
// Lines 2-11 of readable/index-inline-1.pretty.js (statement-aligned).
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
