const tabela_cotacoes = document.getElementById('tabela-cotacoes');
const carregamento_cotacoes = document.getElementById('carregamento-cotacoes');
const botao_atualizar = document.createElement('btn-atualizar');
const dolar = document.getElementById('dolar');
const euro = document.getElementById('euro');
const iene = document.getElementById('iene');

document.addEventListener('DOMContentLoaded', () => {
    atualizarCotacoes();
});
botao_atualizar.addEventListener('click', () => {
    atualizarCotacoes();
});

async function atualizarCotacoes() {
    carregamento_cotacoes.textContent = 'Carregando cotações...';
    tabela_cotacoes.style.display = 'none';
    try {
        const resposta = await fetch('https://api.frankfurter.app/latest?from=BRL&to=USD,EUR,JPY', { cache: 'no-store' });
        if (!resposta.ok) 
            throw new Error(`Erro: sem resposta do servidor: ${resposta.status}`);
        const dados = await resposta.json();
        const taxas = dados.rates;
        dolar.textContent = (1 / taxas.USD).toFixed(2);
        euro.textContent = (1 / taxas.EUR).toFixed(2);
        iene.textContent = (1 / taxas.JPY).toFixed(4);
        carregamento_cotacoes.textContent = '';
        tabela_cotacoes.style.display = 'table';
    } catch (erro) {
        console.error(erro);
        carregamento_cotacoes.textContent = 'Falha ao carregar cotações. Verifique sua conexão e tente novamente.';
    }
}
/*Tabela de Cotações: 
1.  Abaixo do conversor de moedas deve haver uma tabela de cotações das moedas 
mais importantes em relação ao real brasilieiro, fica a seu critério quais moedas 
comparar. 
 
2.  A tabela deve ser gerada ao carregar a página de forma dinâmica 
 
3.  Deve haver um botão logo abaixo para atualizar as cotas que deve buscar os dados 
mais recentes e atualizar apropriadamente. 
 
Extras: 
 
1.  Previna erros possíveis da API, para caso ocorra erros de busca de dados o site se 
comportar devidamente com mensagens personalizadas para diferentes problemas. 
 
2.  Previna que o usuário coloque valores inválidos no campo de moeda, notificando o 
mesmo quando isso acontecer. 
 
 
Links para requisições: 
●  https://api.frankfurter.app */