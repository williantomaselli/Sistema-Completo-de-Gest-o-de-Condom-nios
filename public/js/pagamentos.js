import API_BASE from '/js/db_connection.js';

const moradorEl    = document.getElementById('morador');
const referenciaEl = document.getElementById('referencia');
const dataEl       = document.getElementById('data_pagamento');
const valorEl      = document.getElementById('valor_pago');
const form         = document.getElementById('pagamentoForm');
const btnCancel    = document.getElementById('btnCancelar');
const tableBody    = document.getElementById('pagamentosTable');

// Carrega lista de moradores
async function loadMoradores() {
  const res = await fetch(`${API_BASE}/moradores`);
  const arr = await res.json();
  moradorEl.innerHTML = '<option value="">Selecione...</option>';
  arr.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.nome} (Apto ${m.apartamento} - Bloco ${m.bloco})`;
    moradorEl.appendChild(opt);
  });
}

// Carrega lista de referências
async function loadReferencias() {
  try {
    const res = await fetch(`${API_BASE}/referencias`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.json();
    referenciaEl.innerHTML = '<option value="">Selecione...</option>';
    arr.forEach(r => {
      const valorNum = parseFloat(r.valor);
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = `${r.mes}/${r.ano} - R$ ${valorNum.toFixed(2)}`;
      opt.dataset.valor = valorNum;
      referenciaEl.appendChild(opt);
    });
  } catch (err) {
    console.error('Erro ao carregar referencias:', err);
    referenciaEl.innerHTML = '<option value="">Erro ao carregar</option>';
  }
}

// Quando muda referência, ajusta valor
referenciaEl.addEventListener('change', () => {
  const sel = referenciaEl.selectedOptions[0];
  if (sel && sel.dataset.valor != null) {
    valorEl.value = parseFloat(sel.dataset.valor).toFixed(2);
  } else {
    valorEl.value = '';
  }
});

// Carrega tabela de pagamentos
async function loadPagamentos() {
  const res = await fetch(`${API_BASE}/pagamentos`);
  const arr = await res.json();
  tableBody.innerHTML = '';
  arr.forEach(p => {
    const valorNum = parseFloat(p.valor_pago);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.morador}</td>
      <td>${p.apartamento}</td>
      <td>${p.bloco}</td>
      <td>${p.mes}/${p.ano}</td>
      <td>${p.data_pagamento}</td>
      <td>${isNaN(valorNum) ? p.valor_pago : valorNum.toFixed(2)}</td>
    `;
    tableBody.appendChild(tr);
  });
}

// Cancela e limpa o form
btnCancel.addEventListener('click', () => form.reset());

// Handle submit: registra pagamento
form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    morador_id:    parseInt(moradorEl.value, 10),
    referencia_id: parseInt(referenciaEl.value, 10),
    data_pagamento: dataEl.value,
    valor_pago:    parseFloat(valorEl.value)
  };

  const res = await fetch(`${API_BASE}/pagamentos`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload)
  });

  if (res.ok) {
    alert('Pagamento registrado!');
    form.reset();
    loadPagamentos();
  } else {
    const err = await res.json();
    alert('Erro: ' + (err.error || res.statusText));
  }
});

// Inicializa tudo ao carregar
loadMoradores();
loadReferencias();
loadPagamentos();