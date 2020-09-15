console.log('d3 object', d3)
// d3.select("#graph")
//

const baseURL = "http://localhost:8080/v1"
const budgetURL = "/budgets"
let budgetsArr = []
const currencyURL = "/currencies"
let currenciesArr = []
const vendorURL = "/vendors"
let vendorsArr = []
const tranxURL = "/transactions"
let tranxArr = []
const finAcctURL = "/financial-accounts"
let finAcctsArr = []

let token;

let budgets = document.getElementById("budget-select")
let currencies = document.getElementById("currency-select")
let finAccts = document.getElementById("financial-account-select")
let occurrence = document.getElementById("occurrence-string")
let tranxEvent = document.getElementById("transaction-event")
let tranxDebit = document.getElementById("transaction-debit")
let tranxCredit = document.getElementById("transaction-credit")
let vendorSelect = document.getElementById("vendor-select")
let participant = document.getElementById("participant-select")

let tranx;
// const participantURL = "/users" // BUG get UserList isn't working
const arrURL = [budgetURL, currencyURL, vendorURL, tranxURL, finAcctURL]

const getBudgetData = (function() {
    const constants = {
        data: document.getElementById('fetching')
    }
    const fetchData = async () => {
        constants.data.innerText = 'fetching data ...'
        try {
            const response = Promise.all(arrURL.map((url, i) => {
                fetch(baseURL + arrURL[i])
                    .then(resp => 
                        resp.json()
                    )
                    .then(data =>{
                        if (data[0].hasOwnProperty('budget_name')) {
                            budgetsArr = data;
                            console.log('budgetsArr', budgetsArr)
                        } else if (data[0].hasOwnProperty('budget_id')) {
                            tranxArr = data
                            console.log('tranxArr', tranxArr)
                        } else if (data[0].hasOwnProperty('currency')) {
                            currenciesArr = data
                        } else if (data[0].hasOwnProperty('vendor_name')) {
                            vendorsArr = data
                            vendorsArr.forEach(vendor => {
                                let v = document.createElement("option")
                                v.appendChild(document.createTextNode(vendor.vendor_name))
                                v.value = vendor._id
                                vendorSelect.appendChild(v)
                            });
                        } else if (data[0].hasOwnProperty('financial_institution')) {
                            finAcctsArr = data
                        } else {
                            console.log('NOT fitting data', data)
                        }
                    })
            }))
        } catch (error) {
            console.log('error', error)
        }
    }
    const init = () => {
        fetchData();
    }
    return {
        init: init
    }
})();
getBudgetData.init()



let onChange= (e) => {

    let name = e.target.name;

    switch (name) {
        case "budgets":
            budgets.value = e.target.value
            break;
        case "currencies":
            currencies.value = e.target.value
            break;
        case "finAccts":
            finAccts.value = e.target.value
            break;
        case "occurrence":
            occurrence.value = e.target.value
            break;
        case "tranxEvent":
            tranxEvent.value = e.target.value
            break;
        case "tranxDebit":
            tranxDebit.value = e.target.value
            break;
        case "tranxCredit":
            tranxCredit.value = e.target.value
            break;
        case "vendor":
            vendorSelect.value = e.target.value
            break;
        case "participant":
            participant.value = e.target.value
            break;
        default:
            console.log('name : ', name, " NOT found")
            break;
    }
}

document.addEventListener("input", (e) => {
    onChange(e)
})

let getToken = () => {
    token = localStorage.getItem('token') || {};
    console.log('token', token)
    token = JSON.parse(token)
    if (token.hasOwnProperty('token')) {
        console.log('token', token)
    } else {
        console.log("token NOT available");
    }
}

let createTransaction = () => {
    getToken()
    console.log('token', token)
    tranx = {
        budget_id: budgets.value,
        currency_id: currencies.value,
        fin_acc_id: [finAccts.value],
        occurrence_string: occurrence.value,
        tranx_event: tranxEvent.value,
        tranx_debit: parseFloat(tranxDebit.value),
        tranx_credit: parseFloat(tranxCredit.value),
        vendor_id: vendorSelect.value,
        participant_id: [participant.value]
    }
    console.log('newTransaction tranx', tranx)
    fetch(baseURL + tranxURL, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.token}`,
        }),
        body: JSON.stringify({...tranx})
    })
        .then(resp => {
            if (!resp.ok) {
                console.log('resp NOT ok')
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        let err = {errorMessage: data.error}
                        throw err
                    })
                } else {
                    let err = {errorMessage: "Please try again later.  Server not responding."};
                    throw err;
                }
            }
            return resp.json();
        })
        .then(tr => {
            console.log('tr', tr)
            return tr;
        })
}