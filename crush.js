document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const timerDisplay = document.getElementById("timer");
    const scoreDisplay = document.getElementById("score");
    const targetDisplay = document.getElementById("target");
    const winnerMessage = document.getElementById("winner-message");
    const loserMessage = document.getElementById("loser-message");
    const music = document.getElementById("background-music");
    const clickSound = document.getElementById("click-sound");
    const musicToggle = document.getElementById("music-toggle");
    const width = 8;
    const emojis = ["🍎", "🍋", "🍏", "🍇", "🍒"];
    let squares = [];
    let timeLeft = 60;
    let score = 0;
    const targetScore = 100;
    let musicPlaying = true;

    music.play();

    musicToggle.addEventListener("click", () => {
        if (musicPlaying) {
            music.pause();
        } else {
            music.play();
        }
        musicPlaying = !musicPlaying;
    });

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement("div");
            square.setAttribute("draggable", true);
            square.setAttribute("id", i);
            let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            square.textContent = randomEmoji;
            square.classList.add("candy");
            square.addEventListener("click", () => clickSound.play());
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    function refillCandies() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].textContent === "") {
                let newEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                squares[i].textContent = newEmoji;
            }
        }
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = `Score: ${score}`;
    }

    let emojiBeingDragged, emojiBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

    squares.forEach(square => square.addEventListener("dragstart", dragStart));
    squares.forEach(square => square.addEventListener("dragover", dragOver));
    squares.forEach(square => square.addEventListener("drop", dragDrop));
    squares.forEach(square => square.addEventListener("dragend", dragEnd));

    function dragStart() {
        emojiBeingDragged = this.textContent;
        squareIdBeingDragged = parseInt(this.id);
        clickSound.play();
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragDrop() {
        emojiBeingReplaced = this.textContent;
        squareIdBeingReplaced = parseInt(this.id);
        squares[squareIdBeingDragged].textContent = emojiBeingReplaced;
        squares[squareIdBeingReplaced].textContent = emojiBeingDragged;
    }

    function dragEnd() {
        checkMatches();
    }

    function checkMatches() {
        for (let i = 0; i < width * width; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedEmoji = squares[i].textContent;
            const isValidRow = i % width < width - 2;
            const isValidColumn = i < width * (width - 2);

            if (isValidRow && rowOfThree.every(index => squares[index].textContent === decidedEmoji)) {
                rowOfThree.forEach(index => squares[index].textContent = "");
                updateScore(10);
            }
            if (isValidColumn && columnOfThree.every(index => squares[index].textContent === decidedEmoji)) {
                columnOfThree.forEach(index => squares[index].textContent = "");
                updateScore(10);
            }
        }
        setTimeout(refillCandies, 200);
    }

    function startTimer() {
        const countdown = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time Left: ${timeLeft}s`;

            if (timeLeft === 0) {
                clearInterval(countdown);
                checkGameStatus();
            }
        }, 1000);
    }

    function checkGameStatus() {
        if (score >= targetScore) {
            winnerMessage.classList.remove("hidden");
        } else {
            loserMessage.classList.remove("hidden");
        }
    }

    startTimer();
});
