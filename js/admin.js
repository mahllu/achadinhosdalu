const SUPABASE_URL = 'https://bctftkfcjjsusqrdsvwf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_C7EsqCYO5wHw4Xqvm-uGMA_Mmq2HJ37';

const supabaseAdmin = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const formLogin = document.querySelector('#form-login');
const mensagem = document.querySelector('#mensagem');


formLogin.addEventListener('submit', async function (event) {

    event.preventDefault();

    const email = document.querySelector('#email').value;
    const senha = document.querySelector('#senha').value;

    mensagem.textContent = 'Entrando...';

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: email,
        password: senha
    });

    if (error) {
        console.error(error);
        mensagem.textContent = 'E-mail ou senha incorretos.';
        return;
    }

    mensagem.style.color = '#4f7a56';
    mensagem.textContent = 'Login realizado!';

    setTimeout(function () {
        window.location.href = 'painel.html';
    }, 500);

});