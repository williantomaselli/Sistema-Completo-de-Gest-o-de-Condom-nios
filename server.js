// server.js
const express = require('express');
const mysql   = require('mysql2');
const path    = require('path');
const app     = express();
const PORT    = 3000;

// Configuração MySQL
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'creci3425',
  database : 'condominio'
});
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado ao MySQL');
});

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Redireciona root para blocos.html
app.get('/', (req, res) => res.redirect('/blocos.html'));

// ——— CRUD de Blocos (permanece igual ao seu) ———
// … (suas rotas /api/blocos aqui) …

// ——— CRUD de Apartamentos (permanece igual ao seu) ———
// … (suas rotas /api/apartamentos aqui) …

// ——— CRUD de Moradores (ATUALIZADO) ———

// Recuperar todos os moradores
app.get('/api/moradores', (req, res) => {
  const sql = `
    SELECT m.id,
           m.nome,
           m.cpf,
           m.telefone,
           a.numero    AS apartamento,
           b.descricao AS bloco,
           m.apartamento_id,
           m.responsavel_pelo_apartamento,
           m.proprietario_do_apartamento,
           m.possui_veiculo,
           m.qtd_vagas_garagem,
           m.numero_vaga
    FROM morador m
    JOIN apartamento a ON m.apartamento_id = a.id
    JOIN bloco b ON a.bloco_id = b.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Recuperar 1 morador por id
app.get('/api/moradores/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id,
           nome,
           cpf,
           telefone,
           apartamento_id,
           responsavel_pelo_apartamento,
           proprietario_do_apartamento,
           possui_veiculo,
           qtd_vagas_garagem,
           numero_vaga
    FROM morador
    WHERE id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!results.length) return res.status(404).json({ error: 'Morador não encontrado' });
    res.json(results[0]);
  });
});

// Criar novo morador
app.post('/api/moradores', (req, res) => {
  const {
    nome,
    cpf,
    telefone,
    apartamento_id,
    responsavel_pelo_apartamento,
    proprietario_do_apartamento,
    possui_veiculo,
    qtd_vagas_garagem,
    numero_vaga
  } = req.body;

  if (!nome || !cpf || !apartamento_id) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const sql = `
    INSERT INTO morador
      (nome, cpf, telefone, apartamento_id,
       responsavel_pelo_apartamento,
       proprietario_do_apartamento,
       possui_veiculo,
       qtd_vagas_garagem,
       numero_vaga)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      nome,
      cpf,
      telefone,
      apartamento_id,
      responsavel_pelo_apartamento,
      proprietario_do_apartamento,
      possui_veiculo,
      qtd_vagas_garagem,
      numero_vaga
    ],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'CPF já cadastrado' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId });
    }
  );
});

// Atualizar morador
app.put('/api/moradores/:id', (req, res) => {
  const { id } = req.params;
  const {
    nome,
    cpf,
    telefone,
    apartamento_id,
    responsavel_pelo_apartamento,
    proprietario_do_apartamento,
    possui_veiculo,
    qtd_vagas_garagem,
    numero_vaga
  } = req.body;

  if (!nome || !cpf || !apartamento_id) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const sql = `
    UPDATE morador SET
      nome                         = ?,
      cpf                          = ?,
      telefone                     = ?,
      apartamento_id               = ?,
      responsavel_pelo_apartamento = ?,
      proprietario_do_apartamento  = ?,
      possui_veiculo               = ?,
      qtd_vagas_garagem            = ?,
      numero_vaga                  = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      nome,
      cpf,
      telefone,
      apartamento_id,
      responsavel_pelo_apartamento,
      proprietario_do_apartamento,
      possui_veiculo,
      qtd_vagas_garagem,
      numero_vaga,
      id
    ],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'CPF já cadastrado' });
        }
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Morador não encontrado' });
      }
      res.json({ message: 'Atualizado com sucesso' });
    }
  );
});

// Deletar morador
app.delete('/api/moradores/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM morador WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!result.affectedRows) return res.status(404).json({ error: 'Morador não encontrado' });
    res.json({ message: 'Excluído com sucesso' });
  });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
