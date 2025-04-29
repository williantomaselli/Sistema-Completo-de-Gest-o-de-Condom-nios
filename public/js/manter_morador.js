// public/js/manter_morador.js
import API_BASE from '/js/db_connection.js';

document.addEventListener('DOMContentLoaded', () => {
  const form        = document.getElementById('formMorador');
  const btnSalvar   = document.getElementById('btnSalvar');
  const btnCancelar = document.getElementById('btnCancelar');
  const title       = document.getElementById('formTitle');

  const nomeEl       = document.getElementById('nome');
  const cpfEl        = document.getElementById('cpf');
  const telEl        = document.getElementById('telefone');
  const aptoEl       = document.getElementById('apartamento');
  const respEl       = document.getElementById('responsavel');
  const propEl       = document.getElementById('proprietario');
  const possuiVEl    = document.getElementById('possui_veiculo');
  const qtdVagasEl   = document.getElementById('qtd_vagas');
  const numVagaEl    = document.getElementById('numero_vaga');

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  const mode   = params.get('mode');
  const isEdit = Boolean(id) && mode !== 'consult';
  const isView = mode === 'consult';

  if (isView) {
    title.textContent       = 'Consultar Morador';
    btnSalvar.style.display = 'none';
    Array.from(form.elements).forEach(el => el.readOnly = true);
    Array.from(form.querySelectorAll('select')).forEach(el => el.disabled = true);
  }
  else if (isEdit) {
    title.textContent = 'Alterar Morador';
  }

  btnCancelar.addEventListener('click', () => {
    window.location.href = '/moradores.html';
  });

  // popula dropdown de apartamentos
  fetch(`${API_BASE}/apartamentos`)
    .then(res => res.json())
    .then(arr => {
      aptoEl.innerHTML = '<option value="">Selecione...</option>';
      arr.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = `${a.numero} (Bloco ${a.bloco})`;
        aptoEl.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar apartamentos:', err);
      aptoEl.innerHTML = '<option value="">Erro ao carregar</option>';
    });

  // carrega dados para editar/consultar
  if (id) {
    fetch(`${API_BASE}/moradores/${id}`)
      .then(res => res.json())
      .then(m => {
        nomeEl.value       = m.nome;
        cpfEl.value        = m.cpf;
        telEl.value        = m.telefone || '';
        aptoEl.value       = m.apartamento_id;
        respEl.value       = m.responsavel_pelo_apartamento;
        propEl.value       = m.proprietario_do_apartamento;
        possuiVEl.value    = m.possui_veiculo;
        qtdVagasEl.value   = m.qtd_vagas_garagem;
        numVagaEl.value    = m.numero_vaga;
      })
      .catch(err => {
        console.error('Erro ao carregar morador:', err);
        alert('Não foi possível carregar os dados.');
      });
  }

  // submit para POST ou PUT
  if (!isView) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const payload = {
        nome: nomeEl.value.trim(),
        cpf: cpfEl.value.trim(),
        telefone: telEl.value.trim(),
        apartamento_id: parseInt(aptoEl.value, 10),
        responsavel_pelo_apartamento: respEl.value,
        proprietario_do_apartamento: propEl.value,
        possui_veiculo: possuiVEl.value,
        qtd_vagas_garagem: parseInt(qtdVagasEl.value, 10) || 0,
        numero_vaga: numVagaEl.value.trim()
      };

      const method = isEdit ? 'PUT' : 'POST';
      const url    = isEdit
        ? `${API_BASE}/moradores/${id}`
        : `${API_BASE}/moradores`;

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          alert(isEdit ? 'Morador atualizado!' : 'Morador cadastrado!');
          window.location.href = '/moradores.html';
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
