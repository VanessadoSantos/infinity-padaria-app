const pedido = [];

function formatPreco(preco) {
  return preco.toFixed(2).replace('.', ',');
}

function adicionarProduto(nome, valor) {
  const item = pedido.find((produto) => produto.nome === nome);
  if (item) {
    item.quantidade += 1;
  } else {
    pedido.push({ nome, valor, quantidade: 1 });
  }
  atualizarPedido();
}

function atualizarPedido() {
  const pedidoList = document.getElementById('pedido-list');
  const totalProdutos = document.getElementById('total-produtos');
  const tarifaEntrega = document.getElementById('tarifa-entrega');
  const totalGeral = document.getElementById('total-geral');

  if (!pedidoList) return;

  pedidoList.innerHTML = '';
  if (!pedido.length) {
    pedidoList.innerHTML = '<p class="empty-cart">Nenhum produto selecionado ainda.</p>';
  } else {
    pedido.forEach((produto, index) => {
      const item = document.createElement('div');
      item.className = 'pedido-item';
      item.innerHTML = `
        <div>
          <strong>${produto.nome}</strong>
          <span>Quantidade: ${produto.quantidade}</span>
        </div>
        <div>
          <span>R$ ${(produto.valor * produto.quantidade).toFixed(2).replace('.', ',')}</span>
          <button type="button" onclick="removerProduto(${index})">Remover</button>
        </div>
      `;
      pedidoList.appendChild(item);
    });
  }

  const totalProd = calcularTotal();
  const tarifa = calcularTarifaValor();

  if (totalProdutos) totalProdutos.textContent = totalProd.toFixed(2).replace('.', ',');
  if (tarifaEntrega) tarifaEntrega.textContent = tarifa.toFixed(2).replace('.', ',');
  if (totalGeral) totalGeral.textContent = (totalProd + tarifa).toFixed(2).replace('.', ',');
}

function removerProduto(index) {
  pedido.splice(index, 1);
  atualizarPedido();
}

function calcularTotal() {
  return pedido.reduce((soma, item) => soma + item.valor * item.quantidade, 0);
}

// Validações auxiliares
function validarWhatsApp(whatsapp) {
  const apenasNumeros = whatsapp.replace(/\D/g, '');
  return apenasNumeros.length >= 11;
}

function validarCEP(cep) {
  const apenasNumeros = cep.replace(/\D/g, '');
  return apenasNumeros.length === 8;
}

function validarCPF(cpf) {
  const apenasNumeros = cpf.replace(/\D/g, '');
  return apenasNumeros.length === 11;
}

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function calcularTarifa() {
  const cepCliente = document.getElementById('cep')?.value.replace(/\D/g, '') || '';
  const tarifaInfo = document.getElementById('tarifa-info');
  const tarifaEntrega = document.getElementById('tarifa-entrega');

  if (!tarifaInfo || !tarifaEntrega) return;

  const cepPadaria = '01234567'; // CEP fictício da padaria - ALTERAR COM CEP REAL

  if (cepCliente.length < 8) {
    tarifaEntrega.textContent = '0,00';
    tarifaInfo.textContent = 'Digite o CEP com 8 dígitos para calcular a tarifa.';
    return;
  }

  let valor = 5; // A pé por padrão
  let tipo = 'Entrega a pé';

  if (cepCliente === cepPadaria) {
    valor = 5;
    tipo = 'Entrega a pé (mesmo CEP)';
  } else if (cepCliente.substring(0, 4) === cepPadaria.substring(0, 4)) {
    valor = 10;
    tipo = 'Motoboy (mesma região)';
  } else if (cepCliente.substring(0, 2) !== cepPadaria.substring(0, 2)) {
    valor = 35;
    tipo = 'Carro grande (estado diferente)';
  }

  tarifaEntrega.textContent = valor.toFixed(2).replace('.', ',');
  tarifaInfo.textContent = tipo;
  atualizarPedido(); // Recalcular total
}

