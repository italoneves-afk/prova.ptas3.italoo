import * as emprestimoModel from '../models/emprestimoModel.js';

function criarErro(mensagem, status) {
  const erro = new Error(mensagem);
  erro.status = status;
  return erro;
}

function validarCamposObrigatorios(dados) {
  const camposFaltantes = ['nomeAluno', 'livro'].filter((campo) => (
    typeof dados[campo] !== 'string' || dados[campo].trim() === ''
  ));

  if (camposFaltantes.length > 0) {
    throw criarErro(`Campo(s) obrigatório(s): ${camposFaltantes.join(', ')}.`, 400);
  }
}

function validarLivroDisponivel(emprestimos, livro, idIgnorado) {
  const livroEmprestado = emprestimos.some((emprestimo) => (
    emprestimo.id !== idIgnorado
    && emprestimo.devolvidoEm === null
    && emprestimo.livro.toLocaleLowerCase() === livro.trim().toLocaleLowerCase()
  ));

  if (livroEmprestado) {
    throw criarErro('Este livro já possui um empréstimo ativo.', 409);
  }
}

async function buscarPorId(id) {
  const emprestimos = await emprestimoModel.listarTodos();
  const emprestimo = emprestimos.find((item) => item.id === id);

  if (!emprestimo) {
    throw criarErro('Empréstimo não encontrado.', 404);
  }

  return { emprestimos, emprestimo };
}

export async function listarAtivos() {
  const emprestimos = await emprestimoModel.listarTodos();
  return emprestimos.filter((emprestimo) => emprestimo.devolvidoEm === null);
}

export async function obterPorId(id) {
  const { emprestimo } = await buscarPorId(id);
  return emprestimo;
}

export async function criar(dados) {
  validarCamposObrigatorios(dados);
  const emprestimos = await emprestimoModel.listarTodos();
  validarLivroDisponivel(emprestimos, dados.livro);

  const novoEmprestimo = {
    id: emprestimos.reduce((maiorId, item) => Math.max(maiorId, item.id), 0) + 1,
    nomeAluno: dados.nomeAluno.trim(),
    livro: dados.livro.trim(),
    devolvidoEm: null,
  };

  emprestimos.push(novoEmprestimo);
  await emprestimoModel.salvarTodos(emprestimos);
  return novoEmprestimo;
}

export async function substituir(id, dados) {
  validarCamposObrigatorios(dados);
  const { emprestimos, emprestimo } = await buscarPorId(id);
  validarLivroDisponivel(emprestimos, dados.livro, id);

  const atualizado = {
    id,
    nomeAluno: dados.nomeAluno.trim(),
    livro: dados.livro.trim(),
    devolvidoEm: emprestimo.devolvidoEm,
  };
  const indice = emprestimos.findIndex((item) => item.id === id);
  emprestimos[indice] = atualizado;
  await emprestimoModel.salvarTodos(emprestimos);
  return atualizado;
}

export async function atualizarParcialmente(id, dados) {
  const camposPermitidos = {};
  for (const campo of ['nomeAluno', 'livro']) {
    if (Object.hasOwn(dados, campo)) {
      if (typeof dados[campo] !== 'string' || dados[campo].trim() === '') {
        throw criarErro(`O campo ${campo} deve ser um texto não vazio.`, 400);
      }
      camposPermitidos[campo] = dados[campo].trim();
    }
  }

  const { emprestimos, emprestimo } = await buscarPorId(id);
  const atualizado = { ...emprestimo, ...camposPermitidos, id: emprestimo.id };
  validarLivroDisponivel(emprestimos, atualizado.livro, id);

  const indice = emprestimos.findIndex((item) => item.id === id);
  emprestimos[indice] = atualizado;
  await emprestimoModel.salvarTodos(emprestimos);
  return atualizado;
}

export async function devolver(id) {
  const { emprestimos, emprestimo } = await buscarPorId(id);
  if (emprestimo.devolvidoEm !== null) {
    throw criarErro('Este empréstimo já foi devolvido.', 409);
  }

  const atualizado = { ...emprestimo, devolvidoEm: new Date().toISOString() };
  const indice = emprestimos.findIndex((item) => item.id === id);
  emprestimos[indice] = atualizado;
  await emprestimoModel.salvarTodos(emprestimos);
}