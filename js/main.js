const BACKGROUND = new Sprite({
  area: { position: { x: 0, y: 0 } },
  src: "img/Background.png",
});

const SHOP = new Sprite({
  area: { position: { x: CANVAS_W * (10 / 16), y: FLOOR_H - 128 * 2.5 } },
  src: "img/Shop.png",
  scale: 2.5,
  frames: { max: 6 },
});

const PLAYER_1 = new Fighter({
  name: "P1",
  area: {
    position: { x: PLAYER_W * 2, y: FLOOR_H },
    offset: { x: 215, y: 157 },
  },
  color: "rgb(240, 236, 229)",
  hitbox: { width: HITBOX_W, height: HITBOX_H, offset: { x: 125, y: 50 } },
  HP: document.querySelector(".hp-bar.p1"),
  src: "img/Mack/Idle.png",
  scale: 2.5,
  frames: { max: 8, attack: 4 },
  sprites: P1_SPRITES,
  multiplier: 1.25,
});

const PLAYER_2 = new Fighter({
  name: "P2",
  area: {
    position: { x: CANVAS_W - PLAYER_W * 3, y: FLOOR_H },
    offset: { x: 215, y: 172 },
  },
  orientation: -1,
  color: "rgb(182, 187, 196)",
  hitbox: {
    width: HITBOX_W,
    height: HITBOX_H,
    offset: { x: -175, y: 50 },
  },
  HP: document.querySelector(".hp-bar.p2"),
  src: "img/Kenji/Idle.png",
  scale: 2.5,
  frames: { max: 8, attack: 1 },
  sprites: P2_SPRITES,
});

startGame();
