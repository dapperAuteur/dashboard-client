console.log('d3 object', d3)
// d3.select("#graph")
//

const baseURL = "http://localhost:8080/v1"
const budgetURL = "/budgets"
const vendorURL = "/vendors"
const tranxRequest = new Request("http://localhost:8080/v1/transactions")
const vendorRequest = new Request(baseURL + vendorURL)

let token;
let vendors;
// const request = new Request("http://localhost:8081/api/ver0001/verbos/")

// const url = request.url
let vendorSelect = document.getElementById("vendor-select")
// const method = request.method
fetch(vendorRequest)
    .then(response => response.json())
    .then(data => {
        vendors = data;
        console.log('vendors', vendors)
        vendors.forEach(vendor => {
            let v = document.createElement("option")
            v.appendChild(document.createTextNode(vendor.vendor_name))
            v.value = vendor._id
            vendorSelect.appendChild(v)
        });
    })
// fetch(request)
//     .then(response => response.json())
//     .then(data => {
//         tranx = data;
//         // console.log('object', data)
//         // console.log('tranx', tranx)

//         // let min = d3.min(tranx)
//         // let min = d3.min(tranx)
//         // console.log('min', min)
//     })

let budgets = document.getElementById("budget-select")
let currencies = document.getElementById("currency-select")
let finAccts = document.getElementById("financial-account-select")
let occurrence = document.getElementById("occurrence-string")
let tranxEvent = document.getElementById("transaction-event")
let tranxDebit = document.getElementById("transaction-debit")
let tranxCredit = document.getElementById("transaction-credit")
let vendor = document.getElementById("vendor-select")
let participant = document.getElementById("participant-select")

let tranx;

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
            vendor.value = e.target.value
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
        vendor_id: vendor.value,
        participant_id: [participant.value]
    }
    console.log('newTransaction tranx', tranx)
    fetch(tranxRequest, {
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
            // console.log('resp', resp)
            if (!resp.ok) {
                console.log('resp NOT ok')
                if (resp.status >= 400 && resp.status < 500) {
                    return resp.json().then(data => {
                        // console.log('data', data)
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