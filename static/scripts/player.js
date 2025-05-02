class PlayerBullet extends Entity {
    constructor(x, y, direction, context) {
        super();
        this.size = 40;
        this.x = x - this.size / 2;
        this.y = y - this.size / 2;
        this.speed = 20;
        this.direction = direction;
        this.img = new Image();
        this.img.src = "static/img/player_bullet_" + this.direction + ".png";
        this.ctx = context;
        this.collision_layer = "enemy";
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
        if (entity instanceof Enemy || entity instanceof Boss) {
            entity.health -= 1;
            this.destroy = true;
        }
    }
}

class Player extends Entity {
    constructor(x, y, context) {
        super();
        this.x = x;
        this.y = y;
        this.ctx = context;
        this.img = new Image();
        this.img.src = "static/img/player_up.png";
        this.speed = 10;
        this.size = 50;
        this.direction = "up";
        this.collision_layer = "player";
        this.health = 100;
        this.energy = 100;

        this.health_element = document.getElementById("health");
        this.energy_element = document.getElementById("energy");
    }

    Damage(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
            askName();
        }
    }

    Heal(heal) {
        this.health += heal;
        if (this.health > 100) {
            this.health = 100;
        }
    }

    UpdateData() {
        if (this.energy < 100) {
            this.energy += 0.5;
        }
        if (this.energy < 0) {
            this.energy = 0;
        }
        this.health_element.style = "width: " + this.health + "%;";
        this.energy_element.style = "width: " + this.energy + "%;";
    }

    UpdateImage() {
        this.img.src = "static/img/player_" + this.direction + ".png";
    }

    EnergyCost(count) {
        if (this.energy < count) {
            return false;
        } else {
            this.energy -= count;
            return true;
        }
    }

    Update() {
        this.UpdateData();
        if (keys["w"]) {
            this.y -= this.speed;
            if (this.y < 0) {
                this.y = 0;
            }
            this.direction = "up";
        }
        if (keys["a"]) {
            this.x -= this.speed;
            if (this.x < 0) {
                this.x = 0;
            }
            this.direction = "left";
        }
        if (keys["s"]) {
            this.y += this.speed;
            if (this.y + this.size > canvas.height) {
                this.y = canvas.height - this.size;
            }
            this.direction = "down";
        }
        if (keys["d"]) {
            this.x += this.speed;
            if (this.x + this.size > canvas.width) {
                this.x = canvas.width + this.size;
            }
            this.direction = "right";
        }

        this.UpdateImage();
        this.ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
    }

    Teleport() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    checkAbillities(event) {
        if (event.key == "q") {
            if (this.EnergyCost(10)) { this.Heal(5); }
            return true;
        }  else if (event.key == "e") {
            if (this.EnergyCost(50)) { this.Teleport(); }
            return true;
        }
        
        return false;
    }

    KeyDown(event) {
        if (this.checkAbillities(event) || this.energy - 10 < 0) {
            return;
        }
        var x = this.x + this.size / 2;
        var y = this.y + this.size / 2;
        if (event.key == "ArrowUp") {
            this.energy -= 10;
            entities.push(new PlayerBullet(x, y, "up", this.ctx));
        } else if (event.key == "ArrowDown") {
            this.energy -= 10;
            entities.push(new PlayerBullet(x, y, "down", this.ctx));
        } else if (event.key == "ArrowLeft") {
            this.energy -= 10;
            entities.push(new PlayerBullet(x, y, "left", this.ctx));
        } else if (event.key == "ArrowRight") {
            this.energy -= 10;
            entities.push(new PlayerBullet(x, y, "right", this.ctx));
        }
    }
}