class Sprite {
  constructor({ area, src, scale, frames }) {
    this.area = area;

    this.area.offset = this.area.offset || { x: 0, y: 0 };

    this.image = new Image();
    this.image.src = src;
    this.image.label = "Default";

    this.scale = scale || 1;
    this.frames = frames || { max: 1 };

    this.index = 0;

    this.animation = this.animate();
  }

  animate() {
    return setInterval(() => {
      this.index = this.index < this.frames.max - 1 ? this.index + 1 : 0;
    }, ANIMATION_SPEED);
  }

  draw() {
    CONTEXT.drawImage(
      this.image,
      this.index * (this.image.width / this.frames.max),
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.area.position.x - this.area.offset.x,
      this.area.position.y - this.area.offset.y,
      (this.image.width / this.frames.max) * this.scale,
      this.image.height * this.scale
    );
  }

  update() {
    this.draw();
  }
}

class Fighter extends Sprite {
  constructor({
    name,
    area,
    velocity,
    hitbox,
    HP,
    src,
    scale,
    frames,
    sprites,
    orientation,
    multiplier,
  }) {
    super({ area, src, scale, frames });

    this.CONTROLS = {
      FORWARD: {
        pressed: false,
      },
      BACKWARD: {
        pressed: false,
      },
    };

    this.name = name;
    this.velocity = velocity ?? { x: 0, y: 0 };
    this.orientation = orientation ?? 1;

    this.height = PLAYER_H;
    this.width = PLAYER_W;

    this.multiplier = multiplier ?? 1;

    this.health = BASE_HEALTH * this.multiplier;

    this.hitbox = hitbox;

    this.hitbox.position = this.hitbox.position || {
      x: this.area.position.x,
      y: this.area.position.y,
    };

    this.HP = HP;

    this.lastKey;
    this.isAttacking = false;
    this.isRecovering = false;
    this.isDead = false;

    this.sprites = sprites;

    for (const sprite in sprites) {
      sprites[sprite].image = new Image();

      sprites[sprite].image.src = sprites[sprite].src;

      sprites[sprite].image.label = sprite;
    }
  }

  currentAnimation(sprite) {
    return (
      this.image.label.includes(sprite) && this.index < this.frames.max - 1
    );
  }

  finalFrame(sprite) {
    return (
      this.image.label.includes(sprite) && this.index === this.frames.max - 1
    );
  }

  changeSprite(sprite) {
    if (this.finalFrame("Death")) {
      clearInterval(this.animation);
      return;
    }

    if (this.currentAnimation("Death")) return;

    if (this.currentAnimation("Take Hit")) return;

    if (this.finalFrame("Take Hit")) this.isRecovering = false;

    if (this.currentAnimation("Attack")) return;

    if (this.finalFrame("Attack")) this.isAttacking = false;

    if (this.velocity.y < 0 && sprite === "Idle") sprite = "Jump";

    if (this.velocity.y > 0 && sprite === "Idle") sprite = "Fall";

    if (this.isAttacking) sprite = `Attack (${chooseRandom(2)})`;

    if (this.image.label != sprite) this.index = 0;

    this.frames.max = this.sprites[sprite].frames;

    this.image = this.sprites[sprite].image;

    this.isRecovering = false;

    this.isAttacking = false;
  }

  isJumping() {
    return this.area.position.y + this.velocity.y < FLOOR_H - PLAYER_H;
  }

  attack() {
    if (!this.isRecovering && !GAMEOVER) this.isAttacking = true;
  }

  move(x) {
    if (!this.isDead) this.velocity.x = x * this.orientation;
  }

  jump(y) {
    if (!this.isJumping() && !this.isDead) this.velocity.y = y;
  }

  update() {
    // Left Boundaries
    if (this.area.position.x + this.velocity.x <= 0) {
      this.velocity.x = 0;
      this.area.position.x = 0;
    }

    // Right Boundaries
    if (this.area.position.x + this.velocity.x + PLAYER_W >= CANVAS_W) {
      this.velocity.x = 0;
      this.area.position.x = CANVAS_W - PLAYER_W;
    }

    // Ceiling Boundaries
    if (this.area.position.y - this.velocity.y < 0) {
      this.velocity.y = 0;
      this.area.position.y = 0;
    }

    // Floor Boundaries
    if (this.area.position.y + this.velocity.y + PLAYER_H > FLOOR_H) {
      this.velocity.y = 0;
      this.area.position.y = FLOOR_H - PLAYER_H;
    }

    if (this.isJumping()) this.velocity.y += GRAVITY;

    // Player

    this.draw();

    this.area.position.x += this.velocity.x;
    this.area.position.y += this.velocity.y;

    // Hit Box
    this.hitbox.position.x = this.area.position.x + this.hitbox.offset.x;
    this.hitbox.position.y = this.area.position.y + this.hitbox.offset.y;

    if (DEBUG && this.isAttacking) {
      CONTEXT.fillStyle = "black";
      CONTEXT.fillRect(
        this.hitbox.position.x,
        this.hitbox.position.y,
        this.hitbox.width,
        this.hitbox.height
      );
    }
  }
}
