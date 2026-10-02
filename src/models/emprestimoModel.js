import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dataFile = fileURLToPath(new URL('../data.json', import.meta.url));

export async function listarTodos() {
  try {
    const conteudo = await readFile(dataFile, 'utf8');
    return JSON.parse(conteudo);
  } catch (erro) {
    if (erro.code === 'ENOENT') {
      return [];
    }

    throw erro;
  }
}

export async function salvarTodos(emprestimos) {
  await writeFile(dataFile, `${JSON.stringify(emprestimos, null, 2)}\n`);
}