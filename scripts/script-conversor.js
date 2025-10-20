const moeda_origem = document.getElementById('moeda-origem');
const moeda_destino = document.getElementById('moeda-destino');
const valor_origem = document.getElementById('valor-origem');
const valor_convertido = document.getElementById('valor-convertido');
const carregamento_conversor = document.getElementById('carregamento-conversor');
const botao_converter = document.getElementById('btn-converter');

document.addEventListener('DOMContentLoaded', () => {
    carregarListaMoedas();
});
botao_converter.addEventListener('click', (e) => {
    e.preventDefault();//Evitar que a pagina seja recarregada ao clicar no botao
    converterMoeda();
});


async function carregarListaMoedas() {//Carrega opcoes de moeda-origem e moeda-destino
    carregamento_conversor.textContent = 'Carregando moedas...';
    carregamento_conversor.style.display = 'block';
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

        carregamento_conversor.textContent = '';
        carregamento_conversor.style.display = 'none';
    } catch (erro) {
        console.error(erro);
        carregamento_conversor.textContent = 'Falha ao carregar moedas. Verifique sua conexão e reinicie a página.';
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

async function converterMoeda() {
    const origem = moeda_origem.value;
    const destino = moeda_destino.value;
    const valor = parseFloat(valor_origem.value);
    if (isNaN(valor) || valor < 0) {
        valor_convertido.value = 'Valor inválido';
        return;
    }
    carregamento_conversor.textContent = 'Convertendo...';
    carregamento_conversor.style.display = 'block';
    try {
        const resposta = await fetch(`https://api.frankfurter.app/latest?amount=${valor}&from=${origem}&to=${destino}`, { cache: 'no-store' });
        if (!resposta.ok)
            throw new Error(`Erro: sem resposta do servidor: ${resposta.status}`);
        const dados = await resposta.json();
        const convertido = dados.rates[destino];
        valor_convertido.value = convertido.toFixed(2);
    } catch (erro) {
        console.error(erro);
        valor_convertido.value = 'Erro na conversão';
    } finally {
        carregamento_conversor.textContent = '';
        carregamento_conversor.style.display = 'none';
    }
}

/*Conversão de moedas: 
1.  Um input para seleção de moeda, junto com 2 selects de seleção de moeda destino 
e moeda final. 
 
2.  Os menus de seleção de moeda devem ser carregados dinamicamente junto com a 
página por uma requisição à API. 
 
3.  Ao alterar o valor de qualquer um dos campos, o valor deve ser atualizado 
automaticamente. 
 
4.  Durante o processo de requisição, deve estar presente um ícone de carregamento_conversor 
ou mensagem de carregamento_conversor. 

Links para requisições: 
●  https://api.frankfurter.app */