function calcularTarifaValor() {
  const cepCliente = document.getElementById('cep')?.value.replace(/\D/g, '') || '';
  const cepPadaria = '01234567';

  if (cepCliente.length < 8) return 0;

  if (cepCliente === cepPadaria) return 5;
  if (cepCliente.substring(0, 4) === cepPadaria.substring(0, 4)) return 10;
  if (cepCliente.substring(0, 2) !== cepPadaria.substring(0, 2)) return 35;

  return 5; // Default
}

function renderIndexProdutos() {
  const produtosList = document.getElementById('produtos-list');
  if (!produtosList || !Array.isArray(produtos)) return;

  produtosList.innerHTML = produtos.map((produto) => `
    <article class="product-card">
      <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" onerror="this.style.display='none'">
      <div class="product-info">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="product-price">R$ ${formatPreco(produto.preco)}</div>
      </div>
    </article>
  `).join('');
}

function renderProdutoSelect() {
  const produtoSelect = document.getElementById('produto-select');
  if (!produtoSelect || !Array.isArray(produtos)) return;

  produtoSelect.innerHTML = `
    <option value="">Selecione um produto</option>
    ${produtos.map((produto, index) => `<option value="${index}">${produto.nome} - R$ ${formatPreco(produto.preco)}</option>`).join('')}
  `;
}

function renderProductCatalog() {
  const catalog = document.getElementById('product-catalog');
  if (!catalog || !Array.isArray(produtos)) return;

  catalog.innerHTML = produtos.map((produto, index) => `
    <article class="product-card">
      <img src="${produto.imagem}" alt="${produto.nome}" class="product-image" onerror="this.style.display='none'">
      <div class="product-info">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="product-price">R$ ${formatPreco(produto.preco)}</div>
        <button type="button" class="add-to-cart-btn" onclick="adicionarProduto('${produto.nome.replace(/'/g, "\\'")}', ${produto.preco})">Adicionar ao Pedido</button>
      </div>
    </article>
  `).join('');
}

function confirmarEncomenda(event) {
  if (event) event.preventDefault();

  const produtoSelect = document.getElementById('produto-select');
  const quantidadeInput = document.getElementById('quantidade');
  const resumo = document.getElementById('resumo-encomenda');
  const resumoProduto = document.getElementById('resumo-produto');
  const resumoQuantidade = document.getElementById('resumo-quantidade');
  const resumoTotal = document.getElementById('resumo-total');

  if (!produtoSelect || !quantidadeInput || !resumo || !resumoProduto || !resumoQuantidade || !resumoTotal) return;

  const produtoIndex = Number(produtoSelect.value);
  const quantidade = Number(quantidadeInput.value);

  if (!produtoSelect.value || Number.isNaN(produtoIndex) || produtoIndex < 0 || produtoIndex >= produtos.length) {
    alert('Selecione um produto válido.');
    return;
  }

  if (quantidade < 1) {
    alert('Digite uma quantidade válida.');
    return;
  }

  const produto = produtos[produtoIndex];
  const total = produto.preco * quantidade;

  resumoProduto.textContent = `Produto: ${produto.nome} - R$ ${formatPreco(produto.preco)}`;
  resumoQuantidade.textContent = `Quantidade: ${quantidade}`;
  resumoTotal.textContent = `Valor Total: R$ ${formatPreco(total)}`;
  resumo.classList.remove('hidden');
}

