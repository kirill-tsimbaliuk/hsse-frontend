const window_element = document.getElementById('window');

const canvas = document.getElementById('main');
const context = canvas.getContext('2d');

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;
const stars_count = 80;

var keys = [];
var entities = [];
var play = false;
var background = new BackgroundController(stars_count);
var score = new ScoreController();
var player;

function pause() {
    play = !play;
}

function checkCollision(entity1, entity2) {
    if (entity1.x + entity1.size >= entity2.x &&
        entity1.x <= entity2.x + entity2.size && entity1.y + entity1.size >= entity2.y &&
        entity1.y <= entity2.y + entity2.size) {
        entity1.OnCollisionWith(entity2);
    }
}

function loop() {
    requestAnimationFrame(loop);
    context.fillRect(0, 0, canvas.width, canvas.height);

    background.Update();
    score.Update();
    if (!play) {
        return;
    }

    // processing Update
    var for_deleting = []
    for (var i = 0; i < entities.length; ++i) {
        entities[i].Update();
        if (entities[i].destroy) {
            for_deleting.push(i);
        }
    }

    // deleting marked objects
    for (var i = 0; i < for_deleting.length; ++i) {
        delete entities[for_deleting[i]];
        entities.splice(for_deleting[i], 1);
    }

    // collisons
    for (entity1 of entities) {
        for (entity2 of entities) {
            if (entity1 != entity2 && entity1.collision_layer == entity2.collision_layer) {
                checkCollision(entity1, entity2);
            }
        }
    }
}

function KeysDown(event) {
    keys[event.key] = true;
    for (var entity of entities) {
        entity.KeyDown(event);
    }
}

function KeysUp(event) {
    keys[event.key] = false;
    for (var entity of entities) {
        entity.KeyUp(event);
    }
}

function start() {
    keys = [];
    entities = [];

    background = new BackgroundController(stars_count);
    player = new Player(canvas.width / 2, canvas.height / 2, context);
    score.score = 0;

    entities.push(player);
    for (var i = 0; i < 3; ++i) {
        createEnemy(canvas, context);
    }

    document.addEventListener('keydown', KeysDown);
    document.addEventListener('keyup', KeysUp);
    play = true;
    window_element.style = "visibility: hidden;"
}

function finish() {
    window_element.style = "visibility: visible;"
    play = false;

    console.log("Your result ", score.score);

    fetch('/score/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'value'}) // Ваши данные для отправки
      })
      .then(res => res.json())
      .then(data => console.log('Успешно:', data))
      .catch(error => console.error('Ошибка:', error));
}

requestAnimationFrame(loop);