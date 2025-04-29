# 🏢 Sistema de Gestão de Condomínio

Um sistema web completo para gerenciar **blocos**, **apartamentos**, **moradores** e **pagamentos** de um condomínio.

---

## 📌 Sumário

1. [Tecnologias](#-tecnologias)  
2. [Funcionalidades](#-funcionalidades)  
3. [Estrutura do Projeto](#-estrutura-do-projeto)  
4. [Pré-requisitos](#%EF%B8%8F-pré-requisitos)  
5. [Configuração do Banco](#%EF%B8%8F-configuração-do-banco)  
6. [Instalação e Execução](#%EF%B8%8F-instalação-e-execução)  
7. [Como Usar](#-como-usar)  
8. [Contribuição](#-contribuição)  
9. [Licença](#%EF%B8%8F-licença)  

---

## 🚀 Tecnologias

| Camada      | Tecnologia           |
|-------------|----------------------|
| Back-end    | Node.js, Express.js, MySQL (mysql2) |
| Front-end   | HTML5, CSS3 (Bootstrap 5), JS (ES6 Modules) |
| Banco de Dados | MySQL              |

---

## 📋 Funcionalidades

- **Blocos**  
  - Listar, criar, editar e excluir blocos (descrição, quantidade de apartamentos).  
- **Apartamentos**  
  - CRUD de apartamentos vinculados a blocos.  
- **Moradores**  
  - CRUD de moradores com campos extras: responsável, proprietário, veículo, vagas de garagem.  
- **Pagamentos**  
  - Registrar pagamento por referência (mês/ano), exibir histórico de pagamentos.  

---

## ⚙️ Pré-requisitos

- **Node.js** v14+  
- **MySQL Server** rodando  
- Navegador moderno (Chrome, Firefox, Edge)

---

Ajuste credenciais (usuário/senha) em server.js, se necessário.

📝 Como Usar
Blocos

Clique em Novo Bloco, preencha descrição e quantidade.

Use as ações Consultar, Alterar, Excluir na listagem.

Moradores

Gerencie moradores, defina apartamento, responsabilidade, vagas e veículo.

Pagamentos

Selecione um morador e uma referência (mês/ano).

A data e o valor são preenchidos automaticamente.

Clique em Registrar Pagamento e veja o histórico na tabela abaixo.

🤝 Contribuição
Faça um fork deste repositório.

Crie uma branch:

bash
Copiar
Editar
git checkout -b feature/nova-funcionalidade
Faça seus commits:

bash
Copiar
Editar
git commit -m "Descrição da nova funcionalidade"
Envie para o repositório remoto:

bash
Copiar
Editar
git push origin feature/nova-funcionalidade
Abra um Pull Request e aguarde revisão.

📄 Licença
Este projeto está sob a licença MIT.
© 2025 Seu Nome Aqui

Copiar
Editar

