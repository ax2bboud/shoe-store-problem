const WS = new WebSocket('ws://localhost/');

WS.onmessage = function(event) {
    parseInventoryUpdate(event.data);
};

let STORES = [];

const parseInventoryUpdate = (inventoryUpdate) => {
    inventoryUpdate = JSON.parse(inventoryUpdate);
    let store = new Store(inventoryUpdate.store);
    let shoe = new Shoe(inventoryUpdate.model, inventoryUpdate.inventory);
    let storeIndex = storeExists(store);
    if(storeIndex >= 0){
        store = STORES[storeIndex]
        store.updateShoes(shoe);
    }else{
        store.updateShoes(shoe);
        STORES.push(store);
        createTabForStore(store);
    }
    populateTabContentForStore(store);
    if(shoe.quantity < 10){
        warnLowInventory(shoe, store);
    }
};

populateTabContentForStore = (store) => {
    let tabContent = document.getElementById(formatIdString(store.name) + '-content');
    if(!tabContent.hasChildNodes()){
        createShoeTable(tabContent);
    }
    updateStoreTable(store);
}

const updateStoreTable = (store) =>{
    let storeTable = document.querySelector('#' + formatIdString(store.name) + '-content>table');
    let tBody = document.querySelector('#' + formatIdString(store.name) + '-content>table>tbody');
    store.shoes.forEach((shoe) => {
        let rowId = formatIdString(store.name) + '-' + formatIdString(shoe.name)+ '-row';
        let dataRow = document.getElementById(rowId);
        if(dataRow === null){
            let tr = document.createElement("tr");
            tr.id = rowId
            let modelTd = document.createElement("td");
            modelTd.innerHTML = shoe.name;
            modelTd.classList.add('model-td');
            tr.appendChild(modelTd);
            let inventoryTd = document.createElement("td");
            inventoryTd.innerHTML = shoe.quantity;
            inventoryTd.classList.add('inventory-td');
            tr.appendChild(inventoryTd);
            tBody.appendChild(tr);
        }else{
            let inventoryTd = document.querySelector('#'+rowId+'>.inventory-td');
            inventoryTd.innerHTML = shoe.quantity;
        }
    });
    storeTable.appendChild(tBody);
}

const createShoeTable = (tableContainer) => {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    let modelTh = document.createElement("th");
    modelTh.innerHTML = "Model";
    let inventoryTh = document.createElement("th");
    inventoryTh.innerHTML = "Inventory";
    let tBody = document.createElement("tbody");
    tr.appendChild(modelTh);
    tr.appendChild(inventoryTh);
    thead.appendChild(tr);
    table.appendChild(thead);
    table.appendChild(tBody);
    tableContainer.appendChild(table);
}

const createTabForStore = (store) => {
    const tabsContainer = document.getElementById('store-tabs');
    let tab = document.createElement('li');
    let tabId = formatIdString(store.name) + '-tab';
    tab.id = tabId;
    tab.classList.add("tab");
    let tabContent = document.createElement("div")
    tabContent.id = formatIdString(store.name) + '-content'
    tabContent.classList.add("col");
    tabContent.classList.add("s12");
    const contentContainer = document.getElementById("content-container")
    contentContainer.appendChild(tabContent);
    let tabLink = document.createElement('a')
    tabLink.innerHTML = store.name;
    tabLink.href = '#' + tabContent.id;
    tab.appendChild(tabLink);
    tabsContainer.appendChild(tab);
    let tabsInstance = M.Tabs.init(document.querySelector('.tabs'), {});
}

const storeExists = (store) => {
    return STORES.findIndex( s => s.name === store.name)
}

const warnLowInventory = (shoe, store) => {
    M.toast({
        html: `Warning! Low inventory amount of model ${shoe.name} in store ${store.name}.`,
        displayLength: 3000,
        classes: "blinking"
    });
    const warningSound = document.getElementById("warning-audio");
    //warningSound.play(); disabled because it's annoying
};

window.onload = () => {
    alert('Low Stock warnings will produce audible alarms.');
};