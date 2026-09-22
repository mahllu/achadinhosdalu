const botaoMenu = document.querySelector('.menu-btn');
const menuCategorias = document.querySelector('.menu-categorias');
const itensMenu = document.querySelectorAll('.item-menu');
const atalhosCategorias = document.querySelectorAll('.categoria-atalho');
const cardsProdutos = document.querySelectorAll('.produto');

/* ABRIR E FECHAR MENU */
botaoMenu.addEventListener('click', function () {
    menuCategorias.classList.toggle('ativo');
});

/* FILTRAR CATEGORIAS */
itensMenu.forEach(function(item) {

    item.addEventListener('click', function (event) {

        event.preventDefault();

        const filtro = item.getAttribute('data-filtro');

        itensMenu.forEach(function (menu) {
            menu.classList.remove('ativo');
        });

        item.classList.add('ativo');

               cardsProdutos.forEach(function (produto) {

            const categorias = produto
                .getAttribute('data-categoria')
                .toLowerCase()
                .split(' ');

            if (filtro === 'todos' || categorias.includes(filtro)) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }

        });

        /* FECHA O MENU DEPOIS DE CLICAR */
        menuCategorias.classList.remove('ativo');

    });
});
atalhosCategorias.forEach(function (botao) {

    botao.addEventListener('click', function () {

        const filtro = botao.getAttribute('data-filtro');

        atalhosCategorias.forEach(function (item) {
            item.classList.remove('ativo');
        });

        botao.classList.add('ativo');

        cardsProdutos.forEach(function (produto) {

            const categorias = produto
                .getAttribute('data-categoria')
                .toLowerCase()
                .split(' ');

            if (filtro === 'todos' || categorias.includes(filtro)) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }

        });

    });

});