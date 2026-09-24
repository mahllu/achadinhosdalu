const SUPABASE_URL = 'https://bctftkfcjjsusqrdsvwf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_C7EsqCYO5wHw4Xqvm-uGMA_Mmq2HJ37';
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
async function registrarVisita() {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const ultimaVisita = localStorage.getItem('ultima-visita-achadinhos');

    // Não conta várias atualizações da mesma pessoa no mesmo dia
    if (ultimaVisita === hoje) {
        return;
    }

    const { error } = await supabaseClient
        .from('visitas')
        .insert([{}]);

    if (error) {
        console.error('Erro ao registrar visita:', error);
        return;
    }

    localStorage.setItem('ultima-visita-achadinhos', hoje);
    console.log('Visita registrada!');
}

registrarVisita();

console.log('Supabase conectado!');
async function registrarClique(produtoId) {
    const { error } = await supabaseClient
        .from('cliques')
        .insert([
            {
                produto_id: produtoId
            }
        ]);

    if (error) {
        console.error('Erro ao registrar clique:', error);
    } else {
        console.log('Clique registrado!');
    }
}
async function buscarProdutos() {

    const { data, error } = await supabaseClient
        .from('produtos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return;
    }

    const listaShopee = document.querySelector('#lista-produtos-shopee');
const listaShein = document.querySelector('#lista-produtos-shein');

listaShopee.innerHTML = '';
listaShein.innerHTML = '';

    data.forEach(function (produto) {
        const loja = (produto.loja || '').trim().toLowerCase();

let listaProdutos;

if (loja.includes('shopee')) {
    listaProdutos = listaShopee;
} else if (loja.includes('shein')) {
    listaProdutos = listaShein;
} else {
    console.warn('Loja não reconhecida:', produto.loja);
    return;
}

        const precoFormatado = Number(produto.preco).toLocaleString(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        );

        listaProdutos.innerHTML += `
            <div class="produto" data-categoria="${produto.categoria}">

                <img src="${produto.imagem_url}" alt="${produto.nome}">

                <div class="produto-info">

                    <span class="produto-categoria">
                        ${produto.categoria}
                    </span>

                    <span class="produto-loja">
                        ${produto.loja}
                    </span>

                    <h3>${produto.nome}</h3>

                    <p class="produto-preco">
                        ${precoFormatado}
                    </p>

    <a
    href="${produto.link_afiliado}"
    target="_blank"
    class="botao-oferta"
    onclick="registrarClique(${produto.id})"
>

                        Ver oferta
                    </a>

                </div>

            </div>
        `;
    });

    console.log('Produtos exibidos:', data);
}

buscarProdutos();