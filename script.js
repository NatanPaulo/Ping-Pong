// Seleciona o elemento <canvas> do HTML
const canvasEl = document.querySelector("canvas");

// Obtém o contexto 2D do canvas (ferramentas de desenho)
const canvasCtx = canvasEl.getContext("2d");
// Isso cria um contexto de desenho 2D, que fornece métodos como:
// - fillRect() → desenhar retângulos
// - arc() → desenhar círculos
// - fillText() → desenhar texto
// - beginPath() → iniciar um desenho
// Pense assim: Canvas = tela, Context = pincel

// Espaçamento lateral usado para as raquetes
const gapX = 10;

/* =========================
   CAMPO DO JOGO
========================= */
const field = {
  // Largura do campo = largura da janela
  w: window.innerWidth,

  // Altura do campo = altura da janela
  h: window.innerHeight,

  // Função responsável por desenhar o campo
  draw: function () {
    // Define a cor de preenchimento
    canvasCtx.fillStyle = "#286047";

    // Desenha um retângulo preenchendo toda a tela
    // fillRect(x, y, largura, altura)
    canvasCtx.fillRect(0, 0, this.w, this.h);
  },

  // O que é "this"?
  // Em JavaScript, this representa o objeto atual, ou seja:
  // “o dono da função que está sendo executada”

  // Isso evita repetir o nome do objeto e deixa o código:
  // - Mais organizado
  // - Mais reutilizável
  // - Mais fácil de manter

  // Conclusão:
  // “this sempre aponta para quem chamou a função”
};

/* =========================
   LINHA CENTRAL
========================= */
const line = {
  w: 15, // Largura da linha
  h: field.h, // Altura igual ao campo

  draw: function () {
    canvasCtx.fillStyle = "#ffffff";

    // Centraliza a linha horizontalmente
    canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  },
};

/* =========================
   RAQUETE ESQUERDA (JOGADOR)
========================= */
const leftPaddle = {
  x: gapX, // Distância da esquerda
  y: 0, // Posição inicial vertical
  w: line.w, // Largura igual à linha
  h: 200, // Altura da raquete

// FUNÇÕES COM "_" (NOMECLATURA):
// "_" indica método interno
// Não é privado de verdade
// É convenção, não regra
_move: function () {
    // Centraliza a raquete no mouse
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

/* =========================
   RAQUETE DIREITA (COMPUTADOR)
========================= */
const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 200,
  speed: 5, // Velocidade da IA

  // Movimento automático seguindo a bola
  _move: function () {
    const center = this.y + this.h / 2;
    const error = Math.random() * 30 - 15; // erro proposital

    if (center < ball.y + error) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
  },

  // Aumenta a dificuldade
  speedUp: function () {
    if (this.speed < 15) {
      this.speed += 1;
    }
  },

  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.fillRect(this.x, this.y, this.w, this.h);
    this._move();
  },
};

/* =========================
   PLACAR
========================= */
const score = {
  human: 0,
  computer: 0,

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

/* =========================
   BOLA
========================= */
const ball = {
  x: 0,
  y: 0,
  r: 20, // Raio
  speed: 5, // Velocidade
  directionX: 1, // Direção horizontal (1 ou -1)
  directionY: 1, // Direção vertical (1 ou -1)

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

  _reverseX: function () {
    this.directionX *= -1;

    // Variação vertical aleatória
    this.directionY = Math.random() * 2 - 1;
  },

  _reverseY: function () {
    this.directionY *= -1;
  },

  _speedUp: function () {
    this.speed += 1;
  },

  _pointUp: function () {
    this._speedUp();
    rightPaddle.speedUp();
    this.x = field.w / 2;
    this.y = field.h / 2;
  },

  _move: function () {
    // Atualiza posição com base em direção e velocidade
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },

  draw: function () {
    canvasCtx.fillStyle = "#ffffff";
    canvasCtx.beginPath();

    // arc(x, y, raio, anguloInicial, anguloFinal)
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);

    canvasCtx.fill();

    this._calcPosition();
    this._move();
  },
};

/* =========================
   MOUSE
========================= */
const mouse = { x: 0, y: 0 };

/* =========================
   CONFIGURAÇÃO INICIAL
========================= */
function setup() {
  canvasEl.width = field.w;
  canvasEl.height = field.h;
  // Centraliza a bola no início do jogo
  ball.x = field.w / 2;
  ball.y = field.h / 2;
}

/* =========================
   LOOP DE DESENHO
========================= */
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

// Executa o draw 60 vezes por segundo (FPS)
window.setInterval(draw, 1000 / 60);

// Captura o movimento do mouse
canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
});
