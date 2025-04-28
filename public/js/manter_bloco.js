// public/js/manter_bloco.js
import API_BASE from '/js/db_connection.js';

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('blocoForm');
  const btnSalvar   = document.getElementById('btnSalvar');
  const btnCancelar = document.getElementById('btnCancelar');
  const title       = document.getElementById('formTitle');
  const descricaoEl = document.getElementById('descricao');
  const qtdeEl      = document.getElementById('qtde');

  // Analisa query string
  const params = new URLSearchParams(window.location.search);
  const blocoId = params.get('id');
  const mode    = params.get('mode');         // possivelmente 'consult'
  const isEdit  = Boolean(blocoId) && !mode;  // se há id e NÃO é modo consult
  const isConsult = mode === 'consult';

  // Configura título e botões
  if (isConsult) {
    title.textContent    = 'Consultar Bloco';
    btnSalvar.style.display = 'none';         // oculta salvar
    descricaoEl.readOnly = true;
    qtdeEl.readOnly      = true;
  }
  else if (isEdit) {
    title.textContent = 'Alterar Bloco';
  }

  // Se for editar ou consultar, carrega dados
  if (blocoId) {
    fetch(`${API_BASE}/blocos/${blocoId}`)
      .then(res => res.json())
      .then(data => {
        descricaoEl.value = data.descricao;
        qtdeEl.value      = data.qtde_apartamentos;
      })
      .catch(err => {
        console.error('Erro ao carregar bloco:', err);
        alert('Não foi possível carregar os dados do bloco.');
      });
  }

  // Cancelar sempre volta para lista
  btnCancelar.addEventListener('click', () => {
    window.location.href = '/blocos.html';
  });

  // Apenas em modo de criação ou edição
  if (!isConsult) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const descricao = descricaoEl.value.trim();
      const qtde      = parseInt(qtdeEl.value, 10);

      const method = isEdit ? 'PUT' : 'POST';
      const url    = isEdit
        ? `${window.location.origin}${API_BASE}/blocos/${blocoId}`
        : `${window.location.origin}${API_BASE}/blocos`;

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descricao, qtde_apartamentos: qtde })
        });
        if (res.ok) {
          alert(isEdit ? 'Bloco atualizado!' : 'Bloco cadastrado!');
          window.location.href = '/blocos.html';
        } else {
          const err = await res.json();
          alert('Erro: ' + (err.error || res.statusText));
        }
      } catch (err) {
        console.error('Falha de comunicação:', err);
        alert('Não foi possível comunicar com o servidor.');
      }
    });
  }
});
