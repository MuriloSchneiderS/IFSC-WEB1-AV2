/*Conversão de moedas: 
1.  Um input para seleção de moeda, junto com 2 selects de seleção de moeda destino 
e moeda final. 
 
2.  Os menus de seleção de moeda devem ser carregados dinamicamente junto com a 
página por uma requisição à API. 
 
3.  Ao alterar o valor de qualquer um dos campos, o valor deve ser atualizado 
automaticamente. 
 
4.  Durante o processo de requisição, deve estar presente um ícone de carregamento 
ou mensagem de carregamento. 
 
Tabela de Cotações: 
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
const moeda_origem = document.getElementById('moeda-origem');
const moeda_destino = document.getElementById('moeda-destino');
const valor_origem = document.getElementById('valor-origem');
const valor_convertido = document.getElementById('valor-convertido');
const carregamento = document.getElementById('carregamento');

const tabela_cotacoes = document.getElementById('tabela-cotacoes');
const botao_atualizar = document.getElementById('botao-atualizar');

document.addEventListener('DOMContentLoaded', () => {
    carregarListaMoedas();
});

async function carregarListaMoedas() {//Carrega opcoes de moeda-origem e moeda-destino
    carregamento.textContent = 'Carregando moedas...';
    carregamento.style.display = 'block';
    moeda_origem.disabled = true;
    moeda_destino.disabled = true;

    try {
        const resposta = await fetch('https://api.frankfurter.app/currencies', { cache: 'no-store' });
        if (!resposta.ok) 
            throw new Error(`Erro: sem resposta do servidor: ${resposta.status}`);
        const moedas = await resposta.json();
        const pares = Object.entries(moedas).sort((a, b) => a[0].localeCompare(b[0]));

        popularSelect(moeda_origem, pares);
        popularSelect(moeda_destino, pares);

        if ([...moeda_origem.options].some(o => o.value === 'BRL')) 
            moeda_origem.value = 'BRL';
        else 
            moeda_origem.selectedIndex = 0;
        //moeda origem padrao definida como BRL se existir na lista, senao primeira da lista
        if ([...moeda_destino.options].some(o => o.value === 'USD')) 
            moeda_destino.value = 'USD';
        else 
            moeda_destino.selectedIndex = 0;
        //moeda destino padrao definida como USD se existir na lista, senao primeira da lista

        carregamento.textContent = '';
        carregamento.style.display = 'none';
    } catch (erro) {
        console.error(erro);
        carregamento.textContent = 'Falha ao carregar moedas. Verifique sua conexão e reinicie a página.';
    } finally {
        moeda_origem.disabled = false;
        moeda_destino.disabled = false;
    }
}
function popularSelect(selectEl, pares) {
    selectEl.innerHTML = '';
    pares.forEach(([codigo, nome]) => {
        const opcao = document.createElement('option');
        opcao.value = codigo;
        opcao.textContent = `${codigo} — ${nome}`;
        selectEl.appendChild(opcao);
    });
}