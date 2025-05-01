const canvas = document.getElementById('main');
const context = canvas.getContext('2d');

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;
const stars_count = 80;

var keys = [];
var entities = [];
var play = false;
var showing_about = false;
var showing_scores = false;
var background = new BackgroundController(stars_count);
var score = new ScoreController();
var player;

function pause() {
    play = !play;

    var button = document.getElementById('play-button');
    if (play) {
        button.textContent = "Пауза";
        hideAllMenuWindow();
    } else {
        button.textContent = "Продолжить";
    }
}

function checkCollision(entity1, entity2) {
    if (entity1.x + entity1.size >= entity2.x &&
        entity1.x <= entity2.x + entity2.size && entity1.y + entity1.size >= entity2.y &&
        entity1.y <= entity2.y + entity2.size) {
        entity1.OnCollisionWith(entity2);
    }
}

function drawFolder() {
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.Update();
    // draw picture
}

function loop() {
    requestAnimationFrame(loop);
    if (!play) {
        drawFolder();
        return;
    }

    context.fillRect(0, 0, canvas.width, canvas.height);

    background.Update();
    score.Update();

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

function startGame() {
    hideAllMenuWindow();
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

    var button = document.getElementById('play-button');
    button.textContent = "Пауза";
    button.onclick = pause;
}

function askName() {
    const window_element = document.getElementById('final-window');
    window_element.style = "visibility: visible;"
    play = false;
}

function showMenu() {
    const window_element = document.getElementById('final-window');
    window_element.style = "visibility: hidden;"
    var button = document.getElementById('play-button');
    button.textContent = "Играть";
    button.onclick = startGame;
}

const formElement = document.getElementById('name-form');
formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formElement);
    const name = formData.get('name');
    if (!name) {
        return;
    }
    formElement.reset();

    fetch('/score/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, score: score.score })
    }).then(showMenu);
});

function showAbout() {
    if (showing_scores) { showScores(); }
    showing_about = !showing_about;
    const window_element = document.getElementById('about-window');
    if (showing_about) {
        window_element.style = "visibility: visible;"
    } else {
        window_element.style = "visibility: hidden;"
    }
}

function processData(data) {
    const last_table = document.getElementById('score-table');
    if (last_table) { last_table.remove(); }

    const table = document.createElement('table');
    const header = table.createTHead();
    const tr = document.createElement("tr");
    const header_name = document.createElement("th");
    header_name.textContent = "Имя пользователя";
    const header_score = document.createElement("th");
    header_score.textContent = "Счёт"
    tr.appendChild(header_name);
    tr.appendChild(header_score);
    header.appendChild(tr);
    data['records'].forEach(
        item => {
            const row = table.insertRow();
            const name_cell = row.insertCell();
            name_cell.textContent = item['name'];
            const score_cell = row.insertCell();
            score_cell.textContent = item['score'];
        }
    );

    table.className = "score-table";
    table.id = 'score-table';
    document.getElementById("score-window").appendChild(table);
}

function showScores() {
    if (showing_about) { showAbout(); }
    showing_scores = !showing_scores;
    const window_element = document.getElementById('score-window');
    if (showing_scores) {
        window_element.style = "visibility: visible;"
        fetch('/score/10/', {
            method: 'GET'
        }).then((data) => data.json()).then((data) => processData(data));
    } else {
        window_element.style = "visibility: hidden;"
    }
}

function hideAllMenuWindow() {
    if (showing_about) { showAbout(); }
    if (showing_scores) { showScores(); }
}

requestAnimationFrame(loop);
showMenu();