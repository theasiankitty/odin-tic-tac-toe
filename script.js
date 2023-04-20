const PLAYER_X = 'x-player';
const PLAYER_O = 'o-player';
const DRAW = 'draw';
let currentPlayer = '';
let moves = 0;

const startNewGame = (() => {
  const gameboardDisplay = document.querySelector('#gameboard');

  const removeAllSquares = () => {
    while (gameboardDisplay.firstChild) {
      gameboardDisplay.removeChild(gameboardDisplay.firstChild);
    }
  };

  const createNewSquares = () => {
    // eslint-disable-next-line no-use-before-define
    gameboard.createGameboard();
    moves = 0;
  };

  return { removeAllSquares, createNewSquares };
})();

const score = (() => {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = () => {
    const allSquares = document.querySelectorAll('.square');
    let result = DRAW;

    winningCombos.forEach((combos) => {
      // eslint-disable-next-line max-len
      const winnerX = combos.every((square) => allSquares[square].firstChild?.classList.contains(PLAYER_X));
      // eslint-disable-next-line max-len
      const winnerO = combos.every((square) => allSquares[square].firstChild?.classList.contains(PLAYER_O));

      if (winnerX) {
        allSquares.forEach((square) => square.replaceWith(square.cloneNode(true)));
        result = PLAYER_X;
      }

      if (winnerO) {
        allSquares.forEach((square) => square.replaceWith(square.cloneNode(true)));
        result = PLAYER_O;
      }
    });

    return result;
  };

  return { checkWinner };
})();

const display = (() => {
  const messageDisplay = document.querySelector('#message');
  const currentPlayerDisplay = document.querySelector('#currentPlayer');
  const messageContainer = document.querySelector('.message-container');

  const displayTurns = (player) => {
    if (player === PLAYER_X) {
      currentPlayerDisplay.classList.remove(PLAYER_O);
      currentPlayerDisplay.classList.remove(DRAW);
      currentPlayerDisplay.classList.add(PLAYER_X);
    } else {
      currentPlayerDisplay.classList.remove(PLAYER_X);
      currentPlayerDisplay.classList.remove(DRAW);
      currentPlayerDisplay.classList.add(PLAYER_O);
    }
  };

  const removeDisplayTurns = () => {
    messageContainer.removeChild(currentPlayerDisplay);
  };

  const newGameMessage = () => {
    messageDisplay.textContent = 'GOES FIRST';
  };

  const playerTurnMessage = () => {
    messageDisplay.textContent = 'PLAYER TURN';
  };

  const winnerMessage = (player) => {
    displayTurns(player);
    messageDisplay.textContent = 'PLAYER IS THE WINNER';
  };

  const drawMessage = () => {
    messageDisplay.textContent = "IT'S A DRAW!";
    currentPlayerDisplay.classList.remove(PLAYER_X);
    currentPlayerDisplay.classList.remove(PLAYER_O);
    currentPlayerDisplay.classList.add(DRAW);
  };

  return {
    displayTurns,
    removeDisplayTurns,
    newGameMessage,
    playerTurnMessage,
    winnerMessage,
    drawMessage,
  };
})();

const modalDisplay = (() => {
  const modal = document.querySelector('.modal');
  const modalContainer = document.querySelector('.modal-container');
  const newGame = document.querySelector('#newGame');
  const finalHeader = document.querySelector('.final-header');
  const finalContent = document.querySelector('.final-content');
  const winnerHeader = 'winner-header';
  const drawHeader = 'draw-header';

  const openModal = (result) => {
    modal.style.display = 'block';
    modalContainer.classList.add('modal-open');

    if (result === PLAYER_X) {
      finalHeader.classList.add(winnerHeader);
      finalContent.classList.remove(PLAYER_O);
      finalContent.classList.remove(DRAW);
      finalContent.classList.add(PLAYER_X);
    } else if (result === PLAYER_O) {
      finalHeader.classList.add(winnerHeader);
      finalContent.classList.remove(PLAYER_X);
      finalContent.classList.remove(DRAW);
      finalContent.classList.add(PLAYER_O);
    } else {
      finalHeader.classList.add(drawHeader);
      finalContent.classList.remove(PLAYER_X);
      finalContent.classList.add(PLAYER_O);
      finalContent.classList.add(DRAW);
    }

    setTimeout(() => {
      modalContainer.classList.remove('modal-open');
    }, 500);
  };

  const closeModal = () => {
    modalContainer.classList.remove('modal-close-animation');
    modalContainer.classList.add('modal-close');
    startNewGame.removeAllSquares();

    setTimeout(() => {
      modalContainer.classList.remove('modal-close');
      modal.style.display = 'none';
      startNewGame.createNewSquares();
      finalHeader.classList.remove(winnerHeader);
      finalHeader.classList.remove(drawHeader);
    }, 100);
  };

  newGame.addEventListener('click', () => {
    modalContainer.classList.add('modal-close-animation');

    setTimeout(() => {
      closeModal();
    }, 400);
  });

  return { openModal, closeModal };
})();

const turns = (() => {
  moves = 0;

  const setFirstPlayer = () => {
    currentPlayer = PLAYER_X;
  };

  const timeOut = (result) => {
    setTimeout(() => {
      modalDisplay.openModal(result);
    }, 900);
  };

  const countTurns = () => {
    const result = score.checkWinner();
    moves += 1;

    if (moves < 9) {
      if (result === PLAYER_X) {
        display.winnerMessage(PLAYER_X);
        timeOut(PLAYER_X);
        setFirstPlayer();
      }

      if (result === PLAYER_O) {
        display.winnerMessage(PLAYER_O);
        timeOut(PLAYER_O);
        setFirstPlayer();
      }
    } else {
      if (result === DRAW) {
        display.drawMessage(DRAW);
        timeOut(DRAW);
        setFirstPlayer();
      }

      if (result === PLAYER_X) {
        display.winnerMessage(PLAYER_X);
        timeOut(PLAYER_X);
        setFirstPlayer();
      }
    }
  };

  return { countTurns, moves };
})();

const player = (() => {
  const getCurrentPlayer = () => {
    if (currentPlayer === '') {
      currentPlayer = PLAYER_X;
      return currentPlayer;
    }
    if (currentPlayer === PLAYER_X) {
      currentPlayer = PLAYER_O;
      return currentPlayer;
    }
    currentPlayer = PLAYER_X;
    return currentPlayer;
  };

  return { getCurrentPlayer };
})();

const gameboard = (() => {
  currentPlayer = player.getCurrentPlayer();

  const initializeGame = () => {
    display.newGameMessage();
    display.displayTurns(currentPlayer);
  };

  const displayMessage = () => {
    display.playerTurnMessage();
    display.displayTurns(currentPlayer);
  };

  const displayCharacter = (event) => {
    const characterSize = 'character-size';
    const character = document.createElement('div');

    character.classList.add(currentPlayer);
    character.classList.add(characterSize);
    event.target.appendChild(character);
    currentPlayer = player.getCurrentPlayer();
    displayMessage();
    turns.countTurns();
  };

  const handleClick = (e) => {
    displayCharacter(e);
  };

  const createGameboard = () => {
    initializeGame();

    const board = ['', '', '', '', '', '', '', '', ''];
    const gameboardDisplay = document.querySelector('#gameboard');

    board.forEach((_item, index) => {
      const square = document.createElement('div');
      square.classList.add('square');
      square.setAttribute('data-cell', index);
      square.addEventListener('click', handleClick, { once: true });
      gameboardDisplay.appendChild(square);
    });
  };

  return { createGameboard };
})();

gameboard.createGameboard();
