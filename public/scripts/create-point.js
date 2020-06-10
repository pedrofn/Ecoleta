function populateUFs () {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( res => res.json() )
    .then( states => {

        for( const state of states ) {
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    } )
}

populateUFs()



function getCities(event) {
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")

    const ufvalue = event.target.value

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufvalue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
    citySelect.disabled = true 

    fetch(url)
    .then( res => res.json() )
    .then( cities => {
        

        for( const city of cities ) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false 
    })
}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)

// Itens de coleta
// pegar todos os li`s

const itemsToColect = document.querySelectorAll(".items-grid li")

for(const item of itemsToColect) {
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")


let SelectedItems = []


function handleSelectedItem(event) {
    const itemLi = event.target

    // add or remove uma classe com js
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    // Verificar se existem itens selecionados se sim pega-los

    const alreadySelected = SelectedItems.findIndex( item => {
        const itemFound = item == itemId
        return itemFound
    })
    
    if( alreadySelected >= 0 ) {
        const filteredItems = SelectedItems.filter( item => {
            const itemsDifferent = item != itemId 
            return itemsDifferent 
        })
    
        SelectedItems = filteredItems
    } else {
        // se nao estiver selecionado 
        // adicionar a selecao 
        SelectedItems.push(itemId)
    }
    
    //console.log('selectedItems: ', selectedItems)
    
    // atualizar o campo escondido com os itens selecionados
    collectedItems.value = SelectedItems

}