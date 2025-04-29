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
  password : 'root',
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

// Recuperar todos os blocos
app.get('/api/blocos', (req, res) => {
  db.query(
    'SELECT id, descricao, qtde_apartamentos FROM bloco',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Recuperar 1 bloco por id
app.get('/api/blocos/:id', (req, res) => {
  const { id } = req.params;
  db.query(
    'SELECT id, descricao, qtde_apartamentos FROM bloco WHERE id = ?',
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ error: 'Bloco não encontrado' });
      res.json(results[0]);
    }
  );
});

// Criar novo bloco
app.post('/api/blocos', (req, res) => {
  console.log('>> Chegou POST /api/blocos:', req.body);
  const { descricao, qtde_apartamentos } = req.body;
  if (!descricao || !qtde_apartamentos) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  db.query(
    'INSERT INTO bloco (descricao, qtde_apartamentos) VALUES (?, ?)',
    [descricao, qtde_apartamentos],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Bloco já cadastrado' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId });
    }
  );
});

// Atualizar bloco existente
app.put('/api/blocos/:id', (req, res) => {
  console.log('>> Chegou PUT /api/blocos/:id', req.params.id, req.body);
  const { id } = req.params;
  const { descricao, qtde_apartamentos } = req.body;
  if (!descricao || !qtde_apartamentos) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }
  db.query(
    'UPDATE bloco SET descricao = ?, qtde_apartamentos = ? WHERE id = ?',
    [descricao, qtde_apartamentos, id],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Bloco já cadastrado' });
        }
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Bloco não encontrado' });
      }
      res.json({ message: 'Atualizado com sucesso' });
    }
  );
});

// Deletar bloco
app.delete('/api/blocos/:id', (req, res) => {
    const { id } = req.params;
    db.query(
      'DELETE FROM bloco WHERE id = ?',
      [id],
      (err, result) => {
        if (err) {
          // trata erro de FK (se houver apartamentos vinculados)
          if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res
              .status(409)
              .json({ error: 'Não é possível excluir: existem apartamentos vinculados.' });
          }
          return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Bloco não encontrado' });
        }
        res.json({ message: 'Bloco excluído com sucesso' });
      }
    );
  });
  

  // Recuperar todos os apartamentos
app.get('/api/apartamentos', (req, res) => {
    const sql = `
      SELECT a.id, a.numero, a.andar, b.descricao AS bloco
      FROM apartamento a
      JOIN bloco b ON a.bloco_id = b.id
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });
  
  // Recuperar 1 apartamento por id
  app.get('/api/apartamentos/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
      SELECT id, numero, andar, bloco_id
      FROM apartamento
      WHERE id = ?
    `;
    db.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ error: 'Apartamento não encontrado' });
      res.json(results[0]);
    });
  });
  
  // Criar novo apartamento
  app.post('/api/apartamentos', (req, res) => {
    console.log('POST /api/apartamentos', req.body);
    const { numero, bloco_id, andar } = req.body;
    if (!numero || !bloco_id || !andar) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const sql = 'INSERT INTO apartamento (numero, bloco_id, andar) VALUES (?, ?, ?)';
    db.query(sql, [numero, bloco_id, andar], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Apartamento já cadastrado neste bloco' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId });
    });
  });
  
  // Atualizar apartamento
  app.put('/api/apartamentos/:id', (req, res) => {
    const { id } = req.params;
    const { numero, bloco_id, andar } = req.body;
    if (!numero || !bloco_id || !andar) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const sql = 'UPDATE apartamento SET numero = ?, bloco_id = ?, andar = ? WHERE id = ?';
    db.query(sql, [numero, bloco_id, andar, id], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Apartamento já cadastrado neste bloco' });
        }
        return res.status(500).json({ error: err.message });
      }
      if (!result.affectedRows) return res.status(404).json({ error: 'Apartamento não encontrado' });
      res.json({ message: 'Atualizado com sucesso' });
    });
  });
  
  // Deletar apartamento
  app.delete('/api/apartamentos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM apartamento WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!result.affectedRows) return res.status(404).json({ error: 'Apartamento não encontrado' });
      res.json({ message: 'Excluído com sucesso' });
    });
  });

  // Recuperar todos os moradores
app.get('/api/moradores', (req, res) => {
    const sql = `
      SELECT m.id, m.nome, m.cpf, a.numero AS apartamento, b.descricao AS bloco
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
      SELECT id, nome, cpf, telefone, apartamento_id
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
    const { nome, cpf, telefone, apartamento_id } = req.body;
    if (!nome || !cpf || !apartamento_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const sql = 'INSERT INTO morador (nome, cpf, telefone, apartamento_id) VALUES (?, ?, ?, ?)';
    db.query(sql, [nome, cpf, telefone, apartamento_id], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'CPF já cadastrado' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId });
    });
  });
  
  // Atualizar morador
  app.put('/api/moradores/:id', (req, res) => {
    const { id } = req.params;
    const { nome, cpf, telefone, apartamento_id } = req.body;
    if (!nome || !cpf || !apartamento_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }
    const sql = 'UPDATE morador SET nome = ?, cpf = ?, telefone = ?, apartamento_id = ? WHERE id = ?';
    db.query(sql, [nome, cpf, telefone, apartamento_id, id], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'CPF já cadastrado' });
        }
        return res.status(500).json({ error: err.message });
      }
      if (!result.affectedRows) return res.status(404).json({ error: 'Morador não encontrado' });
      res.json({ message: 'Atualizado com sucesso' });
    });
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
