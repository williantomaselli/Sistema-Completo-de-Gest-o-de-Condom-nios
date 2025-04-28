import API_BASE from '/js/db_connection.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Script apartamentos.js carregado!');
  const tableBody = document.getElementById('tableBody');
  const search = document.getElementById('searchInput');
  const btnNovo = document.getElementById('btnNovo');

  btnNovo.addEventListener('click', () => {
    console.log('Clique no botão Novo Apartamento');
    window.location.href = '/manter_apartamento.html';
  });

  async function load() {
    console.log('Carregando apartamentos...');
    try {
      const res = await fetch(`${API_BASE}/apartamentos`);
      if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      const arr = await res.json();
      console.log('Dados recebidos:', arr);
      render(arr);
    } catch (e) {
      console.error('Erro ao buscar apartamentos:', e);
    }
  }

  function render(data) {
    tableBody.innerHTML = '';
    data.forEach(a => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${a.id}</td>
        <td>${a.numero}</td>
        <td>${a.bloco}</td>
        <td>${a.andar}</td>
        <td>
          <button data-id="${a.id}" class="btn btn-sm btn-info btn-consultar">Consultar</button>
          <button data-id="${a.id}" class="btn btn-sm btn-warning btn-alterar">Alterar</button>
          <button data-id="${a.id}" class="btn btn-sm btn-danger btn-excluir">Excluir</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  tableBody.addEventListener('click', async e => {
    const btn = e.target;
    const id = btn.dataset.id;
    if (btn.classList.contains('btn-alterar')) {
      window.location.href = `/manter_apartamento.html?id=${id}`;
    } else if (btn.classList.contains('btn-consultar')) {
      window.location.href = `/manter_apartamento.html?id=${id}&mode=consult`;
    } else if (btn.classList.contains('btn-excluir')) {
      if (!confirm('Confirma exclusão?')) return;
      await fetch(`${API_BASE}/apartamentos/${id}`, { method: 'DELETE' });
      load();
    }
  });

  search.addEventListener('input', () => {
    const term = search.value.toLowerCase();
    Array.from(tableBody.rows).forEach(r => {
      const num = r.cells[1].textContent.toLowerCase();
      const bloco = r.cells[2].textContent.toLowerCase();
      r.style.display = num.includes(term) || bloco.includes(term) ? '' : 'none';
    });
  });

  load();
});
