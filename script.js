// Seleciona o <canvas> do HTML
const canvasEl = document.querySelector("canvas");

// Obter o contexto 2D do Canvas (ferramenta de desenho)
const canvasCtx = canvasEl.getContext("2d");
// Isso cria um contexto de desenho em 2D, que fornece métodos comos:
// - fillRect() -> desenha retângulos
// - arc() -> desenha círculos
// - fillText() -> desenha textos
// - beginPath() -> inicia um desenho
// Pense assim: Canvas = Tela, Context = Pincel

// Espaçamento lateral usado para as raquetes:
const gapX = 10;

// Campo do jogo:
const field = {
  // Largura da janela
  w: window.innerWidth,
  // Altura da janela
  h: window.innerHeight,

  //   Função responsável por desenhar o campo
  draw: function () {
    // Definir a cor do preenchimento
    canvasCtx.fillStyle = "#286047";

    // Desenha um retângulo preenchendo toda a tela
    // fillRect(x, y, largura, altura)
    canvasCtx.fillRect(0, 0, this.w, this.h);
  },
  // O que é "this"?
  // Em JS, this representa o objeto atual, ou seja:
  // "o dono da função que está sendo executada"
  //   Isso evita repetir o nome do objeto e deixa o código:
  //   - Mais organizado
  //   - Mais reutilizável
  //   - Mais fácil de manter
  //   Ou seja, "this sempre aponta para quem chamou a função"
};

// Configuração inicial:
function setup() {
  canvasEl.width = field.w;
  canvasEl.height = field.h;
  // Centraliza a bola no inico do jogo
  ball.x = field.w / 2;
  ball.y = field.h / 2;
}

// Linha central:
const line = {
  w: 15, //Largura da linha
  h: field.h, //Altura da linha de acordo com o tamanho do campo

  draw: function () {
    // Cor da linha/rede
    canvasCtx.fillStyle = "#fff";
    // Centralizar a linha horizontalmente
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

// Posição inicial do mouse:
const mouse = { x: 0, y: 0 };

// Raquete esquerda (jogador):
const leftPaddle = {
  x: gapX, //Distancia da esquerda
  y: 0, //Posição inicial vertical
  w: line.w, //Largura igual à linha
  h: 200, //Altura da raquete

  // Funções com "_"(nomenclatura)
  // "_" indica métodos interno.
  // Não é privado de verdade.
  // É uma convenção, e não uma regra
  _move: function () {
    // Centralizar a raquete no mouse
    this.y = mouse.y - this.h / 2;

    // Limite superior
    if (this.y < 0) this.y = 0;
    // Limite inferior
    if (this.y + this.h > field.h) {
      this.y = field.h - this.h;
    }
  },

  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);

    // Chama a função de movimento
    this._move();
  },
};

// Raquete direita (computador)
const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 200,
  speed: 2, //Velocidade da IA

  // Movimento automático seguindo a bola
  _move: function () {
    const center = this.y + this.h / 2;

    if (center < ball.y) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },

  // Aumenta dificuldade
  speedUp: function () {
    if (this.speed < 10) {
      this.speed += 1;
    }
  },

  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);
    this._move();
  },
};

// Placar:
const score = {
  human: 0,
  computer: 0,

  // Acumulo de pontos
  increaseHuman: function () {
    this.human++;
  },
  increaseComputer: function () {
    this.computer++;
  },

  draw: function () {
    canvasCtx.font = "bold 72px Arial";
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "top";
    canvasCtx.fillStyle = "#01341D";

    // Pontuação do jogador
    canvasCtx.fillText(this.human, field.w / 4, 50);
    // Pontuação do computador
    canvasCtx.fillText(this.computer, field.w * 0.75, 50);
  },
};

// Bola:
const ball = {
  x: 0,
  y: 0,
  r: 20, //Raio
  speed: 10,
  directionX: 1, //Direção horizontal (1 ou -1)
  directionY: 1, //Direção vertical (1 ou -1)

  // Ricochete Horizontal
  _reverseX: function () {
    this.directionX *= -1;
    // Variação vertical aleatória
    this.directionY = Math.random() * 2 - 1;
  },
  // Ricochete Vertical
  _reverseY: function () {
    this.directionY *= -1;
  },
  // Velocidade da bola
  _speedUp: function () {
    this.speed += 1;
  },
  _move: function () {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  _pointUp: function () {
    this._speedUp();
    rightPaddle.speedUp();
    this.x = field.w / 2;
    this.y = field.h / 2;
  },

  // Verifica colisões e pontuação
  _calcPosition: function () {
    // Colisão com raquete direita
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
    // Colisão com raquete esquerda
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
    // Colisão com teto ou chão
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      this._reverseY();
    }
  },

  draw: function () {
    canvasCtx.fillStyle = "#fa7a02";
    canvasCtx.beginPath();

    // arc(x, y, raio, anguloInicial, anguloFinal)
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    canvasCtx.fill();
    canvasCtx.stroke();

    this._calcPosition();
    this._move();
  },
};

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

// Executa o draw 60 vezes por segundo (FPS):
window.setInterval(draw, 1000 / 60);

// Captura o movimento do mouse:
canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
