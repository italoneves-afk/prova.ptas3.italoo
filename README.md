# Biblioteca do IFMS Campus N.A.

Aplicação simples para controlar empréstimos de livros. A tela é feita com HTML, CSS e JavaScript; a API Express salva os dados em `src/data.json`.

## Instalação e execução

```bash
npm install
npm start
```

A aplicação fica disponível em `http://localhost:3000`.

## Usar a tela

Abra `http://localhost:3000` para ver os empréstimos ativos, buscar por aluno ou livro, cadastrar um empréstimo, editar os dados ou registrar uma devolução.

## Endpoints

- `GET /emprestimos`: lista empréstimos ativos.
- `GET /emprestimos/:id`: consulta um empréstimo pelo id.
- `POST /emprestimos`: cadastra empréstimo com `nomeAluno` e `livro`.
- `PUT /emprestimos/:id`: substitui `nomeAluno` e `livro`.
- `PATCH /emprestimos/:id`: atualiza parcialmente `nomeAluno` e/ou `livro`; `id` e `devolvidoEm` não podem ser alterados pelo body.
- `DELETE /emprestimos/:id`: registra a devolução com data ISO e responde sem conteúdo.

Um livro não pode ter mais de um empréstimo ativo. Erros são respondidos no formato `{ "erro": "mensagem" }`.