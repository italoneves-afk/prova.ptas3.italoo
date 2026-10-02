import * as emprestimoService from '../services/emprestimoService.js';

function converterId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    const erro = new Error('O id deve ser um número inteiro positivo.');
    erro.status = 400;
    throw erro;
  }
  return id;
}

function obterBody(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    const erro = new Error('O corpo da requisição deve ser um objeto JSON.');
    erro.status = 400;
    throw erro;
  }
  return body;
}

export async function listar(req, res, next) {
  try {
    res.status(200).json(await emprestimoService.listarAtivos());
  } catch (erro) {
    next(erro);
  }
}

export async function obter(req, res, next) {
  try {
    const emprestimo = await emprestimoService.obterPorId(converterId(req.params.id));
    res.status(200).json(emprestimo);
  } catch (erro) {
    next(erro);
  }
}

export async function criar(req, res, next) {
  try {
    const emprestimo = await emprestimoService.criar(obterBody(req.body));
    res.status(201).json(emprestimo);
  } catch (erro) {
    next(erro);
  }
}

export async function substituir(req, res, next) {
  try {
    const emprestimo = await emprestimoService.substituir(
      converterId(req.params.id),
      obterBody(req.body),
    );
    res.status(200).json(emprestimo);
  } catch (erro) {
    next(erro);
  }
}

export async function atualizarParcialmente(req, res, next) {
  try {
    const body = obterBody(req.body);
    const emprestimo = await emprestimoService.atualizarParcialmente(
      converterId(req.params.id),
      body,
    );
    res.status(200).json(emprestimo);
  } catch (erro) {
    next(erro);
  }
}

export async function devolver(req, res, next) {
  try {
    await emprestimoService.devolver(converterId(req.params.id));
    res.status(204).end();
  } catch (erro) {
    next(erro);
  }
}