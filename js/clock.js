(function () {
  const el = document.getElementById("clockWidget");
  if (!el) return;

  const MONTHS = ["JAN","FEB","MAR","APR","MAY","JUN",
                  "JUL","AUG","SEP","OCT","NOV","DEC"];

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const d = new Date();
    const month = MONTHS[d.getMonth()];
    const day   = pad(d.getDate());
    const rawH  = d.getHours();
    const ampm  = rawH >= 12 ? "PM" : "AM";
    const hour  = pad(rawH % 12 || 12);
    const min   = pad(d.getMinutes());
    const sec   = pad(d.getSeconds());
    el.textContent = `${month} ${day} \u00B7 ${hour}:${min}:${sec} ${ampm}`;
  }

  tick();
  setInterval(tick, 1000);
})();
