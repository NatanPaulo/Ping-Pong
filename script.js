const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");
const gapX = 10;

const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    // Desenha o campo
    canvasCtx.fillStyle = "#286047";
    canvasCtx.fillRect(0, 0, this.w, this.h);
  },
};

const line = {
  w: 15,
  h: field.h,
  draw: function () {
    //   Desenha linha central
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

const leftPaddle = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 200,
  _move: function () {
    this.y = mouse.y - this.h / 2;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);
    this._move();
  },
};

const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 100,
  w: line.w,
  h: 200,
  _move: function () {
    this.y = ball.y; //Se ficar assim, fica impossível de ganhar da maquina
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);
    this._move();
  },
};

const score = {
  human: 1,
  computer: 2,
  increaseHuman: function () {
    this.human++;
  },
  increaseComputer: function () {
    this.computer++;
  },
  draw: function () {
    //   Desenha placar
    canvasCtx.font = "bold 72px Arial";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillStyle = "#01341D";
    canvasCtx.fillText(this.human, field.w / 4, 50);
    canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
  },
};

const ball = {
  x: 300,
  y: 200,
  r: 20,
  speed: 5,
  directionX: 1,
  directionY: 1,
  _calcPosition: function () {
    if (this.x > field.w - this.r - rightPaddle.w - gapX) {
      if (
        this.y + this.r > rightPaddle.y &&
        this.y - this.r < rightPaddle.y + rightPaddle.h
      ) {
        this._reverseX();
      } else {
        score.increaseHuman();
        this._pointUp();
      }
    }

    if (this.x < this.r + leftPaddle.w + gapX) {
      if (
        this.y + this.r > leftPaddle.y &&
        this.y - this.r < leftPaddle.y + leftPaddle.h
      ) {
        this._reverseX();
      } else {
        score.increaseComputer();
        this._pointUp();
      }
    }

    if (
      (this.y < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      this._reverseY();
    }
  },
  _reverseX: function () {
    this.directionX *= -1;
  },
  _reverseY: function () {
    this.directionY *= -1;
  },
  _pointUp: function () {
    this.x = field.w / 2;
    this.y = field.y / 2;
  },
  _move: function () {
    //Funções privadas/internas, recomenda-se usar "_"
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.beginPath();
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);

    canvasCtx.fill();
    this._calcPosition();
    this._move();
  },
};

const mouse = { x: 0, y: 0 };

function setup() {
  canvasEl.width = field.w;
  canvasCtx.width = field.w;
  canvasEl.height = field.h;
  canvasCtx.height = field.h;
}

function draw() {
  field.draw();
  line.draw();
  leftPaddle.draw();
  rightPaddle.draw();
  score.draw();
  ball.draw();
}

setup();
draw();
window.setInterval(draw, 1000 / 60);

// Suavizar movimento da bola (alternativa):
// window.animateFrame = (function () {
//   return (
//     window.requestAnimationFrame ||
//     function (callback) {
//       return window.setTimeout(callback, 1000 / 60);
//     }
//   );
// })();

// function main() {
//   animateFrame(main);
//   draw();
// }

// setup();
// main();

canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
