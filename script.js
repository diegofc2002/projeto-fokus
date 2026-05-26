let html = document.querySelector("html");

let comecarButton = document.querySelector(".app__card-primary-button"); // Botão "Começar" para iniciar o temporizador
let iniciarOuPausarButton = document.querySelector("#start-pause span");
let intervaloID = null;

let focoButton = document.querySelector(".app__card-button--foco");
let descansoCurtoButton = document.querySelector(".app__card-button--curto");
let descansoLongoButton = document.querySelector(".app__card-button--longo");

let buttons = document.querySelectorAll(".app__card-button"); // Utilizamos "All" porque estamos pegando mais de um elemento

let musicaFocoInput = document.querySelector("#alternar-musica"); // Permitirá que a música de foco toque durante o tempo que o usuário quiser

// Guardando o arquivo das músicas em variáveis: música = toca durante o tempo que o usuário estuda/descansa / beep = quando o timer chega a 0 / play e pause
let musica = new Audio("./sons/luna-rise-part-one.mp3");
let musicaBeep = new Audio("./sons/beep.mp3");
let musicaPlay = new Audio("./sons/play.wav");
let musicaPause = new Audio("./sons/pause.mp3");

let timer = document.querySelector(".app__card-timer"); //Temporizador da tela

let img = document.querySelector(".app__image");
let imgPlayOuPause = document.querySelector(".app__card-primary-butto-icon");

let titulo = document.querySelector(".app__title");

const tempFoco = 1500; // Temporizador de foco
const tempDescansoCurto = 300; // Temporizador de descanso curto
const tempDescansoLongo = 900; // Temporizador de descanso longo
let tempoDecorridoEmSegundos = tempFoco;

musica.loop = true;

musicaFocoInput.addEventListener("change", () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

focoButton.addEventListener("click", () => {
  tempoDecorridoEmSegundos = tempFoco;
  alterarContexto("foco");
  focoButton.classList.add("active");
});

descansoCurtoButton.addEventListener("click", () => {
  tempoDecorridoEmSegundos = tempDescansoCurto;
  alterarContexto("descanso-curto");
  descansoCurtoButton.classList.add("active");
});

descansoLongoButton.addEventListener("click", () => {
  tempoDecorridoEmSegundos = tempDescansoLongo;
  alterarContexto("descanso-longo");
  descansoLongoButton.classList.add("active");
});

function alterarContexto(contexto) {
  zerar();
  mostrarTempo();
  buttons.forEach(function (contexto) {
    contexto.classList.remove("active");
  });

  html.setAttribute("data-contexto", contexto);
  img.setAttribute("src", `img/${contexto}.png`);

  switch (contexto) {
    case "foco":
      titulo.innerHTML = `Otimize sua produtividade, <br /> <strong class="app__title-strong">mergulhe no que importa.</strong>`;
      break;
    case "descanso-curto":
      titulo.innerHTML = `Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>`;
      break;
    case "descanso-longo":
      titulo.innerHTML = `Hora de voltar à superfície. <strong class="app__title-strong">Faça uma pausa longa.</strong>`;
      break;
    default:
      break;
  }
}

const contagemRegressiva = () => {
  if (tempoDecorridoEmSegundos <= 0) {
    musicaBeep.play();
    musica.pause();
    alert("Tempo finalizado!");
    zerar();
    return;
  }
  tempoDecorridoEmSegundos -= 1;
  mostrarTempo();
};

comecarButton.addEventListener("click", iniciarOuPausar);

// if (intervaloID) => se intervaloID tiver algum valor, podemos dar pause (chamando a função zerar())
function iniciarOuPausar() {
  if (intervaloID) {
    musicaPause.play();
    musica.pause();
    zerar();
    return;
  } else {
    if (musicaFocoInput.checked) {
      musica.play();
    }
    musicaPlay.play();
    intervaloID = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarButton.textContent = "Pausar";
    imgPlayOuPause.setAttribute("src", "img/pause.png");
  }
}

function zerar() {
  clearInterval(intervaloID);
  iniciarOuPausarButton.textContent = "Começar";
  imgPlayOuPause.setAttribute("src", "img/play_arrow.png");
  intervaloID = null;
}

function mostrarTempo() {
  let tempo = new Date(tempoDecorridoEmSegundos * 1000);
  let tempoFormatado = tempo.toLocaleTimeString("pt-br", {
    minute: "2-digit",
    second: "2-digit",
  });
  timer.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
