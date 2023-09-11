# Kanban ReactJs

Este é um projeto de quadro Kanban. 
O termo “Kanban” é de origem japonesa e significa “sinalização” ou “cartão”, e propõe o uso de cartões (post-its) para indicar e acompanhar o andamento de uma produção dentro de uma indústria ou empresa. Trata-se de um sistema visual que busca gerenciar o trabalho conforme ele se move pelo processo.
O layout do quadro kanban foi inspirado no seguinte design do Figma: https://www.figma.com/file/a1Bwfmkw5w2BOdsV4PIeDy/Kanban-Board?node-id=5%3A1284.
 
O projeto "Kanban" é uma aplicação que permite o gerenciamento de atividades.

Principais funcionalidades do projeto:

- Cadastro, edição e exclusão de tarefas, incluindo informações como título, descrição e tags(As tags também podem ser gerenciadas dentro de cada tarefa).
- Cadastro, edição e exclusão de colunas de tarefas, incluindo informações como título e uma cor para a coluna.
- Ordenar as colunas.
- Mover as tarefas para as outras colunas e ordenar elas dentro da própria coluna.

O projeto utiliza tecnologias como ReactJs para o desenvolvimento da interface do usuário, Vite como ferramenta de construção e JSON server para o back-end.

## Requisitos do Sistema
Certifique-se de que você tenha as seguintes ferramentas instaladas em seu sistema:

Node.js (https://nodejs.org)

## Instalação

Clone o repositório do projeto:

```bash
 git clone https://github.com/annajuliafc/kanban.git
```

### Instalação e Execução - Front-end

Execute o seguinte comando para instalar as dependências necessárias.

```bash
  npm install
```

Execute o seguinte comando para iniciar o servidor do front-end.

```bash
  npm run dev
```

### Execução do Back-end

Navegue até a pasta back-end no terminal.

```bash
  cd ./back-end
```
Execute o seguinte comando para iniciar o servidor do back-end.

```bash
  json-server --watch db.json --port 3000
```


## Acesso à Aplicação

Após seguir os passos acima, acesse a aplicação em seu navegador através da seguinte URL:

Front-end: http://localhost:5173

## Considerações Finais

Este projeto é uma aplicação em desenvolvimento e está sujeito a melhorias e modificações. Caso encontre algum problema ou queira contribuir com o projeto, sinta-se à vontade para abrir um issue ou pull request no repositório do projeto (link do repositório).

ToDo (Melhorias e correções de bugs previstas):
- 'Warning' em alguns trechos no componente Board.
- Criação de um back-end em Node.js e Express para melhorar e optimizar a forma de atualização do kanban no servidor.

Agradecemos por utilizar o nosso Kanban!
