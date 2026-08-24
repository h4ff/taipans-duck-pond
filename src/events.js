(() => {
  "use strict";

  // v0.88 fake season events. Each row is one permanent duck event.
  // The dataset is deliberately weighted so the cumulative leaderboard has a
  // clear top three for the current-week playback test.
  window.DUCK_POND_TEST_EVENTS = Object.freeze([
    { id: "e001", playerId: "p003", date: "2026-07-04", team: "2nd XI", duckType: "standard" },
    { id: "e002", playerId: "p001", date: "2026-07-05", team: "1st XI", duckType: "standard" },
    { id: "e003", playerId: "p002", date: "2026-07-11", team: "Women", duckType: "standard" },
    { id: "e004", playerId: "p004", date: "2026-07-12", team: "Women", duckType: "golden" },
    { id: "e005", playerId: "p003", date: "2026-07-18", team: "2nd XI", duckType: "standard" },
    { id: "e006", playerId: "p005", date: "2026-07-19", team: "3rd XI", duckType: "standard" },
    { id: "e007", playerId: "p001", date: "2026-07-25", team: "1st XI", duckType: "golden" },
    { id: "e008", playerId: "p002", date: "2026-08-01", team: "Women", duckType: "standard" },
    { id: "e009", playerId: "p003", date: "2026-08-02", team: "2nd XI", duckType: "diamond" },
    { id: "e010", playerId: "p006", date: "2026-08-03", team: "Women", duckType: "standard" },
    { id: "e011", playerId: "p001", date: "2026-08-08", team: "1st XI", duckType: "standard" },
    { id: "e012", playerId: "p003", date: "2026-08-09", team: "2nd XI", duckType: "standard" },
    { id: "e013", playerId: "p007", date: "2026-08-10", team: "1st XI", duckType: "golden" },
    { id: "e014", playerId: "p008", date: "2026-08-15", team: "4th XI", duckType: "standard" },

    // Current test week when viewed on Monday 24 Aug 2026: 17–23 Aug.
    { id: "e015", playerId: "p002", date: "2026-08-18", team: "Women", duckType: "golden" },
    { id: "e016", playerId: "p003", date: "2026-08-19", team: "2nd XI", duckType: "standard" },
    { id: "e017", playerId: "p001", date: "2026-08-20", team: "1st XI", duckType: "diamond" },
    { id: "e018", playerId: "p004", date: "2026-08-21", team: "Women", duckType: "standard" },
    { id: "e019", playerId: "p003", date: "2026-08-22", team: "2nd XI", duckType: "golden" },
    { id: "e020", playerId: "p005", date: "2026-08-23", team: "3rd XI", duckType: "standard" },

    // Future events prove they remain absent when the current week is loaded.
    { id: "e021", playerId: "p006", date: "2026-08-25", team: "Women", duckType: "standard" },
    { id: "e022", playerId: "p008", date: "2026-08-29", team: "4th XI", duckType: "golden" },
    { id: "e023", playerId: "p001", date: "2026-09-02", team: "1st XI", duckType: "standard" },
    { id: "e024", playerId: "p003", date: "2026-09-05", team: "2nd XI", duckType: "diamond" }
  ]);
})();
