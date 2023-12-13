const CONTEXT = document.querySelector("canvas").getContext("2d");

const CANVAS_W = 1024;
const CANVAS_H = 576;

const PLAYER_W = 50;
const PLAYER_H = 150;

const BASE_HEALTH = 100;

const HITBOX_W = 125;
const HITBOX_H = 50;

const RECOVERY_SPEED = 100;

const ATTACK_DAMAGE = BASE_HEALTH / 25;

const GRAVITY = 0.425;

const WALKING_SPEED = 4;

const RUNNING_SPEED = 5;

const DEFAULT_TIME = 120;

const JUMP_VALUE = -PLAYER_H / 10;

const FLOOR_H = CANVAS_H - 96;

const ANIMATION_SPEED = 110;

const DEBUG = false;

let GAMEOVER = false;
