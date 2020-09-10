const { GRID_SIZE } = require('./constants');

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
}

function initGame() {
  const state = createGameState()
  randomFood(state);
  return state;
}

function createGameState() {
  player1Pos = {
    x: Math.floor(Math.random() * (GRID_SIZE-6)+3),
    y: Math.floor(Math.random() * (GRID_SIZE-6)+3),
  }
  player2Pos = {
    x: Math.floor(Math.random() * (GRID_SIZE-6)+3),
    y: Math.floor(Math.random() * (GRID_SIZE-6)+3),
  }
  return {
    players: [{
      pos: {
        x: player1Pos.x,
        y: player1Pos.y,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        {x: player1Pos.x, y: player1Pos.y},
        {x: player1Pos.x, y: player1Pos.y+1},
      ],
    }, {
      pos: {
        x: player2Pos.x,
        y: player2Pos.y,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        {x: player2Pos.x, y: player2Pos.y},
        {x: player2Pos.x, y: player2Pos.y+1},
      ],
    }],
    food: [],
    gridsize: GRID_SIZE,
  };
}

function gameLoop(state) {
  if (!state) {
    return;
  }

  const playerOne = state.players[0];
  const playerTwo = state.players[1];

  playerOne.pos.x += playerOne.vel.x;
  playerOne.pos.y += playerOne.vel.y;

  playerTwo.pos.x += playerTwo.vel.x;
  playerTwo.pos.y += playerTwo.vel.y;

  if (playerOne.pos.x < 0 || playerOne.pos.x > GRID_SIZE || playerOne.pos.y < 0 || playerOne.pos.y > GRID_SIZE) {
    return 2;
  }

  if (playerTwo.pos.x < 0 || playerTwo.pos.x > GRID_SIZE || playerTwo.pos.y < 0 || playerTwo.pos.y > GRID_SIZE) {
    return 1;
  }

  for (let food of state.food) {
    if (food.x === playerOne.pos.x && food.y === playerOne.pos.y) {
      playerOne.snake.push({ ...playerOne.snake[0] });
      var index = state.food.indexOf(food);
      if (index > -1) {
        state.food.splice(index, 1);
      }
      randomFood(state);
    }

    if (food.x === playerTwo.pos.x && food.y === playerTwo.pos.y) {
      playerTwo.snake.push({ ...playerTwo.snake[0] });
      var index = state.food.indexOf(food);
      if (index > -1) {
        state.food.splice(index, 1);
      }
      randomFood(state);
    }
  }

  if (playerOne.vel.x || playerOne.vel.y) {
    for (let cell of playerOne.snake) {
      if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
        return 2;
      }
    }

    playerOne.snake.unshift({ ...playerOne.pos });
    playerOne.snake.pop();
  }

  if (playerTwo.vel.x || playerTwo.vel.y) {
    for (let cell of playerTwo.snake) {
      if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
        return 1;
      }
    }

    playerTwo.snake.unshift({ ...playerTwo.pos });
    playerTwo.snake.pop();
  }

  for (let cell of playerOne.snake) {
    if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
      return 1;
    }
  }

  for (let cell of playerTwo.snake) {
    if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
      return 2;
    }
  }

  return false;
}

function randomFood(state) {
  food = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }

  for (let cell of state.players[0].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  for (let cell of state.players[1].snake) {
    if (cell.x === food.x && cell.y === food.y) {
      return randomFood(state);
    }
  }

  state.food.push(food);
}

function getUpdatedVelocity(keyCode) {
  switch (keyCode) {
    case 37: { // left
      return { x: -1, y: 0 };
    }
    case 38: { // down
      return { x: 0, y: -1 };
    }
    case 39: { // right
      return { x: 1, y: 0 };
    }
    case 40: { // up
      return { x: 0, y: 1 };
    }
  }
}
