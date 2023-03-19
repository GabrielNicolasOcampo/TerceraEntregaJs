//Creo las clases con las que trabajaré para la creación de ingresos y egresos
class Dato {
    constructor(value, title, type) {
        this.value = value;
        this.title = title;
        this.type = type;
        this.id = ++Dato.counter;
    }

    get getValue() {
        return this.value;
    }

    set setValue(value) {
        this.value = value;
    }

    get getType() {
        return this.type;
    }

    set setType(type) {
        this.type = type;
    }

    //inicializo variable estática counter para relacionar objetos de tipo dato y elementos añadidos al html

    static counter = -1;
}

//selecciono los elementos html que utilizaré para el simulador
const d = document,
    $totalBudget = d.getElementById('totalBudget'),
    $totalIncome = d.getElementById('totalIncome'),
    $totalOutcome = d.getElementById('totalOutcome'),
    $addIncomeBtn = d.querySelector('.add-income'),
    $incomeTitleInput = d.getElementById('incomeTitleInput'),
    $incomeAmountInput = d.getElementById('incomeAmountInput'),
    $addOutcomeBtn = d.querySelector('.add-outcome'),
    $outcomeTitleInput = d.getElementById('outcomeTitleInput'),
    $outcomeAmountInput = d.getElementById('outcomeAmountInput'),
    $incomeList = d.getElementById('incomeList'),
    $outcomeList = d.getElementById('outcomeList');


//utilizo operador cortocircuito para obtener las entries del local storage o bien un array vacío
const ENTRY_LIST = JSON.parse(localStorage.getItem('entries')) || [];

updateData();



//función para calcular el total de un tipo de dato, sea income o outcome
function calculateTotal(type, list) {
    let counter = 0;
    list.forEach((el) => {
        if (type === el.type) {
            counter += parseInt(el.value);
        }
    })
    return counter;
}




//función para actualizar el header 
function updateHeader() {
    let totalIncome = calculateTotal('income', ENTRY_LIST),
        totalOutcome = calculateTotal('outcome', ENTRY_LIST);


    $totalBudget.textContent = (totalIncome - totalOutcome);
    $totalIncome.textContent = totalIncome;
    $totalOutcome.textContent = totalOutcome;

    if ($totalIncome.textContent === 'NaN' || $totalOutcome.textContent === 'NaN' || $totalBudget.textContent === 'NaN') {
        $totalBudget.textContent = '0';
        $totalIncome.textContent = '0';
        $totalOutcome.textContent = '0';
    };
}

//función para añadir income
function addIncome() {
    d.addEventListener('click', (e) => {
        if (e.target === $addIncomeBtn) {
            pushEntry($incomeAmountInput, $incomeTitleInput, 'income');
            resetInput($incomeAmountInput, $incomeTitleInput);
            updateData();
        }
    })
}

//función para añadir outcome
function addOutcome() {
    d.addEventListener('click', (e) => {
        if (e.target === $addOutcomeBtn) {
            pushEntry($outcomeAmountInput, $outcomeTitleInput, 'outcome')
            resetInput($outcomeAmountInput, $outcomeTitleInput);
            updateData();
        }
    })
}



//función para pushear el dato ingresado a la entry list, que luego será usado para mostrarse por pantalla con la función updateData
function pushEntry(amount, title, type) {

    let $amount = parseFloat(amount.value);

    if (!(title.value) || !(amount.value)) return;

    else ENTRY_LIST.push(new Dato($amount, title.value, type));
}


//función para limpiar el input
function resetInput(amount, title) {
    amount.value = "";
    title.value = "";
}


//función que actualiza toda la página, utilizando la callback updateHeader y añadiendo las entradas del entrylist con un foreach a la lista html correspondiente
function updateData() {

    updateHeader()


    clearElement([$incomeList, $outcomeList])


    ENTRY_LIST.forEach((el, i) => {
        if (el.type === "income") {
            addEntries($incomeList, el.title, el.value, i)
        }
        if (el.type === 'outcome') {
            addEntries($outcomeList, el.title, el.value, i)
        }
    })

    localStorage.setItem("entries", JSON.stringify(ENTRY_LIST));
}


//función que previene la duplicación de entradas al invocarse la función updateData
function clearElement(elements) {
    elements.forEach(element => {
        element.innerHTML = "";
    })
}



function addEntries(list, title, value, id) {
    if (title === '' || value === NaN) return;
    let entry = `<li id="${id}">
    <div class="entry">${title}: $${value}</div>
    <div id="delete">X</div>
    </li>`;


    list.insertAdjacentHTML('afterbegin', entry)
}



function deleteEntries() {
    d.addEventListener('click', (e) => {
        if (e.target.matches('#delete')) {
            let entry = e.target.parentNode;

            ENTRY_LIST.splice(entry.id, 1);


            updateData();
        }
    })
}


d.addEventListener('DOMContentLoaded', (e) => {
    addIncome();
    addOutcome();
    deleteEntries();
})

