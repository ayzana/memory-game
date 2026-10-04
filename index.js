import icons from "./cards-icons.json" with { type: "json" };

let cards = [];
let gridContainerEl;

function createElement(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.className) el.className = options.className;
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

  gridContainerEl = createElement("main", {
    className: "game-grid",
  });

  appContainer.appendChild(header);
  appContainer.appendChild(countersBar);
  appContainer.appendChild(gridContainerEl);

  document.body.appendChild(appContainer);
}
function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function startNewGame() {
  const deck = [];
  for (let i = 0; i < 8; i++) {
    deck.push({ id: i, icon: icons[i] });
    deck.push({ id: i, icon: icons[i] });
  }

  const shuffledDeck = shuffleArray(deck);
  cards = [];

  shuffledDeck.forEach((cardData, index) => {
    const cardObj = {
      index: index,
      pairId: cardData.id,
      icon: cardData.icon.url,
      isFlipped: false,
      isMatched: false,
      element: null,
    };

    const wrapper = createElement("button", {
      className: "card-wrapper",
      attrs: {
        type: "button",
        "aria-label": `Карточка ${index + 1}`,
      },
      events: {
        click: () => handleCardClick(index),
      },
    });

    const inner = createElement("div", { className: "card-inner" });

    // Card Back
    const back = createElement("div", { className: "card-face card-back" });
    const backPattern = createElement("div", {
      className: "card-back-pattern",
    });

    // appendSvgContent(backPattern, CARD_BACK_SVG);
    back.appendChild(backPattern);

    // Card Front
    const front = createElement("div", {
      className: "card-face card-front",
      attrs: {
        style: `background: url(${cardObj.icon}) no-repeat center / cover `,
      },
    });
    // appendSvgContent(front, cardData.icon);

    inner.appendChild(back);
    inner.appendChild(front);
    wrapper.appendChild(inner);

    cardObj.element = wrapper;
    cards.push(cardObj);

    gridContainerEl.appendChild(wrapper);
  });
}

function handleCardClick(index) {
  const card = cards[index];
  card.element.classList.add("flipped");
}

function handleNewGameClick() {
  startNewGame();
}

window.onload = function () {
  buildUI();
  startNewGame();
};
