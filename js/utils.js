function setInput() {
  window.addEventListener("keydown", (e) => {
    switch (e.key.toUpperCase()) {
      case "W":
        PLAYER_1.jump(JUMP_VALUE);
        break;
      case "A":
        PLAYER_1.lastKey = "BACKWARD";
        PLAYER_1.CONTROLS.BACKWARD.pressed = true;
        break;
      case "D":
        PLAYER_1.lastKey = "FORWARD";
        PLAYER_1.CONTROLS.FORWARD.pressed = true;
        break;
      case "S":
        PLAYER_1.attack();
        break;

      case "ARROWUP":
        PLAYER_2.jump(JUMP_VALUE);
        break;
      case "ARROWLEFT":
        PLAYER_2.lastKey = "FORWARD";
        PLAYER_2.CONTROLS.FORWARD.pressed = true;
        break;
      case "ARROWRIGHT":
        PLAYER_2.lastKey = "BACKWARD";
        PLAYER_2.CONTROLS.BACKWARD.pressed = true;
        break;
      case "ARROWDOWN":
        PLAYER_2.attack();
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key.toUpperCase()) {
      case "A":
        PLAYER_1.CONTROLS.BACKWARD.pressed = false;
        break;
      case "D":
        PLAYER_1.CONTROLS.FORWARD.pressed = false;
        break;

      case "ARROWLEFT":
        PLAYER_2.CONTROLS.FORWARD.pressed = false;
        break;
      case "ARROWRIGHT":
        PLAYER_2.CONTROLS.BACKWARD.pressed = false;
        break;
    }
  });
}

function setTimer(t) {
  const timer = setInterval(() => {
    if (GAMEOVER) {
      clearInterval(timer);
      return;
    }

    t.innerText--;

    if (t.innerText == 0) {
      endGame();
    }
  }, 1000);
}

function chooseRandom(n) {
  return Math.floor(Math.random() * n) + 1;
}

function collisionCheck(A, B) {
  if (!A.isAttacking) return;

  if (GAMEOVER) return;

  if (
    A.hitbox.position.x <= B.area.position.x + B.width &&
    A.hitbox.position.x + A.hitbox.width >= B.area.position.x &&
    A.hitbox.position.y <= B.area.position.y + B.height &&
    A.hitbox.position.y + A.hitbox.height >= B.area.position.y &&
    A.index === A.frames.attack
  ) {
    A.isAttacking = false;

    A.recover();

    B.recover();

    B.health -= ATTACK_DAMAGE * A.multiplier;

    B.health = B.health < 0 ? 0 : B.health;

    B.HP.style.width = (100 * B.health) / (BASE_HEALTH * B.multiplier) + "%";

    B.health > 0 ? B.changeSprite("Take Hit") : endGame(B);
  }
}

function endGame(PLAYER) {
  const message = document.querySelector(".message");

  const P1 = (100 * PLAYER_1.health) / (BASE_HEALTH * PLAYER_1.multiplier);
  const P2 = (100 * PLAYER_2.health) / (BASE_HEALTH * PLAYER_2.multiplier);

  if (P1 === P2) {
    message.innerText = `It's a tie!`;
    message.style.display = "block";
  }

  if (P1 > P2) {
    message.innerText = `${PLAYER_1.name} wins!`;
    message.style.display = "block";
  }

  if (P2 > P1) {
    message.innerText = `${PLAYER_2.name} wins!`;
    message.style.display = "block";
  }

  if (PLAYER) PLAYER.isDead = true;

  GAMEOVER = true;
}

function animatePlayer(PLAYER) {
  PLAYER.move(0);

  if (
    PLAYER.CONTROLS.FORWARD.pressed &&
    PLAYER.lastKey === "FORWARD" &&
    !PLAYER.isDead
  ) {
    PLAYER.move(RUNNING_SPEED);
    PLAYER.changeSprite("Run");
    return;
  }

  if (
    PLAYER.CONTROLS.BACKWARD.pressed &&
    PLAYER.lastKey === "BACKWARD" &&
    !PLAYER.isDead
  ) {
    PLAYER.move(-WALKING_SPEED);
  }

  PLAYER.changeSprite(PLAYER.isDead ? "Death" : "Idle");
}

function canvasFilter() {
  CONTEXT.fillStyle = "rgba(255, 255, 255, 0.1)";
  CONTEXT.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function updateEntities() {
  BACKGROUND.update();
  SHOP.update();

  canvasFilter();

  PLAYER_1.update();
  PLAYER_2.update();
}

function updateGame() {
  animatePlayer(PLAYER_1);
  animatePlayer(PLAYER_2);

  updateEntities();

  collisionCheck(PLAYER_1, PLAYER_2);
  collisionCheck(PLAYER_2, PLAYER_1);
}

function startGame() {
  const c = document.querySelector("canvas");

  c.width = CANVAS_W;
  c.height = CANVAS_H;

  const m = document.querySelector(".message");

  m.innerText = "START";

  setTimeout(() => {
    m.style.display = "none";
  }, 1500);

  const t = document.querySelector(".time-value");

  t.innerText = DEFAULT_TIME;

  setInput();

  setTimer(t);

  play();
}

function play() {
  window.requestAnimationFrame(play);

  updateGame();
}
