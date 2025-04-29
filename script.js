const form = document.getElementById('conteudo-form');
const mensagem = document.getElementById('mensagem');
const submitButton = document.getElementById('submit-button');
const listaConteudos = document.getElementById('conteudos-lista');

// Função para buscar e listar todos os conteúdos
async function listarConteudos() {
  listaConteudos.innerHTML = "Carregando...";
  try {
    const response = await fetch('http://localhost:8000/conteudos');
    const conteudos = await response.json();
    
    if (conteudos.length === 0) {
      listaConteudos.innerHTML = "<p class='info'>Nenhum conteúdo cadastrado ainda.</p>";
      return;
    }
    
    listaConteudos.innerHTML = "";
    conteudos.forEach((c) => {
      const card = document.createElement('div');
      card.className = 'conteudo-card';
      card.innerHTML = `
        <h3>${c.titulo}</h3>
        <p><strong>Texto para leitura a IA Ecos:</strong> ${c.descricao || 'Sem texto'}</p>
        <p><strong>Autor:</strong> ${c.autor}</p>
        <p><strong>Categoria:</strong> ${c.categoria}</p>
        <p><small>ID: ${c.id}</small></p>
        <div class="botoes">
          <button onclick="editarConteudo(${c.id})">Editar</button>
          <button onclick="deletarConteudo(${c.id})">Excluir</button>
        </div>
      `;
      listaConteudos.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    listaConteudos.innerHTML = "<p class='erro'>Erro ao carregar conteúdos.</p>";
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const titulo = document.getElementById('titulo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const autor = document.getElementById('autor').value.trim();
  const categoria = document.getElementById('categoria').value;
  
  
  if (!titulo || !autor) {
    mensagem.textContent = "Título e Autor são obrigatórios.";
    mensagem.className = "mensagem erro";
    return;
  }
  
  submitButton.disabled = true;
  mensagem.textContent = "Enviando...";
  mensagem.className = "mensagem info";
  
  try {
    const response = await fetch('http://localhost:8000/conteudos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, autor, categoria })
    });
    
    if (!response.ok) {
      throw new Error('Erro ao cadastrar o conteúdo.');
    }
    
    mensagem.textContent = "Conteúdo cadastrado com sucesso!";
    mensagem.className = "mensagem sucesso";
    form.reset();
    listarConteudos(); // Atualiza lista
  } catch (error) {
    console.error(error);
    mensagem.textContent = "Erro ao cadastrar. Verifique se a API está ativa.";
    mensagem.className = "mensagem erro";
  } finally {
    submitButton.disabled = false;
  }
});

// Função para deletar
async function deletarConteudo(id) {
  if (!confirm("Deseja excluir este conteúdo?")) return;
  
  try {
    await fetch(`http://localhost:8000/conteudos/${id}`, { method: 'DELETE' });
    listarConteudos();
  } catch (error) {
    console.error(error);
    alert("Erro ao deletar conteúdo.");
  }
}

// Função para editar
async function editarConteudo(id) {
  const card = [...document.querySelectorAll('.conteudo-card')].find(c => c.querySelector('small').innerText.includes(id));
  if (!card) return;

  const tituloAtual = card.querySelector('h3').innerText;
  const descricaoAtual = card.querySelectorAll('p')[0].innerText.replace("Descrição: ", "");
  const autorAtual = card.querySelectorAll('p')[1].innerText.replace("Autor: ", "");
  const categoriaAtual = card.querySelectorAll('p')[2].innerText.replace("Categoria: ", "");

  const novoTitulo = prompt("Novo título:", tituloAtual);
  const novaDescricao = prompt("Nova descrição:", descricaoAtual);
  const novoAutor = prompt("Novo autor:", autorAtual);
  const novaCategoria = prompt("Nova categoria (Avanços Tecnológicos ou IA na Arte e Cultura):", categoriaAtual);

  if (novoTitulo && novoAutor && novaCategoria) {
    try {
      await fetch(`http://localhost:8000/conteudos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: novoTitulo,
          descricao: novaDescricao,
          autor: novoAutor,
          categoria: novaCategoria
        })
      });
      listarConteudos();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar conteúdo.");
    }
  } else {
    alert("Título, Autor e Categoria são obrigatórios.");
  }
}


// Inicializa carregando os conteúdos
listarConteudos();
