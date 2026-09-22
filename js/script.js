const botaoMenu = document.querySelector('.menu-btn');
const menuCategorias = document.querySelector('.menu-categorias');

const itensMenu = document.querySelectorAll('.item-menu');
const atalhosCategorias = document.querySelectorAll('.categoria-atalho');

const campoBusca = document.querySelector('#campo-busca');

let filtroAtual = 'todos';


/* ABRIR E FECHAR MENU */

if (botaoMenu && menuCategorias) {

    botaoMenu.addEventListener('click', function () {
        menuCategorias.classList.toggle('ativo');
    });

}


/* NORMALIZAR TEXTO */

function normalizarTexto(texto) {

    return (texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

}


/* FILTRAR PRODUTOS */

function filtrarProdutos() {

    const cardsProdutos = document.querySelectorAll('.produto');

    const pesquisa = campoBusca
        ? normalizarTexto(campoBusca.value)
        : '';

    cardsProdutos.forEach(function (produto) {

        const categoriaOriginal =
            produto.getAttribute('data-categoria') || '';

        const categorias =
            normalizarTexto(categoriaOriginal).split(/\s+/);

        const textoProduto =
            normalizarTexto(produto.textContent);

        const pertenceCategoria =
            filtroAtual === 'todos' ||
            categorias.includes(filtroAtual);

        const correspondePesquisa =
            pesquisa === '' ||
            textoProduto.includes(pesquisa);

        if (pertenceCategoria && correspondePesquisa) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }

    });

}


/* BOTÕES DE CATEGORIA */

atalhosCategorias.forEach(function (botao) {

    botao.addEventListener('click', function () {

        filtroAtual =
            normalizarTexto(
                botao.getAttribute('data-filtro')
            );

        atalhosCategorias.forEach(function (item) {
            item.classList.remove('ativo');
        });

        botao.classList.add('ativo');

        filtrarProdutos();

    });

});


/* MENU LATERAL */

itensMenu.forEach(function (item) {

    item.addEventListener('click', function (event) {

        event.preventDefault();

        filtroAtual =
            normalizarTexto(
                item.getAttribute('data-filtro')
            );

        itensMenu.forEach(function (menu) {
            menu.classList.remove('ativo');
        });

        item.classList.add('ativo');

        filtrarProdutos();

        if (menuCategorias) {
            menuCategorias.classList.remove('ativo');
        }

    });

});


/* BARRA DE PESQUISA */

if (campoBusca) {

    campoBusca.addEventListener('input', function () {
        filtrarProdutos();
    });

}