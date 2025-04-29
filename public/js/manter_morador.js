import API_BASE from '/js/db_connection.js';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('tableBody');
  const search = document.getElementById('searchInput');
  const btnNovo = document.getElementById('btnNovo');

  btnNovo.addEventListener('click', () => {
    window.location.href = '/manter_morador.html';
  });

  async function load() {
    try {
      const res = await fetch(`${API_BASE}/moradores`);
      const arr = await res.json();
      render(arr);
    } catch (e) {
      console.error('Erro ao buscar moradores:', e);
    }
  }

  function render(data) {
    tableBody.innerHTML = '';
    data.forEach(m => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${m.id}</td>
        <td>${m.nome}</td>
        <td>${m.cpf}</td>
        <td>${m.apartamento || '-'}</td>
        <td>${m.bloco || '-'}</td>
        <td>
          <button data-id="${m.id}" class="btn btn-sm btn-info btn-consultar">Consultar</button>
          <button data-id="${m.id}" class="btn btn-sm btn-warning btn-alterar">Alterar</button>
          <button data-id="${m.id}" class="btn btn-sm btn-danger btn-excluir">Excluir</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  tableBody.addEventListener('click', async e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.classList.contains('btn-alterar')) {
      window.location.href = `/manter_morador.html?id=${id}`;
    } else if (btn.classList.contains('btn-consultar')) {
      window.location.href = `/manter_morador.html?id=${id}&mode=consult`;
    } else if (btn.classList.contains('btn-excluir')) {
      if (!confirm('Confirma exclusão?')) return;
      try {
        const res = await fetch(`${API_BASE}/moradores/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Morador excluído com sucesso!');
          load();
        } else {
          const err = await res.json();
          alert('Erro: ' + (err.error || res.statusText));
        }
      } catch (e) {
        console.error('Erro ao excluir:', e);
        alert('Erro de comunicação com o servidor.');
      }
    }
  });

  // Filtro de busca
  search.addEventListener('input', () => {
    const term = search.value.toLowerCase();
    Array.from(tableBody.rows).forEach(r => {
      const nome = r.cells[1].textContent.toLowerCase();
      const cpf = r.cells[2].textContent.toLowerCase();
      const apartamento = r.cells[3].textContent.toLowerCase();
      const bloco = r.cells[4].textContent.toLowerCase();
      r.style.display = nome.includes(term) || cpf.includes(term) || apartamento.includes(term) || bloco.includes(term) ? '' : 'none';
    });
  });

  load();
});
