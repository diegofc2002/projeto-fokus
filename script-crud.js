const buttonAdicionarTarefa = document.querySelector(".app__button--add-task");
const buttonCancelarTarefa = document.querySelector(
  ".app__form-footer__button--cancel",
);
const buttonDeletarTarefa = document.querySelector(
  ".app__form-footer__button--delete",
);
const formAdiconarTarefa = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea"); // textarea que tem dentro do formulário
const ul_tarefas = document.querySelector(".app__section-task-list");
const paragrafoDescricaoEmAndamento = document.querySelector(
  ".app__section-active-task-description",
);

const buttonRemoverTarefasConcluidas = document.querySelector(
  "#btn-remover-concluidas",
);
const buttonRemoverTodasTarefas = document.querySelector("#btn-remover-todas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let tarefaSelecionada = null;
let li_tarefaSelecionada = null;

function atualizarTarefas() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  let elemento_li = document.createElement("li");
  elemento_li.classList.add("app__section-task-list-item");

  let svg = document.createElement("svg");
  svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
    <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E"></path>
</svg>`;

  let paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  let button = document.createElement("button");
  button.classList.add("app_button-edit");

  button.onclick = () => {
    let novaDescricaoDaTarefa = prompt("Qual é o novo nome da tarefa?");

    if (novaDescricaoDaTarefa) {
      paragrafo.textContent = novaDescricaoDaTarefa; // atualiza o conteúdo textual do parágrafo com a nova descrição
      tarefa.descricao = novaDescricaoDaTarefa; // atualiza a descrição da tarefa na lista de tarefas
      atualizarTarefas(); // chama a função para atualizar as tarefas no localStorage
      alert("Tarefa atualizada com sucesso!");
    } else {
      alert(
        "Não foi possível editar a tarefa. Atualização cancelada ou valor inválido.",
      );
    }
  };

  let imgButton = document.createElement("img");
  imgButton.setAttribute("src", "img/edit.png");

  button.append(imgButton);
  elemento_li.append(svg);
  elemento_li.append(paragrafo);
  elemento_li.append(button);

  if (tarefa.completa) {
    elemento_li.classList.add("app__section-task-list-item-complete");
    button.setAttribute("disabled", "disabled");
  } else {
    elemento_li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((elemento) => {
          elemento.classList.remove("app__section-task-list-item-active");
        });

      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoEmAndamento.textContent = "";
        tarefaSelecionada = null;
        li_tarefaSelecionada = null;
        return;
      }
      tarefaSelecionada = tarefa;
      li_tarefaSelecionada = elemento_li;
      paragrafoDescricaoEmAndamento.textContent = tarefa.descricao;
      elemento_li.classList.add("app__section-task-list-item-active");
    };
  }

  return elemento_li;
}

buttonAdicionarTarefa.addEventListener("click", () => {
  formAdiconarTarefa.classList.toggle("hidden");
});

buttonCancelarTarefa.addEventListener("click", () => {
  formAdiconarTarefa.reset();
  formAdiconarTarefa.classList.add("hidden");
});

buttonDeletarTarefa.addEventListener("click", () => {
  textarea.value = "";
});

// o segundo parâmetro é uma função que será chamada quando o form for submetido; essa função que vai ser chamada recebe o evento como parâmetro
formAdiconarTarefa.addEventListener("submit", (evento) => {
  evento.preventDefault();
  // let tarefa = identifica a tarefa que estou cadastrando no momento
  let tarefa = {
    descricao: textarea.value,
  };
  tarefas.push(tarefa);
  let elementoTarefa = criarElementoTarefa(tarefa);
  ul_tarefas.append(elementoTarefa);
  atualizarTarefas();
  textarea.value = "";
  formAdiconarTarefa.classList.add("hidden");
});

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ul_tarefas.append(elementoTarefa);
});

document.addEventListener("FocoFinalizado", () => {
  if (tarefaSelecionada && li_tarefaSelecionada) {
    li_tarefaSelecionada.classList.remove("app__section-task-list-item-active");
    li_tarefaSelecionada.classList.add("app__section-task-list-item-complete");
    li_tarefaSelecionada
      .querySelector("button")
      .setAttribute("disabled", "disabled");
    tarefaSelecionada.completa = true;
    atualizarTarefas();
    tarefaSelecionada = null;
    li_tarefaSelecionada = null;
  }
});

const removerTarefas = (somenteCompletas) => {
  let seletorDeTarefasConcluidas = somenteCompletas
    ? ".app__section-task-list-item-complete"
    : ".app__section-task-list-item";
  document.querySelectorAll(seletorDeTarefasConcluidas).forEach((elemento) => {
    elemento.remove();
  });
  tarefas = somenteCompletas
    ? tarefas.filter((tarefa_da_vez) => !tarefa_da_vez.completa)
    : [];
  atualizarTarefas();
  paragrafoDescricaoEmAndamento.textContent = "";
};

buttonRemoverTarefasConcluidas.onclick = () => removerTarefas(true);
buttonRemoverTodasTarefas.onclick = () => removerTarefas(false);
