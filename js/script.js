// Produtos disponíveis
const produtos = [
  {
    id: 1,
    nome: "3 Morangos do Amor",
    preco: 29.90,
    img: "images/3_morangos.jpg"
  },
  {
    id: 2,
    nome: "6 Morangos do Amor",
    preco: 49.90,
    img: "images/6_morangos.jpg"
  },
  {
    id: 3,
    nome: "4 Uvas do Amor",
    preco: 39.90,
    img: "images/4_uvas.jpg"
  },
  {
    id: 4,
    nome: "12 Morangos e 4 Uvas",
    preco: 69.90,
    img: "images/uvas_morangos.jpg"
  }
];

// Variáveis globais
let carrinho = [];

const modalLocation = document.getElementById('modal-location');
const selectEstado = document.getElementById('select-estado');
const selectCidade = document.getElementById('select-cidade');
const btnConfirmLocation = document.getElementById('btn-confirm-location');
const loadingDiv = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const infoEntrega = document.getElementById('info-entrega');
const localizacaoConfirmada = document.getElementById('localizacao-confirmada');

const carrosselProdutos = document.getElementById('carrossel-produtos');
const listaCarrinho = document.getElementById('lista-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');
const btnFinalizar = document.getElementById('btn-finalizar');
const finalizarPedidoSection = document.getElementById('finalizar-pedido');
const formPedido = document.getElementById('form-pedido');
const btnVoltarCarrinho = document.getElementById('btn-voltar-carrinho');

// Estados e cidades (exemplo simples, pode ser ampliado)
const estadosCidades = {
  "GO": ["Goiânia", "Anápolis", "Aparecida de Goiânia"],
  "SP": ["São Paulo", "Campinas", "Santos"],
  "RJ": ["Rio de Janeiro", "Niterói", "Petrópolis"]
};

// Função para preencher select de estados
function preencherEstados() {
  selectEstado.innerHTML = "";
  for(let uf in estadosCidades){
    const option = document.createElement('option');
    option.value = uf;
    option.textContent = uf;
    selectEstado.appendChild(option);
  }
}

// Atualizar cidades conforme estado selecionado
function atualizarCidades() {
  const uf = selectEstado.value;
  selectCidade.innerHTML = "";
  estadosCidades[uf].forEach(cidade => {
    const option = document.createElement('option');
    option.value = cidade;
    option.textContent = cidade;
    selectCidade.appendChild(option);
  });
}

// Simular geolocalização pelo navegador e pré-selecionar estado e cidade
function detectarLocalizacao() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(position => {
    // Aqui seria o ponto para usar APIs de geocoding para detectar estado/cidade pela lat/lng
    // Exemplo: para teste, vamos pré-selecionar GO e Goiânia
    selectEstado.value = "GO";
    atualizarCidades();
    selectCidade.value = "Goiânia";
  }, error => {
    // Se não permitir localização, seleciona estado e cidade padrão
    selectEstado.value = "GO";
    atualizarCidades();
    selectCidade.value = "Goiânia";
  });
}

// Exibir produtos no carrossel
function exibirProdutos() {
  carrosselProdutos.innerHTML = "";
  produtos.forEach(produto => {
    const div = document.createElement('div');
    div.classList.add('produto');
    div.innerHTML = `
      <img src="${produto.img}" alt="${produto.nome}">
      <p>${produto.nome}</p>
      <p class="preco">R$ ${produto.preco.toFixed(2).replace('.',',')}</p>
      <button class="btn-add" data-id="${produto.id}">Adicionar</button>
    `;
    carrosselProdutos.appendChild(div);
  });

  // Adicionar evento de click nos botões
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      adicionarAoCarrinho(id);
    });
  });
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(id) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;

  const itemCarrinho = carrinho.find(item => item.id === id);
  if (itemCarrinho) {
    itemCarrinho.quantidade++;
  } else {
    carrinho.push({ ...produto, quantidade: 1 });
  }
  atualizarCarrinho();
}

// Atualizar carrinho na tela
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  if (carrinho.length === 0) {
    listaCarrinho.textContent = "Carrinho vazio.";
    totalCarrinho.textContent = "0,00";
    return;
  }

  let total = 0;
  carrinho.forEach(item => {
    total += item.preco * item.quantidade;
    const div = document.createElement('div');
    div.classList.add('item-carrinho');
    div.innerHTML = `
      <span>${item.nome} x${item.quantidade}</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.',',')}</span>
      <button class="btn-remove" data-id="${item.id}">&times;</button>
    `;
    listaCarrinho.appendChild(div);
  });

  totalCarrinho.textContent = total.toFixed(2).replace('.',',');

  // Eventos para remover itens
  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      removerDoCarrinho(id);
    });
  });
}

// Remover produto do carrinho
function removerDoCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
}

// Abrir finalização do pedido
btnFinalizar.addEventListener('click', () => {
  if(carrinho.length === 0){
    alert('Seu carrinho está vazio!');
    return;
  }
  document.getElementById('carrinho').style.display = 'none';
  finalizarPedidoSection.style.display = 'block';
});

// Voltar para o carrinho
btnVoltarCarrinho.addEventListener('click', () => {
  finalizarPedidoSection.style.display = 'none';
  document.getElementById('carrinho').style.display = 'block';
});

// Enviar pedido (simulação)
formPedido.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(formPedido);
  const nome = formData.get('nome');
  const telefone = formData.get('telefone');
  const endereco = formData.get('endereco');

  // Montar pedido
  const pedido = {
    cliente: { nome, telefone, endereco },
    itens: carrinho,
    total: carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0)
  };

  // Aqui você integraria com sua API PagueX (backend seguro)
  // Exemplo de chamada API comentada:
  /*
  fetch('URL_DO_SEU_BACKEND', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  })
  .then(res => res.json())
  .then(data => {
    if(data.sucesso){
      alert('Pedido realizado com sucesso! ' + data.mensagem);
      // Limpar carrinho e voltar para home
      carrinho = [];
      atualizarCarrinho();
      finalizarPedidoSection.style.display = 'none';
      document.getElementById('carrinho').style.display = 'block';
    } else {
      alert('Erro ao realizar pedido: ' + data.mensagem);
    }
  })
  .catch(err => alert('Erro de conexão: ' + err.message));
  */

  // Por enquanto, só simula sucesso:
  alert(`Pedido de R$ ${pedido.total.toFixed(2).replace('.',',')} enviado para processamento.\nObrigado, ${nome}!`);
  carrinho = [];
  atualizarCarrinho();
  finalizarPedidoSection.style.display = 'none';
  document.getElementById('carrinho').style.display = 'block';
});

// Inicialização
window.onload = () => {
  preencherEstados();
  atualizarCidades();
  detectarLocalizacao();

  btnConfirmLocation.addEventListener('click', () => {
    loadingDiv.style.display = 'block';
    setTimeout(() => {
      loadingDiv.style.display = 'none';
      modalLocation.style.display = 'none';
      mainContent.style.display = 'block';

      const estado = selectEstado.value;
      const cidade = selectCidade.value;
      localizacaoConfirmada.textContent = `${cidade} - ${estado}`;

      // Aqui você pode validar se atende a essa região
      // Se não atender, pode exibir uma mensagem e bloquear compra
    }, 2000);
  });

  exibirProdutos();
  atualizarCarrinho();
};
