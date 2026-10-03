function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.clasName) el.clasName = options.clasName;
  if (options.attrs) {
    for (const [key, val] of Object.entries(options.attrs)) {
      el.setAttribute(key, val);
    }
  }
  if (options.text) el.textContent = options.text;
  if (options.events) {
    for (const [event, handler] of Object.entries(options.events)) {
      el.addEventListener(event, handler);
    }
  }
  return el;
}

function buildUI() {
  const appContainer = createElement("div", { className: "app-container" });

  const header = createElement("header", { className: "header" });
  const title = createElement("h1", {
    className: "title",
    text: "Memory Game",
  });

  const navButtons = createElement("div", { className: "nav-buttons" });

  const newGameBtn = createElement("button", {
    className: "btn btn-primary",
    text: "Новая игра",
    attrs: { "aria-label": "Начать новую игру" },
    events: { click: handleNewGameClick },
  });

  const leaderboardBtn = createElement("button", {
    className: "btn",
    text: "Таблица лидеров",
    attrs: { "aria-label": "Открыть таблицу лидеров" },
    events: { click: () => openLeaderboardModal() },
  });

  navButtons.appendChild(newGameBtn);
  navButtons.appendChild(leaderboardBtn);
  header.appendChild(title);
  header.appendChild(navButtons);

  const countersBar = createElement("div", { className: "counters-bar" });

  const movesCounter = createElement("div", { className: "counter-item" });
  const movesLabel = createElement("span", {
    className: "counter-label",
    text: "Ходы",
  });

  movesCounter.appendChild(movesLabel);

  const pairsCounter = createElement("div", { className: "counter-item" });
  const pairsLabel = createElement("span", {
    className: "counter-label",
    text: "Найденные пары",
  });

  pairsCounter.appendChild(pairsLabel);

  countersBar.appendChild(movesCounter);
  countersBar.appendChild(pairsCounter);

  appContainer.appendChild(header);
  appContainer.appendChild(countersBar);

  document.body.appendChild(appContainer);
}

function handleNewGameClick() {
  startNewGame();
}

window.onload = function () {
  buildUI();
};
