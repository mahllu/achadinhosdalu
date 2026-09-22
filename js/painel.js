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


async function verificarLogin() {
    const { data } = await supabasePainel.auth.getSession();

    if (!data.session) {
        window.location.href = 'admin.html';
    }
}

verificarLogin();


async function carregarProdutos() {

    const { data, error } = await supabasePainel
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao carregar produtos:', error);
        return;
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
    const categoria = document.querySelector('#categoria').value;
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