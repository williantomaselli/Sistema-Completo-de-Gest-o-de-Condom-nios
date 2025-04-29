import API_BASE from '/js/db_connection.js';

const tipoEl    = document.getElementById('tipo');
const dataEl    = document.getElementById('data');
const horaEl    = document.getElementById('hora');
const localEl   = document.getElementById('local');
const descEl    = document.getElementById('descricao');
const idEl      = document.getElementById('manutId');
const form      = document.getElementById('manutForm');
const tableBody = document.getElementById('manutTable');
const pageTitle = document.getElementById('pageTitle');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');

let manutList = [];

// carregar tipos de manutenção
async function loadTipos() {
  const res = await fetch(`${API_BASE}/tipos_manutencao`);
  const arr = await res.json();
  tipoEl.innerHTML = '<option value="">Selecione...</option>';
  arr.forEach(t => {
    const o = document.createElement('option'); o.value = t.id; o.textContent = t.descricao;
    tipoEl.appendChild(o);
  });
}

// carregar manutenções
async function loadManuts() {
  const res = await fetch(`${API_BASE}/manutencoes`);
  manutList = await res.json();
  renderTable();
}

function renderTable() {
  tableBody.innerHTML = '';
  manutList.forEach(m => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.tipo_descricao||m.tipo_id}</td>
      <td>${m.data}</td>
      <td>${m.hora||''}</td>
      <td>${m.local}</td>
      <td>
        <button class="btn btn-sm btn-info btn-edit" data-id="${m.id}">Editar</button>
        <button class="btn btn-sm btn-danger btn-del" data-id="${m.id}">Excluir</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

// edition
tableBody.addEventListener('click', async e => {
  const btn = e.target;
  const id = btn.dataset.id;
  if (btn.classList.contains('btn-del')) {
    if (!confirm('Excluir manutenção?')) return;
    await fetch(`${API_BASE}/manutencoes/${id}`, { method: 'DELETE' });
    loadManuts();
  }
  if (btn.classList.contains('btn-edit')) {
    const m = manutList.find(x=>x.id==id);
    idEl.value = m.id;
    tipoEl.value = m.tipo_id;
    dataEl.value = m.data;
    horaEl.value = m.hora || '';
    localEl.value = m.local;
    descEl.value = m.descricao;
    pageTitle.textContent = 'Editar Manutenção';
    btnSalvar.textContent = 'Atualizar';
  }
});

// cancelar edição
btnCancelar.addEventListener('click', () => {
  form.reset(); idEl.value = '';
  pageTitle.textContent = 'Cadastro de Manutenção';
  btnSalvar.textContent = 'Salvar';
});

// submit (create/update)
form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    tipo_id: parseInt(tipoEl.value,10),
    data: dataEl.value,
    local: localEl.value.trim(),
    descricao: descEl.value.trim()
  };
  const id = idEl.value;
  const url = id ? `${API_BASE}/manutencoes/${id}` : `${API_BASE}/manutencoes`;
  const method = id ? 'PUT' : 'POST';
  const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (res.ok) {
    form.reset(); idEl.value = '';
    pageTitle.textContent = 'Cadastro de Manutenção'; btnSalvar.textContent = 'Salvar';
    loadManuts();
  } else {
    const err = await res.json(); alert(err.error||'Erro');
  }
});

// inicialização
loadTipos();
loadManuts();