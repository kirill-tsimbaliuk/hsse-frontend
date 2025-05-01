class BackgroundController {
    constructor(stars_count) {
        this.stars = [];
        for (var i = 0; i < stars_count; ++i) {
            var x_position = Math.random() * canvas.width;
            var y_position = Math.random() * canvas.height;
            this.stars.push([x_position, y_position]);
        }
        this.img = new Image();
        this.img.src = "static/img/star.png";
    }

    Update() {
        context.fillStyle = "white";
        for (var i = 0; i < this.stars.length; ++i) {
            context.drawImage(this.img, this.stars[i][0],this.stars[i][1], 30, 30);
        }
        context.fillStyle = "black";
    }
}

class ScoreController {
    score = 0;
    constructor() {
        this.score_element = document.getElementById('score');
    }

    Update() {
        this.score_element.textContent = this.score;
    }
}