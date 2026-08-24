(() => {
  "use strict";

  // v0.88 fake roster used only to prove persistent player identity.
  // Player appearance belongs here; duck type/date belongs to the event data.
  window.DUCK_POND_PLAYERS = Object.freeze([
    { id: "p001", name: "Alex Marsh", nickname: "Marshy", presentation: "male", featherTone: "white", build: "standard", roles: [] },
    { id: "p002", name: "Brooke Lane", presentation: "female", featherTone: "lightBrown", build: "standard", roles: [] },
    { id: "p003", name: "Chris Webb", nickname: "Webby", presentation: "male", featherTone: "yellow", build: "stocky", roles: ["captain"] },
    { id: "p004", name: "Dana Reid", presentation: "female", featherTone: "darkBrown", build: "short", roles: [] },
    { id: "p005", name: "Evan Cole", presentation: "male", featherTone: "white", build: "big", roles: ["coach"] },
    { id: "p006", name: "Frankie Shaw", presentation: "female", featherTone: "yellow", build: "beanpole", roles: [] },
    { id: "p007", name: "Pat President", nickname: "Prez", presentation: "male", featherTone: "white", build: "standard", roles: ["president"] },
    { id: "p008", name: "Morgan Bell", presentation: "male", featherTone: "lightBrown", build: "standard", roles: ["captain", "coach"] }
  ]);
})();
