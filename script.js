const cardContainer = document.querySelector("#card-container");
const campoBusca = document.querySelector("header div input");
let dados = [];

// Carrega os dados uma vez quando a página é aberta
window.onload = async () => {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        cardContainer.innerHTML = "<p>Não foi possível carregar a base de conhecimento.</p>";
    }
};

function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();

    if (!termoBusca) {
        cardContainer.innerHTML = ""; // Limpa os resultados se a busca for vazia
        return;
    }

    const resultados = dados.filter(item => 
        item.nome.toLowerCase().includes(termoBusca) ||
        item.tipo.toLowerCase().includes(termoBusca) ||
        item.descrição.toLowerCase().includes(termoBusca) ||
        (item.genero && item.genero.toLowerCase().includes(termoBusca))
    );

    renderizarCards(resultados);
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os resultados anteriores

    if (dados.length === 0) {
        cardContainer.innerHTML = "<p>Nenhum resultado encontrado.</p>";
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.style.animationDelay = `${dados.indexOf(dado) * 0.05}s`; // Adiciona um atraso escalonado
        article.classList.add("card"); // Corrigido: classList com 'L' maiúsculo

        let infoExtra = '';
        // Lógica para exibir campos contextuais
        if (dado.tipo === 'Artista') {
            if (dado.associacoes && dado.associacoes.length > 0) {
                infoExtra = `<p><strong>Associações:</strong> ${dado.associacoes.join(', ')}</p>`;
            }
        } else if (dado.artistas && dado.artistas.length > 0 && dado.artistas[0] !== "Artistas Diversos") {
             infoExtra = `<p><strong>Artistas:</strong> ${dado.artistas.join(', ')}</p>`;
        } else if (dado.criador) { // Mantém a lógica anterior se necessário
            const labelContextual = dado.tipo === 'Criador' ? 'Criação Principal' : 'Criador';
            infoExtra = `<p><strong>${labelContextual}:</strong> ${dado.criador}</p>`;
        }

        const imagem = dado.imagem_url 
            ? `<img src="${dado.imagem_url}" alt="Logo ou foto de ${dado.nome}" class="card-imagem">` 
            : '';

        article.innerHTML = `
            ${imagem}<h2>${dado.nome}</h2>
            <p><strong>Tipo:</strong> ${dado.tipo}</p>
            ${infoExtra}
            <p>${dado.descrição}</p>
            ${dado.link ? `<a href="${dado.link}" target="_blank" class="saiba-mais">Saiba Mais</a>` : ''}
        `;
        cardContainer.appendChild(article);
    }
}

function limparBusca() {
    campoBusca.value = ""; // Limpa o campo de input
    cardContainer.innerHTML = ""; // Limpa a seção de resultados
}
