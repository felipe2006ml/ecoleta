const ufSelect = document.querySelector('select[name=uf]')
const citySelect = document.querySelector('select[name=city]')
const stateInput = document.querySelector('input[name=state]')

async function populateUFs() {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then( (res) => { return res.json()})
    .then ( states => {
        for(let state of states) {
            ufSelect.innerHTML += 
            `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()

async function getCities(event) {
    const ufValue = event.target.value
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text
    
    citySelect.innerHTML = "<option>Selecione a Cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then( (res) => { return res.json()})
    .then ( cities => {
        for(let city of cities) {
            citySelect.innerHTML += 
            `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    })
}

ufSelect.addEventListener('change', getCities)

// Itens de coleta
const itemsToCollect = document.querySelectorAll('.items-grid li')
const collectedItems = document.querySelector('input[name=items]')

for(const item of itemsToCollect) {
    item.addEventListener('click', handleSelectedItem)
}

let selectedItems = []

function handleSelectedItem(event) {
    const itemLi = event.target

    // toggle diferente de add ou remove ele funciona da seguinte maneira se existe a classe selected entao ele vai remover se não existe então ele vai adicionar
    itemLi.classList.toggle('selected')
    const itemId = itemLi.dataset.id

    // verificar se existem itens selecionados, se sim
    // pegar os itens selecionados

    const alreadySelected = selectedItems.findIndex( function(item) {
        // findIndex ira procurar dentro do array se existe o item  um por um até que ele encontre o item
        const itemFound = item == itemId // retorna true ou false
        // nesta linha estamos dizendo pra guardar em itemFound quando item == itemId for verdadeiro um if de forma reduzida
        return itemFound
        // retornaremos a posicao do array para alreadySelected, se ele nao encontrar item nenhum retornara -1
    })

    // se já estiver selecionado, 
    if(alreadySelected >= 0){
        // tirar da selecao
        const filteredItems = selectedItems.filter( function(item) {
             const itemIsDifferent = item != itemId //false
             return itemIsDifferent
        })

        selectedItems = filteredItems
    } else {
        // se não estiver selecionado

        // adicionar a seleção
        selectedItems.push(itemId)
    }

    // atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems

}



