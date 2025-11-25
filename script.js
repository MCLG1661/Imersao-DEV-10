document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
    const campoBusca = document.getElementById('campo-busca');
    const formBusca = document.getElementById('caixa-busca');
    const botaoLimpar = document.getElementById('botao-limpar');
    const caixaFiltros = document.getElementById('caixa-filtros');

    let todosOsDados = [];
    let filtroAtivo = 'Todos';

    // Carrega os dados do JSON
    async function carregarDados() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            todosOsDados = await response.json();
            gerarFiltros();
            renderizarCards(todosOsDados);
        } catch (error) {
            console.error("Não foi possível carregar os dados:", error);
            cardContainer.innerHTML = '<p style="color: #ef4444;">Erro ao carregar as informações. Tente recarregar a página.</p>';
        }
    }

    // Cria um card HTML para um item
    function criarCard(item) {
        return `
            <div class="card" data-tipo="${item.tipo}">
                <img src="${item.imagem_url}" alt="Logo ou foto de ${item.nome}" class="card-imagem" loading="lazy">
                <div class="card-conteudo">
                    <span class="card-tipo">${item.tipo}</span>
                    <h2 class="card-titulo">${item.nome}</h2>
                    <p class="card-descricao">${item.descrição}</p>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="card-link">Saiba mais &rarr;</a>
                </div>
            </div>
        `;
    }

    // Renderiza uma lista de cards na tela
    function renderizarCards(listaDeItens) {
        if (listaDeItens.length === 0) {
            cardContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            return;
        }
        cardContainer.innerHTML = listaDeItens.map(criarCard).join('');
    }

    // Filtra e renderiza os cards com base na busca e no filtro ativo
    function filtrarERenderizar() {
        const termoBusca = campoBusca.value.toLowerCase();

        const dadosFiltrados = todosOsDados.filter(item => {
            // Verifica o filtro de tipo
            const correspondeAoFiltro = filtroAtivo === 'Todos' || item.tipo === filtroAtivo;

            // Verifica o termo de busca
            const correspondeABusca = termoBusca === '' ||
                item.nome.toLowerCase().includes(termoBusca) ||
                item.descrição.toLowerCase().includes(termoBusca) ||
                item.tipo.toLowerCase().includes(termoBusca) ||
                (item.criador && item.criador.toLowerCase().includes(termoBusca));

            return correspondeAoFiltro && correspondeABusca;
        });

        renderizarCards(dadosFiltrados);
    }

    // Gera os botões de filtro dinamicamente
    function gerarFiltros() {
        const tipos = ['Todos', ...new Set(todosOsDados.map(item => item.tipo))];
        caixaFiltros.innerHTML = tipos.map(tipo =>
            `<button class="filtro-btn ${tipo === 'Todos' ? 'active' : ''}" data-filtro="${tipo}">${tipo}</button>`
        ).join('');
    }

    // --- Event Listeners ---

    // Busca em tempo real
    campoBusca.addEventListener('input', filtrarERenderizar);

    // Previne o envio do formulário que recarrega a página
    formBusca.addEventListener('submit', (e) => {
        e.preventDefault();
        filtrarERenderizar();
    });

    // Limpa o campo de busca e o filtro
    botaoLimpar.addEventListener('click', () => {
        campoBusca.value = '';
        filtroAtivo = 'Todos';
        
        // Remove a classe 'active' de todos os botões e a adiciona ao 'Todos'
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filtro-btn[data-filtro="Todos"]').classList.add('active');

        renderizarCards(todosOsDados);
    });

    // Delegação de evento para os botões de filtro
    caixaFiltros.addEventListener('click', (e) => {
        if (e.target.classList.contains('filtro-btn')) {
            // Remove a classe 'active' do botão anterior
            const botaoAtivoAnterior = document.querySelector('.filtro-btn.active');
            if (botaoAtivoAnterior) {
                botaoAtivoAnterior.classList.remove('active');
            }

            // Adiciona a classe 'active' ao botão clicado
            const botaoClicado = e.target;
            botaoClicado.classList.add('active');

            // Atualiza o filtro ativo e renderiza
            filtroAtivo = botaoClicado.dataset.filtro;
            filtrarERenderizar();
        }
    });

    // Inicia a aplicação
    carregarDados();
});
