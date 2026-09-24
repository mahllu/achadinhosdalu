const SUPABASE_URL = 'https://bctftkfcjjsusqrdsvwf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_C7EsqCYO5wHw4Xqvm-uGMA_Mmq2HJ37';

const supabasePainel = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const modal = document.querySelector('#modal-produto');
const btnAdicionar = document.querySelector('#btn-adicionar');
const btnFechar = document.querySelector('#btn-fechar');
const btnSair = document.querySelector('#btn-sair');
const formProduto = document.querySelector('#form-produto');
const mensagem = document.querySelector('#mensagem');
const listaProdutos = document.querySelector('#lista-produtos');


btnAdicionar.addEventListener('click', function () {
    modal.classList.add('ativo');
});

btnFechar.addEventListener('click', function () {
    modal.classList.remove('ativo');
});

modal.addEventListener('click', function (event) {
    if (event.target === modal) {
        modal.classList.remove('ativo');
    }
});

async function carregarEstatisticasVisitas() {
    carregarRankingProdutos();
    const visitasTotal = document.querySelector('#visitas-total');
    const visitasHoje = document.querySelector('#visitas-hoje');

    // VISITAS TOTAIS
    const { count: total, error: erroTotal } = await supabasePainel
        .from('visitas')
        .select('*', { count: 'exact', head: true });

    if (erroTotal) {
        console.error('Erro ao buscar visitas totais:', erroTotal);
    } else {
        visitasTotal.textContent = total || 0;
      // CLIQUES NOS PRODUTOS
const cliquesTotal = document.querySelector('#cliques-total');

const { count: totalCliques, error: erroCliques } = await supabasePainel
    .from('cliques')
    .select('*', { count: 'exact', head: true });

if (erroCliques) {
    console.error('Erro ao buscar cliques:', erroCliques);
} else {
    cliquesTotal.textContent = totalCliques || 0;
}  
    }

    // VISITAS DE HOJE
    const agora = new Date();

    const inicioHoje = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
    );

    const inicioAmanha = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate() + 1
    );

    const { count: hoje, error: erroHoje } = await supabasePainel
        .from('visitas')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', inicioHoje.toISOString())
        .lt('created_at', inicioAmanha.toISOString());

    if (erroHoje) {
        console.error('Erro ao buscar visitas de hoje:', erroHoje);
    } else {
        visitasHoje.textContent = hoje || 0;
    }
}
async function verificarLogin() {
    const { data } = await supabasePainel.auth.getSession();

    if (!data.session) {
        window.location.href = 'admin.html';
        return;
    }

    carregarEstatisticasVisitas();
}

verificarLogin();
async function carregarRankingProdutos() {
    const rankingLista = document.querySelector('#ranking-produtos');

    const { data: cliques, error: erroCliques } = await supabasePainel
        .from('cliques')
        .select('produto_id');

    if (erroCliques) {
        console.error('Erro ao carregar ranking:', erroCliques);
        rankingLista.innerHTML = '<p>Não foi possível carregar o ranking.</p>';
        return;
    }

    if (!cliques || cliques.length === 0) {
        rankingLista.innerHTML =
            '<p class="ranking-carregando">Ainda não há cliques registrados ♡</p>';
        return;
    }

    // Conta quantos cliques cada produto recebeu
    const contagem = {};

    cliques.forEach(function (clique) {
        const id = clique.produto_id;

        if (!id) return;

        contagem[id] = (contagem[id] || 0) + 1;
    });

    const idsProdutos = Object.keys(contagem);

    const { data: produtos, error: erroProdutos } = await supabasePainel
        .from('produtos')
        .select('id, nome, imagem_url, loja')
        .in('id', idsProdutos);

    if (erroProdutos) {
        console.error('Erro ao buscar produtos do ranking:', erroProdutos);
        return;
    }

    const ranking = produtos
        .map(function (produto) {
            return {
                ...produto,
                cliques: contagem[produto.id] || 0
            };
        })
        .sort(function (a, b) {
            return b.cliques - a.cliques;
        })
        .slice(0, 5);

    rankingLista.innerHTML = '';

    ranking.forEach(function (produto, index) {
        rankingLista.innerHTML += `
            <div class="item-ranking">

                <span class="posicao-ranking">
                    ${index + 1}º
                </span>

                <img
                    src="${produto.imagem_url}"
                    alt="${produto.nome}"
                    class="imagem-ranking"
                >

                <div class="info-ranking">
                    <strong>${produto.nome}</strong>
                    <span>${produto.loja}</span>
                </div>

                <div class="cliques-ranking">
                    ♡ ${produto.cliques}
                    <small>cliques</small>
                </div>

            </div>
        `;
    });
}
async function carregarProdutos() {

    const { data, error } = await supabasePainel
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao carregar produtos:', error);
        return;
    }
    const produtosTotal = document.querySelector('#produtos-total');

if (produtosTotal) {
    produtosTotal.textContent = data.length;
}
    listaProdutos.innerHTML = '';

    data.forEach(function (produto) {

        const preco = Number(produto.preco).toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

        listaProdutos.innerHTML += `
            <div class="card-produto">

                <img src="${produto.imagem_url}" alt="${produto.nome}">

                <div class="card-info">

                    <small>${produto.loja}</small>

                    <h3>${produto.nome}</h3>

                    <p class="preco">${preco}</p>

                </div>

            </div>
        `;
    });
}

carregarProdutos();


formProduto.addEventListener('submit', async function (event) {

    event.preventDefault();

    mensagem.style.color = '#777';
    mensagem.textContent = 'Publicando produto...';

    const imagem = document.querySelector('#imagem').files[0];
    const nome = document.querySelector('#nome').value;
    const preco = document.querySelector('#preco').value;
    const loja = document.querySelector('#loja').value;
    const categoriasSelecionadas =
    document.querySelectorAll('input[name="categoria"]:checked');

const categoria = Array.from(categoriasSelecionadas)
    .map(function (item) {
        return item.value;
    })
    .join(' ');
    const link = document.querySelector('#link').value;

    if (!imagem) {
        mensagem.textContent = 'Escolha uma imagem.';
        return;
    }

    const nomeImagem =
        Date.now() + '-' + imagem.name.replace(/\s+/g, '-');


    const { error: erroImagem } = await supabasePainel
        .storage
        .from('produtos')
        .upload(nomeImagem, imagem);


    if (erroImagem) {
        console.error('Erro da imagem:', erroImagem);

        mensagem.style.color = '#b34b4b';
        mensagem.textContent = 'Erro ao enviar a imagem.';
        return;
    }


    const { data: urlImagem } = supabasePainel
        .storage
        .from('produtos')
        .getPublicUrl(nomeImagem);


    const { error: erroProduto } = await supabasePainel
        .from('produtos')
        .insert([
            {
                nome: nome,
                preco: preco,
                loja: loja,
                categoria: categoria,
                imagem_url: urlImagem.publicUrl,
                link_afiliado: link,
                ativo: true
            }
        ]);


    if (erroProduto) {
        console.error('Erro do produto:', erroProduto);

        mensagem.style.color = '#b34b4b';
        mensagem.textContent = 'Erro ao cadastrar o produto.';
        return;
    }


    mensagem.style.color = '#4f7a56';
    mensagem.textContent = 'Produto publicado! ♡';

    formProduto.reset();

    await carregarProdutos();

    setTimeout(function () {
        modal.classList.remove('ativo');
        mensagem.textContent = '';
    }, 2000);

});


btnSair.addEventListener('click', async function () {
    await supabasePainel.auth.signOut();
    window.location.href = 'admin.html';
});