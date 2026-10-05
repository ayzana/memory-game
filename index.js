"use strict";
import icons from "./cards-icons.json" with { type: "json" };

let cards = [];
let gridContainerEl;
let flippedCards = [];
let moves = 0;
let pairs = 0;
let selectCardsTime = 0;
let gridActive = false;
let movesValue;
let pairsValue;

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
  movesValue = createElement("span", { className: "counter-value", text: "0" });
  movesCounter.appendChild(movesLabel);
  movesCounter.appendChild(movesValue);

  const pairsCounter = createElement("div", { className: "counter-item" });
  const pairsLabel = createElement("span", {
    className: "counter-label",
    text: "Найденные пары",
  });
  pairsValue = createElement("span", {
    className: "counter-value",
    text: "0 из 8",
  });
  pairsCounter.appendChild(pairsLabel);
  pairsCounter.appendChild(pairsValue);

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
  if (selectCardsTime !== null) {
    clearTimeout(selectCardsTime);
    selectCardsTime = null;
  }

  moves = 0;
  pairs = 0;
  flippedCards = [];
  movesValue.textContent = "0";
  pairsValue.textContent = "0 из 8";
  gridActive = false;

  const deck = [];
  for (let i = 0; i < 8; i++) {
    deck.push({ id: i, icon: icons[i] });
    deck.push({ id: i, icon: icons[i] });
  }

  const shuffledDeck = shuffleArray(deck);
  cards = [];
  gridContainerEl.replaceChildren();
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

    const back = createElement("div", { className: "card-face card-back" });
    const backPattern = createElement("div", {
      className: "card-back-pattern",
    });

    back.appendChild(backPattern);

    const front = createElement("div", {
      className: "card-face card-front",
      attrs: {
        style: `background: url(${cardObj.icon}) no-repeat center / contain `,
      },
    });

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
  if (gridActive || card.isFlipped || card.isMatched) return;
  card.isFlipped = true;
  flippedCards.push(index);

  card.element.classList.add("flipped");

  if (flippedCards.length === 2) {
    moves++;
    movesValue.textContent = String(moves);
    const card1 = cards[flippedCards[0]];
    const card2 = cards[flippedCards[1]];

    if (card1.pairId === card2.pairId) {
      card1.isMatched = true;
      card2.isMatched = true;
      card1.element.classList.add("matched");
      card2.element.classList.add("matched");
      pairs++;
      pairsValue.textContent = `${pairs} из 8`;
      flippedCards = [];
      console.log(pairs);
      if (pairs === 8) {
        setTimeout(() => {
          createVictoryModal();
          console.log("WIN");
        }, 400);
      }
    } else {
      gridActive = true;
      selectCardsTime = setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        card1.element.classList.remove("flipped");
        card2.element.classList.remove("flipped");
        flippedCards = [];
        gridActive = false;
        selectCardsTime = null;
      }, 1000);
    }
  }
}
function handleNewGameClick() {
  startNewGame();
}

function createVictoryModal() {
  const modalOverlay = createElement("div", { className: "modal-overlay" });
  const modal = createElement("div", { className: "modal" });
  const title = createElement("p", {
    className: "modal-title",
    text: "Победа!",
  });
  modalOverlay.appendChild(modal);
  modal.appendChild(title);
  document.body.append(modalOverlay);
  modalOverlay.classList.add("active");
}

window.onload = function () {
  buildUI();
  startNewGame();
};
