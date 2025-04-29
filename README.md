<<<<<<< HEAD
# 🏢 Sistema de Gestão de Condomínio

Um sistema web completo para gerenciar **blocos**, **apartamentos**, **moradores** e **pagamentos** de um condomínio de forma prática e centralizada.

---

## 📌 Sumário

1. [🚀 Tecnologias](#-tecnologias)  
2. [📋 Funcionalidades](#-funcionalidades)  
3. [📁 Estrutura do Projeto](#-estrutura-do-projeto)  
4. [⚙️ Pré-requisitos](#%ef%b8%8f-pré-requisitos)  
5. [💾 Configuração do Banco de Dados](#-configuração-do-banco-de-dados)  
6. [🔧 Instalação e Execução](#-instalação-e-execução)  
7. [🏝️ Como Usar](#-como-usar)  
8. [🤝 Contribuição](#-contribuição)  
9. [📄 Licença](#-licença)  

---

## 🚀 Tecnologias

| Camada       | Tecnologias                                      |
|--------------|--------------------------------------------------|
| **Back-end** | Node.js, Express.js, MySQL (mysql2)              |
| **Front-end**| HTML5, CSS3 (Bootstrap 5), JavaScript (ES6)      |
| **Banco**    | MySQL                                            |

---

## 📋 Funcionalidades

- **Blocos**
  - Criar, listar, editar e excluir blocos com descrição e quantidade de apartamentos.
- **Apartamentos**
  - Gerenciar apartamentos vinculados a blocos.
- **Moradores**
  - Cadastro de moradores com informações como responsável, proprietário, veículo e número de vagas.
- **Pagamentos**
  - Registro de pagamento mensal por morador com visualização de histórico.

---

## 📁 Estrutura do Projeto

```
project-root/
├─ schema.sql           # Script de criação e popular o banco de dados
├─ server.js            # Servidor Express com rotas da API
├─ package.json         # Dependências e scripts do projeto
└─ public/
   ├─ css/
   │  └─ styles.css     # Estilos customizados (opcional)
   ├─ js/
   │  ├─ db_connection.js
   │  ├─ blocos.js
   │  ├─ manter_bloco.js
   │  ├─ moradores.js
   │  ├─ manter_morador.js
   │  └─ pagamentos.js
   ├─ blocos.html
   ├─ manter_bloco.html
   ├─ moradores.html
   ├─ manter_morador.html
   └─ pagamentos.html
```

---

## ⚙️ Pré-requisitos

- Node.js v14+  
- MySQL Server  
- Navegador moderno (Chrome, Firefox, Edge)

---

## 💾 Configuração do Banco de Dados

1. Importe o script `schema.sql` em seu banco MySQL:

   ```bash
   mysql -u root -p < schema.sql
   ```

2. Ajuste as credenciais de conexão (usuário, senha, host) no arquivo `server.js`, conforme sua configuração local.

---

## 🔧 Instalação e Execução

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor:

   ```bash
   node server.js
   ```

3. Acesse as páginas no navegador:

   - **Blocos**: [http://localhost:3000/blocos.html](http://localhost:3000/blocos.html)
   - **Moradores**: [http://localhost:3000/moradores.html](http://localhost:3000/moradores.html)
   - **Pagamentos**: [http://localhost:3000/pagamentos.html](http://localhost:3000/pagamentos.html)

---

## 🏝️ Como Usar

### 📦 Blocos
- Clique em **"Novo Bloco"** para cadastrar um novo.
- Utilize as ações de **Editar** e **Excluir** na tabela para gerenciar.

### 🢍 Moradores
- Cadastramento com dados detalhados: apartamento, responsável, veículo, vagas.
- Listagem com opções de edição e remoção.

### 💳 Pagamentos
- Escolha um morador e uma **referência (mês/ano)**.
- Valor e data são preenchidos automaticamente.
- Registre o pagamento e acompanhe o histórico na tabela abaixo.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma nova branch com sua funcionalidade:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. Faça os commits:
   ```bash
   git commit -m "Descrição da nova funcionalidade"
   ```
4. Envie para seu repositório:
   ```bash
   git push origin feature/nova-funcionalidade
   ```
5. Abra um Pull Request e aguarde a revisão.

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.  
© 2025 Willian Vitor Correa Tomaselli


=======
