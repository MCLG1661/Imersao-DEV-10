document.addEventListener('DOMContentLoaded', () => {
    const campoBusca = document.getElementById('campo-busca');
    const botaoBusca = document.getElementById('botao-busca');
    const botaoLimpar = document.getElementById('botao-limpar');
    const cardContainer = document.getElementById('card-container');

    let dados = []; // Armazenará todos os dados carregados

    // Carrega os dados do JSON
    async function carregarDados() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            dados = await response.json();
            // Exibe todos os cards inicialmente
            exibirResultados(dados); 
        } catch (error) {
            console.error("Não foi possível carregar os dados:", error);
            cardContainer.innerHTML = "<p class='mensagem-erro'>Erro ao carregar os dados. Tente novamente mais tarde.</p>";
        }
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
            card.style.animationDelay = `${index * 0.05}s`; // Adiciona um atraso escalonado

            // Lógica para exibir o criador de forma contextual
            if (dado.criador) {
                // Se o item é um criador, o campo 'criador' indica o que ele criou
                // Se o item é uma linguagem, o campo 'criador' indica quem a criou
                const labelCriador = dado.tipo === 'Criador' ? 'Criação Principal' : 'Criador';
                infoExtra = `<p><strong>${labelCriador}:</strong> ${dado.criador}</p>`;
            }

            const imagem = dado.imagem_url 
                ? `<img src="${dado.imagem_url}" alt="Logo ou foto de ${dado.nome}" class="card-imagem">` 
                : '';

            card.innerHTML = `
                ${imagem}
                <h2>${dado.nome}</h2>
                <p><strong>Tipo:</strong> ${dado.tipo}</p>
                ${infoExtra}
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
        
        if (!termoBusca) {
            exibirResultados(dados); // Se a busca estiver vazia, mostra todos
            return;
        }

        const resultados = dados.filter(item => 
            item.nome.toLowerCase().includes(termoBusca) ||
            item.tipo.toLowerCase().includes(termoBusca) ||
            item.descrição.toLowerCase().includes(termoBusca) ||
            (item.criador && item.criador.toLowerCase().includes(termoBusca)) // Inclui o criador na busca
        );

        exibirResultados(resultados);
    }

    // Função para limpar a busca
    function limparBusca() {
        campoBusca.value = '';
        exibirResultados(dados); // Mostra todos os dados novamente
    }

    // Adicionando os Event Listeners
    campoBusca.addEventListener('input', iniciarBusca); // Busca em tempo real
    botaoBusca.addEventListener('click', iniciarBusca);
    botaoLimpar.addEventListener('click', limparBusca);

    // Carrega os dados quando a página é iniciada
    carregarDados();
});