function enviarAgendamento(event) {
  if (event) event.preventDefault();

  const nome = document.getElementById('nome')?.value.trim() || '';
  const endereco = document.getElementById('endereco')?.value.trim() || '';
  const whatsapp = document.getElementById('whatsapp')?.value.trim() || '';
  const cep = document.getElementById('cep')?.value.trim() || '';
  const email = document.getElementById('email')?.value.trim() || '';
  const cpf = document.getElementById('cpf')?.value.trim() || '';

  // Validações
  if (!nome || !endereco || !whatsapp || !cep || !email || !cpf) {
    alert('❌ Preencha todos os campos obrigatórios para enviar a encomenda.');
    return;
  }

  if (!validarWhatsApp(whatsapp)) {
    alert('❌ WhatsApp deve conter no mínimo 11 dígitos.');
    return;
  }

  if (!validarCEP(cep)) {
    alert('❌ CEP deve conter exatamente 8 dígitos.');
    return;
  }

  if (!validarEmail(email)) {
    alert('❌ E-mail inválido. Digite um e-mail válido.');
    return;
  }

  if (!validarCPF(cpf)) {
    alert('❌ CPF deve conter exatamente 11 dígitos.');
    return;
  }

  if (!pedido.length) {
    alert('❌ Adicione pelo menos um produto ao pedido antes de enviar.');
    return;
  }

  const totalProd = calcularTotal();
  const tarifa = calcularTarifaValor();
  const totalGeral = totalProd + tarifa;

  const mensagem = `🍞 *Encomenda da Padaria Infinity*%0A%0A*📋 Dados do Cliente:*%0ANome: ${encodeURIComponent(nome)}%0AEndereço: ${encodeURIComponent(endereco)}%0AWhatsApp: ${encodeURIComponent(whatsapp)}%0ACEP: ${encodeURIComponent(cep)}%0AEmail: ${encodeURIComponent(email)}%0ACPF: ${encodeURIComponent(cpf)}%0A%0A*📦 Pedido:*%0A${pedido.map(item => `${item.quantidade}x ${item.nome} - R$ ${(item.valor * item.quantidade).toFixed(2).replace('.', ',')}`).join('%0A')}%0A%0A*💰 Resumo Financeiro:*%0ATotal Produtos: R$ ${totalProd.toFixed(2).replace('.', ',')}%0ATarifa Entrega: R$ ${tarifa.toFixed(2).replace('.', ',')}%0A*TOTAL GERAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*`;

  try {
    window.open(`https://wa.me/55119964995899?text=${mensagem}`, '_blank');
  } catch (erro) {
    alert('❌ Erro ao abrir WhatsApp. Tente novamente.');
    console.error('Erro:', erro);
  }
}

function enviarContato(event) {
  if (event) event.preventDefault();

  const nome = document.getElementById('contact-nome')?.value.trim() || '';
  const email = document.getElementById('contact-email')?.value.trim() || '';
  const whatsapp = document.getElementById('contact-whatsapp')?.value.trim() || '';
  const motivo = document.getElementById('contact-motivo')?.value || '';
  const mensagem = document.getElementById('contact-mensagem')?.value.trim() || '';

  // Validações
  if (!nome || !email || !mensagem || !motivo) {
    alert('❌ Preencha todos os campos obrigatórios do contato.');
    return;
  }

  if (!validarEmail(email)) {
    alert('❌ E-mail inválido. Digite um e-mail válido.');
    return;
  }

  if (whatsapp && !validarWhatsApp(whatsapp)) {
    alert('❌ WhatsApp deve conter no mínimo 11 dígitos.');
    return;
  }

  const texto = `💌 *Contato - Padaria Infinity*%0AMotivo: ${encodeURIComponent(motivo)}%0A%0A*Dados:*%0ANome: ${encodeURIComponent(nome)}%0AEmail: ${encodeURIComponent(email)}%0AWhatsApp: ${encodeURIComponent(whatsapp || 'Não informado')}%0A%0A*Mensagem:*%0A${encodeURIComponent(mensagem)}`;

  try {
    window.open(`https://wa.me/55119964995899?text=${texto}`, '_blank');
  } catch (erro) {
    alert('❌ Erro ao abrir WhatsApp. Tente novamente.');
    console.error('Erro:', erro);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  atualizarPedido();
  calcularTarifa();
  renderIndexProdutos();
  renderProdutoSelect();
  renderProductCatalog();
});
