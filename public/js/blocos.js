// public/js/blocos.js
import API_BASE from '/js/db_connection.js';

document.addEventListener('DOMContentLoaded', () => {
  const tableBody   = document.getElementById('blocosTableBody');
  const searchInput = document.getElementById('searchInput');
  const btnNovo     = document.getElementById('btnNovoBloco');

  // Novo Bloco
  btnNovo.addEventListener('click', () => {
    window.location.href = '/manter_bloco.html';
  });

  // Carrega todos os blocos
  async function loadBlocos() {
    try {
      const res    = await fetch(`${API_BASE}/blocos`);
      const blocos = await res.json();
      renderTable(blocos);
    } catch (err) {
      console.error('Erro ao buscar blocos:', err);
    }
  }

  // Monta a tabela
  function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${b.id}</td>
        <td>${b.descricao}</td>
        <td>${b.qtde_apartamentos}</td>
        <td>
          <button data-id="${b.id}" class="btn btn-sm btn-info btn-consultar">Consultar</button>
          <button data-id="${b.id}" class="btn btn-sm btn-warning btn-alterar">Alterar</button>
          <button data-id="${b.id}" class="btn btn-sm btn-danger btn-excluir">Excluir</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Delegação de eventos para consultar, alterar e excluir
  tableBody.addEventListener('click', async event => {
    const btn = event.target;
    const id  = btn.dataset.id;
    if (btn.classList.contains('btn-consultar')) {
      // redireciona para consulta (modo somente leitura)
      window.location.href = `/manter_bloco.html?id=${id}&mode=consult`;
    }
    else if (btn.classList.contains('btn-alterar')) {
      window.location.href = `/manter_bloco.html?id=${id}`;
    }
    else if (btn.classList.contains('btn-excluir')) {
      if (!confirm(`Confirma exclusão do bloco #${id}?`)) return;
      try {
        const res = await fetch(`${API_BASE}/blocos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Bloco excluído com sucesso!');
          loadBlocos();
        } else {
          const err = await res.json();
          alert('Erro: ' + (err.error || res.statusText));
        }
      } catch (err) {
        console.error('Falha ao excluir:', err);
        alert('Erro de comunicação com o servidor.');
      }
    }
  });

  // Filtrar pesquisa
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    Array.from(tableBody.rows).forEach(row => {
      const desc = row.cells[1].textContent.toLowerCase();
      row.style.display = desc.includes(term) ? '' : 'none';
    });
  });

  loadBlocos();
});
