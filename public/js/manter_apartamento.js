import API_BASE from '/js/db_connection.js';

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('form');
  const title       = document.getElementById('formTitle');
  const numeroEl    = document.getElementById('numero');
  const blocoEl     = document.getElementById('bloco');
  const andarEl     = document.getElementById('andar');
  const btnCancelar = document.getElementById('btnCancelar');

  let isEdit = false;
  let isConsult = false;

  // Captura query params
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  const mode   = params.get('mode');
  isEdit      = Boolean(id) && !mode;
  isConsult   = mode === 'consult';

  // Configura formulário
  if (isConsult) {
    title.textContent      = 'Consultar Apartamento';
    document.getElementById('btnSalvar').style.display = 'none';
    numeroEl.readOnly      = true;
    blocoEl.disabled       = true;
    andarEl.readOnly       = true;
  } else if (isEdit) {
    title.textContent = 'Alterar Apartamento';
  }

  // Cancelar volta à lista
  btnCancelar.addEventListener('click', () => {
    window.location.href = '/apartamentos.html';
  });

  // Carrega lista de blocos para select
  async function loadBlocos() {
    try {
      const res    = await fetch(`${API_BASE}/blocos`);
      const blocos = await res.json();
      blocoEl.innerHTML = '<option value="">Selecione...</option>' +
        blocos.map(b => `<option value="${b.id}">${b.descricao}</option>`).join('');
    } catch (e) {
      console.error('Erro ao carregar blocos', e);
    }
  }

  // Se editar/consultar, busca dados do apto
  if (id) {
    fetch(`${API_BASE}/apartamentos/${id}`)
      .then(r => r.json())
      .then(data => {
        numeroEl.value = data.numero;
        andarEl.value  = data.andar;
        blocoEl.value  = data.bloco_id;
      });
  }

  // Submissão (criar ou atualizar)
  if (!isConsult) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        numero: numeroEl.value.trim(),
        bloco_id: blocoEl.value,
        andar: parseInt(andarEl.value, 10)
      };
      const method = isEdit ? 'PUT' : 'POST';
      const url    = isEdit
        ? `${window.location.origin}${API_BASE}/apartamentos/${id}`
        : `${window.location.origin}${API_BASE}/apartamentos`;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(isEdit ? 'Apartamento atualizado!' : 'Apartamento cadastrado!');
        window.location.href = '/apartamentos.html';
      } else {
        const err = await res.json();
        alert('Erro: ' + (err.error || res.statusText));
      }
    });
  }

  // Carrega blocos e, depois, se for criar, não espera fetch de apto
  loadBlocos();
});