document.addEventListener('DOMContentLoaded', () => {
    const campoBusca = document.getElementById('campo-busca');
    const botaoBusca = document.getElementById('botao-busca');
    const botaoLimpar = document.getElementById('botao-limpar');
    const cardContainer = document.getElementById('card-container');
    const caixaFiltros = document.getElementById('caixa-filtros');

    let dados = []; // Armazenará todos os dados carregados
    let filtroAtivo = 'Todos'; // Armazena o filtro de categoria atual

    // Carrega os dados do JSON
    async function carregarDados() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            dados = await response.json();
            // Exibe todos os cards inicialmente
            criarBotoesFiltro();
            exibirResultados(dados); 
        } catch (error) {
            console.error("Não foi possível carregar os dados:", error);
            cardContainer.innerHTML = "<p class='mensagem-erro'>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
        }
    }

    // Cria os botões de filtro dinamicamente a partir dos dados
    function criarBotoesFiltro() {
        // Extrai todos os tipos únicos do data.json
        const tiposBrutos = dados.flatMap(item => item.tipo.split(' / '));
        const tiposUnicos = ['Todos', ...new Set(tiposBrutos)];

        caixaFiltros.innerHTML = ''; // Limpa filtros existentes

        tiposUnicos.forEach(tipo => {
            const botao = document.createElement('button');
            botao.className = 'botao-filtro';
            botao.textContent = tipo;
            if (tipo === filtroAtivo) {
                botao.classList.add('ativo');
            }
            botao.addEventListener('click', () => handleFiltroClick(tipo));
            caixaFiltros.appendChild(botao);
        });
    }

    // Lida com o clique em um botão de filtro
    function handleFiltroClick(tipo) {
        filtroAtivo = tipo;
        // Atualiza a classe 'ativo' nos botões
        document.querySelectorAll('.botao-filtro').forEach(btn => {
            btn.classList.toggle('ativo', btn.textContent === tipo);
        });
        // Re-aplica a busca com o novo filtro
        iniciarBusca();
    }


    // Função para exibir os resultados na tela
    function exibirResultados(resultados) {
        cardContainer.innerHTML = ''; // Limpa os resultados anteriores

        if (resultados.length === 0) {
            cardContainer.innerHTML = '<p class="nenhum-resultado">Nenhum resultado encontrado.</p>';
            return;
        }

        let infoExtra = '';
        resultados.forEach((dado, index) => {
            const card = document.createElement('article');
            // A classe 'card' não é mais necessária se o CSS mira a tag 'article' diretamente
            card.className = 'card-animado'; // Usaremos uma classe para a animação
            card.style.animationDelay = `${index * 0.05}s`; // Adiciona um atraso escalonado

            // Lógica para exibir o criador de forma contextual
            let infoExtraHTML = ''; // Reseta para cada card
            if (dado.criador) {
                const labelCriador = dado.tipo === 'Criador' ? 'Criação Principal' : 'Criador';
                infoExtraHTML = `<p><strong>${labelCriador}:</strong> ${dado.criador}</p>`;
            }

            const imagem = dado.imagem_url 
                ? `<img src="${dado.imagem_url}" alt="Logo ou foto de ${dado.nome}" class="card-imagem">` 
                : '';

            card.innerHTML = `
                ${imagem}
                <h2>${dado.nome}</h2>
                <p><strong>Tipo:</strong> ${dado.tipo}</p>
                ${infoExtraHTML}
                <p class="card-description">${dado.descrição}</p>
                <p><strong>Ano:</strong> ${dado.ano}</p>
                ${dado.link ? `<a href="${dado.link}" target="_blank" class="saiba-mais">Saiba Mais</a>` : ''}
            `;
            cardContainer.appendChild(card);
        });
    }

    // Função principal de busca
    function iniciarBusca() {
        const termoBusca = campoBusca.value.toLowerCase().trim();

        // 1. Filtra por categoria (se houver filtro ativo)
        let dadosFiltrados = dados;
        if (filtroAtivo !== 'Todos') {
            dadosFiltrados = dados.filter(item => item.tipo.toLowerCase().includes(filtroAtivo.toLowerCase()));
        }

        // 2. Filtra pelo termo de busca dentro dos resultados da categoria
        if (termoBusca) {
            dadosFiltrados = dadosFiltrados.filter(item => 
                item.nome.toLowerCase().includes(termoBusca) ||
                item.descrição.toLowerCase().includes(termoBusca) ||
                (item.criador && item.criador.toLowerCase().includes(termoBusca))
            );
        }

        exibirResultados(dadosFiltrados);
    }

    // Função para limpar a busca
    function limparBusca() {
        campoBusca.value = '';
        handleFiltroClick('Todos'); // Reseta o filtro para 'Todos' e exibe tudo
    }

    // Adicionando os Event Listeners
    campoBusca.addEventListener('input', iniciarBusca); // Busca em tempo real
    botaoBusca.addEventListener('click', iniciarBusca);
    botaoLimpar.addEventListener('click', limparBusca);

    // Carrega os dados quando a página é iniciada
    carregarDados();
});
