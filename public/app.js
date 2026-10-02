const apiUrl = '/emprestimos';
const lista = document.querySelector('#loan-list');
const contador = document.querySelector('#active-count');
const busca = document.querySelector('#search-input');
const mensagemPagina = document.querySelector('#page-feedback');
const formularioNovo = document.querySelector('#new-loan-form');
const mensagemNovo = document.querySelector('#form-feedback');
const janelaEdicao = document.querySelector('#edit-dialog');
const formularioEdicao = document.querySelector('#edit-form');
const mensagemEdicao = document.querySelector('#edit-feedback');
const cancelarEdicao = document.querySelector('#cancel-edit');

let emprestimos = [];
let idEmEdicao = null;

async function requisicao(url, opcoes = {}) {
  const resposta = await fetch(url, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json' },
  });

  if (resposta.status === 204) return null;

  const resultado = await resposta.json();
  if (!resposta.ok) throw new Error(resultado.erro || 'Ocorreu um erro.');
  return resultado;
}

function mostrarMensagem(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = `message ${tipo}`;
  elemento.hidden = false;
}

function limparMensagem(elemento) {
  elemento.textContent = '';
  elemento.hidden = true;
}

function criarBotao(texto, classe, acao) {
  const botao = document.createElement('button');
  botao.type = 'button';
  botao.className = `button ${classe}`;
  botao.textContent = texto;
  botao.addEventListener('click', acao);
  return botao;
}

function mostrarEmprestimos() {
  const termo = busca.value.toLowerCase();
  const encontrados = emprestimos.filter((emprestimo) => (
    `${emprestimo.nomeAluno} ${emprestimo.livro}`.toLowerCase().includes(termo)
  ));

  contador.textContent = emprestimos.length;
  lista.replaceChildren();

  if (encontrados.length === 0) {
    const vazio = document.createElement('p');
    vazio.className = 'empty-state';
    vazio.textContent = emprestimos.length === 0
      ? 'Nenhum empréstimo ativo.'
      : 'Nenhum resultado encontrado.';
    lista.append(vazio);
    return;
  }

  encontrados.forEach((emprestimo) => {
    const linha = document.createElement('div');
    linha.className = 'loan-row';

    const detalhes = document.createElement('div');
    detalhes.className = 'loan-details';

    const livro = document.createElement('h3');
    livro.textContent = emprestimo.livro;
    const aluno = document.createElement('p');
    aluno.textContent = `Com ${emprestimo.nomeAluno}`;
    detalhes.append(livro, aluno);

    const botoes = document.createElement('div');
    botoes.className = 'loan-actions';
    botoes.append(
      criarBotao('Editar', 'secondary', () => abrirEdicao(emprestimo)),
      criarBotao('Devolver', 'return-button', () => devolverEmprestimo(emprestimo)),
    );

    linha.append(detalhes, botoes);
    lista.append(linha);
  });
}

async function carregarEmprestimos() {
  limparMensagem(mensagemPagina);
  try {
    emprestimos = await requisicao(apiUrl);
    mostrarEmprestimos();
  } catch (erro) {
    emprestimos = [];
    mostrarEmprestimos();
    mostrarMensagem(mensagemPagina, erro.message, 'error');
  }
}

formularioNovo.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparMensagem(mensagemNovo);

  const dados = Object.fromEntries(new FormData(formularioNovo));
  try {
    await requisicao(apiUrl, {
      method: 'POST',
      body: JSON.stringify(dados),
    });
    formularioNovo.reset();
    mostrarMensagem(mensagemNovo, 'Empréstimo registrado.', 'success');
    await carregarEmprestimos();
  } catch (erro) {
    mostrarMensagem(mensagemNovo, erro.message, 'error');
  }
});

function abrirEdicao(emprestimo) {
  idEmEdicao = emprestimo.id;
  formularioEdicao.elements.nomeAluno.value = emprestimo.nomeAluno;
  formularioEdicao.elements.livro.value = emprestimo.livro;
  limparMensagem(mensagemEdicao);
  janelaEdicao.hidden = false;
}

formularioEdicao.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparMensagem(mensagemEdicao);

  const dados = Object.fromEntries(new FormData(formularioEdicao));
  try {
    await requisicao(`${apiUrl}/${idEmEdicao}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
    janelaEdicao.hidden = true;
    await carregarEmprestimos();
    mostrarMensagem(mensagemPagina, 'Empréstimo atualizado.', 'success');
  } catch (erro) {
    mostrarMensagem(mensagemEdicao, erro.message, 'error');
  }
});

cancelarEdicao.addEventListener('click', () => {
  janelaEdicao.hidden = true;
});

async function devolverEmprestimo(emprestimo) {
  if (!window.confirm(`Registrar a devolução de "${emprestimo.livro}"?`)) return;

  try {
    await requisicao(`${apiUrl}/${emprestimo.id}`, { method: 'DELETE' });
    await carregarEmprestimos();
    mostrarMensagem(mensagemPagina, 'Devolução registrada.', 'success');
  } catch (erro) {
    mostrarMensagem(mensagemPagina, erro.message, 'error');
  }
}

busca.addEventListener('input', mostrarEmprestimos);
carregarEmprestimos();