(function () {
  const statusEl = document.getElementById("weatherStatus");
  if (!statusEl) return;

  function weatherCodeToUi(code) {
    if (code === 0) return ["☀️", "Clear"];
    if ([1, 2, 3].includes(code)) return ["⛅️", "Partly cloudy"];
    if ([45, 48].includes(code)) return ["🌫️", "Fog"];
    if ([51, 53, 55, 56, 57].includes(code)) return ["🌦️", "Drizzle"];
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return ["🌧️", "Rain"];
    if ([71, 73, 75, 77, 85, 86].includes(code)) return ["❄️", "Snow"];
    if ([95, 96, 99].includes(code)) return ["⛈️", "Thunderstorm"];
    return ["🌤️", "Weather"];
  }

  function showError(msg) {
    statusEl.textContent = msg;
  }

  if (!navigator.geolocation) {
    showError("Location unavailable");
    return;
  }

  const loadingGuard = setTimeout(() => {
    showError("Enable location");
  }, 35000);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const [weatherRes, geoRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`),
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
        ]);

        if (!weatherRes.ok) throw new Error("Weather request failed");

        const data = await weatherRes.json();
        const geoData = await geoRes.json();

        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const [emoji, label] = weatherCodeToUi(code);

        const city = geoData.city || geoData.locality || "";
        const rawCode = geoData.principalSubdivisionCode || "";
        const state = rawCode.includes("-") ? rawCode.split("-").pop() : rawCode;
        const location = city ? (state ? `${city}, ${state}` : city) : "";

        clearTimeout(loadingGuard);
        const parts = [location, `${temp}\u00B0F`, `${label} ${emoji}`].filter(Boolean);
        statusEl.textContent = parts.join(" \u00B7 ");
      } catch {
        clearTimeout(loadingGuard);
        showError("Weather unavailable");
      }
    },
    (error) => {
      clearTimeout(loadingGuard);
      if (error.code === error.PERMISSION_DENIED) {
        showError("Enable location");
      } else if (error.code === error.TIMEOUT) {
        showError("Location timed out");
      } else {
        showError("Location unavailable");
      }
    },
    { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 }
  );
})();
