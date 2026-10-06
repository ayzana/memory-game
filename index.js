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
    className: "btn",
    text: "Новая игра",
    attrs: { "aria-label": "Начать новую игру" },
    events: { click: handleNewGameClick },
  });

  const leaderboardBtn = createElement("button", {
    className: "btn",
    text: "Таблица лидеров",
    attrs: { "aria-label": "Открыть таблицу лидеров" },
    events: { click: () => openLeaderModal() },
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

      if (pairs === 8) {
        saveLeaders(moves);
        setTimeout(() => {
          openVictoryModal(moves);
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

function openVictoryModal(moves) {
  const modalContent = createElement("div");
  const statsBox = createElement("div", { className: "victory-stats" });
  const statsLabel = createElement("span", {
    className: "counter-label",
    text: "Количество ходов",
  });
  const statsVal = createElement("span", {
    className: "victory-stats-val",
    text: String(moves),
  });
  statsBox.appendChild(statsLabel);
  statsBox.appendChild(statsVal);
  modalContent.appendChild(statsBox);

  let content;
  content = createModal({
    titleText: "Победа!",
    modalContent: modalContent,
    buttons: [
      {
        text: "Новая игра",
        className: "btn",
        onClick: () => {
          content.closeModal();
          startNewGame();
        },
      },
      {
        text: "Закрыть",
        className: "btn",
        onClick: () => content.closeModal(),
      },
    ],
  });
}

function createModal({ titleText, modalContent, buttons }) {
  const modalOverlay = createElement("div", { className: "modal-overlay" });
  const modal = createElement("div", { className: "modal" });
  const title = createElement("p", {
    className: "modal-title",
    text: titleText,
  });

  const actions = createElement("div", { className: "modal-actions" });

  buttons.forEach((btn) => {
    const button = createElement("button", {
      className: btn.className || "btn",
      text: btn.text,
      events: {
        click: () => {
          btn.onClick(closeModal);
        },
      },
    });
    actions.appendChild(button);
  });

  modalOverlay.appendChild(modal);
  modal.appendChild(title);
  modal.appendChild(modalContent);
  modal.appendChild(actions);

  function closeModal() {
    modalOverlay.classList.remove("active");
    modal.remove();
    modalOverlay.remove();
    document.body.style.overflow = "auto";
  }
  function handleKeyDown(e) {
    if (e.key === "Escape") closeModal();
  }
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", handleKeyDown);
  document.body.append(modalOverlay);
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";

  return { closeModal };
}

function getLeadersdData() {
  try {
    const data = localStorage.getItem("leader");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

function saveLeaders(moves) {
  const data = getLeadersdData();
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const formattedDate = `${dd}.${mm}.${yyyy}`;

  data.push({
    moves: moves,
    date: formattedDate,
    now: Date.now(),
  });

  data.sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.timestamp - b.timestamp;
  });

  const top = data.slice(0, 10);
  try {
    localStorage.setItem("leader", JSON.stringify(top));
  } catch (err) {
    console.error("Ошибка сохранения", err);
  }
}
function openLeaderModal() {
  const modalContent = createElement("div");
  const data = getLeadersdData();
  console.log(data);

  if (data.length === 0) {
    const msg = createElement("div", {
      className: "empty-msg",
      text: "Пока нет результатов",
    });
    modalContent.appendChild(msg);
  } else {
    const table = createElement("table", { className: "leader-table" });
    const thead = createElement("thead");
    const trHead = createElement("tr");

    ["№", "Ходы", "Дата"].forEach((thText) => {
      trHead.appendChild(createElement("th", { text: thText }));
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = createElement("tbody");

    data.forEach((el, index) => {
      const tr = createElement("tr");
      tr.appendChild(createElement("td", { text: String(index + 1) }));
      tr.appendChild(createElement("td", { text: String(el.moves) }));
      tr.appendChild(createElement("td", { text: el.date }));

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    modalContent.appendChild(table);
  }
  let content;
  content = createModal({
    titleText: "Таблица лидеров",
    modalContent: modalContent,
    buttons: [
      {
        text: "Закрыть",
        className: "btn",
        onClick: () => content.closeModal(),
      },
    ],
  });
}

window.onload = function () {
  buildUI();
  startNewGame();
};
