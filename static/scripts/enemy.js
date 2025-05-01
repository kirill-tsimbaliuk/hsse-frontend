class EnemyBullet extends Entity {
    constructor(x, y, direction, context) {
        super();
        this.size = 40;
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.speed = 20;
        this.direction = direction;
        this.img = new Image();
        this.img.src = "static/img/enemy_bullet_" + this.direction + ".png";
        this.ctx = context;
        this.collision_layer = "player";
    }

    Update() {
        switch (this.direction) {
            case "up": {
                this.y -= this.speed;
                break;
            }
            case "left": {
                this.x -= this.speed;
                break;
            }
            case "right": {
                this.x += this.speed;
                break;
            }
            case "down": {
                this.y += this.speed;
                break;
            }
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.destroy = true;
        }

        this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    }

    OnCollisionWith(entity) {
        if (entity instanceof Player) {
            entity.Damage(5);
            this.destroy = true;
        }
    }
}

class Enemy extends Entity {
    constructor(x, y, context) {
        super();
        this.x = x;
        this.y = y;
        this.ctx = context;
        this.img = new Image();
        this.img.src = "static/img/enemy_up.png";
        this.speed = 5;
        this.size = 70;
        this.direction = "up";
        this.collision_layer = "enemy";
        this.health = 5;
        this.safe_distance = 200;
        this.counter = 0;
        this.frequency = 60;
        this.force = 1;
    }

    CheckState() {
        if (this.health <= 0) {
            score.score += 100;
            createEnemy(canvas, context);
            createEnemy(canvas, context);
            this.destroy = true;
        }
    }

    UpdateImage(dx, dy) {
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                this.direction = "right";
            } else {
                this.direction = "left";
            }
        } else {
            if (dy > 0) {
                this.direction = "down";
            } else {
                this.direction = "up";
            }
        }
        this.img.src = "static/img/enemy_" + this.direction + ".png";
    }

    UpdateFire() {
        this.counter += 1;
        if (this.counter >= this.frequency) {
            this.counter = 0;

            var x = this.x + this.size / 2;
            var y = this.y + this.size / 2;
            entities.push(new EnemyBullet(x, y, this.direction, this.ctx));
        }
    }

    Update() {
        this.CheckState();
        var direction = { x: 0, y: 0 };
        for (const other of entities) {
            if (!(other instanceof Enemy || other instanceof Player) || other === this) {
                continue;
            }

            const dx = this.x - other.x;
            const dy = this.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.safe_distance) {
                const force = (this.safe_distance - distance) / (this.safe_distance) * this.force;
                direction.x += dx * force;
                direction.y += dy * force;
            }
        }

        var dx = player.x - this.x;
        var dy = player.y - this.y;

        direction.x += dx;
        direction.y += dy;

        var norm = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (norm < 1) {
            norm = 1;
        }

        if (norm < 5) {
            direction.x = 0;
            direction.y = 0;
        }

        direction.x /= norm;
        direction.y /= norm;

        this.x += direction.x * this.speed;
        this.y += direction.y * this.speed;

        this.UpdateFire();
        this.UpdateImage(dx, dy);
        this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    }
}

function createEnemy(canvas, context) {
    x = 100 + Math.random() * (canvas.width - 200);
    y = 100 + Math.random() * (canvas.height - 200);
    entities.push(new Enemy(x, y, context));
}