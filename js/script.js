const botaoMenu = document.querySelector('.menu-btn');
const menuCategorias = document.querySelector('.menu-categorias');

botaoMenu.addEventListener('click', function () {
    menuCategorias.classList.toggle('ativo');
});
const campoBusca = document.querySelector('#campo-busca');

campoBusca.addEventListener('input', function () {
    const pesquisa = campoBusca.value.toLowerCase();

    console.log(pesquisa);
});