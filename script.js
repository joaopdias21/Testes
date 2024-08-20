document.addEventListener('DOMContentLoaded', () => {
    const estoque = [];
    const carrinho = [];
    const formAdicionar = document.getElementById('form-adicionar');
    const divEstoque = document.getElementById('estoque');
    const divCarrinho = document.getElementById('carrinho');
    const btnFinalizarCompra = document.getElementById('finalizar-compra');

    // Função para renderizar o estoque
    function renderizarEstoque() {
        divEstoque.innerHTML = '';
        estoque.forEach((camiseta, index) => {
            const divCamiseta = document.createElement('div');
            divCamiseta.className = 'camiseta';
            divCamiseta.innerHTML = `
                <img src="${camiseta.imagem}" alt="${camiseta.nome}" class="imagem-camiseta">
                <p><strong>Nome:</strong> ${camiseta.nome}</p>
                <p><strong>Tamanho:</strong> ${camiseta.tamanho}</p>
                <p><strong>Quantidade:</strong> ${camiseta.quantidade}</p>
                <p><strong>Preço:</strong> R$${camiseta.preco.toFixed(2)}</p>
                <button onclick="adicionarAoCarrinho(${index})" ${camiseta.quantidade > 0 ? '' : 'disabled'}>Adicionar ao Carrinho</button>
                <button onclick="removerCamiseta(${index})">Remover</button>
            `;
            divEstoque.appendChild(divCamiseta);
        });
    }

    // Função para renderizar o carrinho de compras
    function renderizarCarrinho() {
        if (carrinho.length === 0) {
            divCarrinho.innerHTML = '<p>O carrinho está vazio.</p>';
            btnFinalizarCompra.disabled = true;
        } else {
            divCarrinho.innerHTML = '';
            carrinho.forEach((item, index) => {
                const divItem = document.createElement('div');
                divItem.className = 'item-carrinho';
                divItem.innerHTML = `
                    <img src="${item.imagem}" alt="${item.nome}" class="imagem-camiseta">
                    <p><strong>Nome:</strong> ${item.nome}</p>
                    <p><strong>Tamanho:</strong> ${item.tamanho}</p>
                    <p><strong>Quantidade:</strong> ${item.quantidade}</p>
                    <p><strong>Preço:</strong> R$${item.preco.toFixed(2)}</p>
                    <button onclick="removerDoCarrinho(${index})">Remover do Carrinho</button>
                `;
                divCarrinho.appendChild(divItem);
            });
            btnFinalizarCompra.disabled = false;
        }
    }

    // Função para adicionar uma nova camiseta ao estoque
    function adicionarCamiseta(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const tamanho = document.getElementById('tamanho').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value;
        const imagemInput = document.getElementById('imagem');
        const imagemURL = URL.createObjectURL(imagemInput.files[0]);

        const novaCamiseta = { nome, tamanho, quantidade: parseInt(quantidade), preco: parseFloat(preco), imagem: imagemURL };
        estoque.push(novaCamiseta);
        renderizarEstoque();

        formAdicionar.reset();
    }

    // Função para adicionar uma camiseta ao carrinho
    window.adicionarAoCarrinho = function(index) {
        const camiseta = estoque[index];
        const quantidadeDesejada = parseInt(prompt(`Quantas unidades de ${camiseta.nome} (tamanho ${camiseta.tamanho}) você deseja adicionar ao carrinho?`));

        if (quantidadeDesejada > 0 && quantidadeDesejada <= camiseta.quantidade) {
            // Verifica se o item já está no carrinho
            const itemExistente = carrinho.find(item => item.nome === camiseta.nome && item.tamanho === camiseta.tamanho);
            if (itemExistente) {
                itemExistente.quantidade += quantidadeDesejada;
            } else {
                carrinho.push({ nome: camiseta.nome, tamanho: camiseta.tamanho, quantidade: quantidadeDesejada, preco: camiseta.preco, imagem: camiseta.imagem });
            }

            camiseta.quantidade -= quantidadeDesejada;
            renderizarEstoque();
            renderizarCarrinho();
        } else {
            alert('Quantidade inválida ou não disponível em estoque!');
        }
    }

    // Função para remover uma camiseta do estoque
    window.removerCamiseta = function(index) {
        estoque.splice(index, 1);
        renderizarEstoque();
    }

    // Função para remover um item do carrinho
    window.removerDoCarrinho = function(index) {
        const item = carrinho[index];
        const estoqueItem = estoque.find(camiseta => camiseta.nome === item.nome && camiseta.tamanho === item.tamanho);
        estoqueItem.quantidade += item.quantidade;

        carrinho.splice(index, 1);
        renderizarEstoque();
        renderizarCarrinho();
    }

    // Função para finalizar a compra
    btnFinalizarCompra.addEventListener('click', () => {
        alert('Compra finalizada com sucesso!');
        carrinho.length = 0;
        renderizarCarrinho();
    });

    formAdicionar.addEventListener('submit', adicionarCamiseta);
});
