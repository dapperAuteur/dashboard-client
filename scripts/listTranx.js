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

let tranx;

let table = document.querySelector("table")
console.log('table', table)

const arrURL = [budgetURL, currencyURL, vendorURL, tranxURL, finAcctURL]
// buildTransactions adds the names of the budget, currency, vendor, and financial account based on the _id of each object
let buildTransactions = () => {
    console.log("start");
    if (budgetsArr.length !== 0 || currenciesArr.length !== 0 || vendorsArr.length !== 0 || tranxArr.length !== 0 || finAcctsArr.length !== 0) {
        tranx = tranxArr;
        tranx.forEach(tx => {
            budgetsArr.forEach(budget => {
                if (tx.budget_id = budget._id) {
                    tx.budget = budget.budget_name
                    delete tx.budget_id
                    console.log('budget', budget)
                }
            })
            currenciesArr.forEach(currency => {
                if (tx.currency_id = currency._id) {
                    tx.currency = currency.currency
                    delete tx.currency_id
                }
                // console.log('currency', currency)
            })
            vendorsArr.forEach(vendor => {
                if (tx.vendor_id = vendor._id) {
                    tx.vendor = vendor.vendor_name
                    delete tx.vendor_id
                }
                // console.log('vendor', vendor)
            })
            finAcctsArr.forEach(finAcct => {
                if (tx.fin_acc_id = finAcct._id) {
                    tx.finAcct = finAcct.account_name
                    delete tx.fin_acc_id
                }
                // console.log('finAcct', finAcct)
            })
        })
        buildTable(table)
        console.log('tranx', tranx)
        return tranx
    }
}
// getBudgetData retrieves the data from the server
const getBudgetData = (function() {
    const constants = {
        data: document.getElementById('fetching')
    }
    const fetchData = async () => {
        // constants.data.innerText = 'fetching data ...'
        try {
            const response = Promise.all(arrURL.map((url, i) => {
                fetch(baseURL + arrURL[i])
                    .then(resp => 
                        resp.json()
                    )
                    .then(data =>{
                        if (data[0].hasOwnProperty('budget_name')) {
                            budgetsArr = data;
                            // console.log('budgetsArr', budgetsArr)
                        } else if (data[0].hasOwnProperty('budget_id')) {
                            tranxArr = data
                            // console.log('tranxArr', tranxArr)
                        } else if (data[0].hasOwnProperty('currency')) {
                            currenciesArr = data
                            // console.log('currenciesArr', currenciesArr)
                        } else if (data[0].hasOwnProperty('vendor_name')) {
                            vendorsArr = data
                            // console.log('vendorsArr', vendorsArr)
                        } else if (data[0].hasOwnProperty('financial_institution')) {
                            finAcctsArr = data
                            // console.log('finAcctsArr', finAcctsArr)
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
    // console.log('buildTransactions', buildTransactions())
    return {
        init: init
    }
})();
getBudgetData.init()

let generateTableHead = (table, data) => {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}
// generateTable generates the HTML for the table based on the result of the buildTransactions function
let generateTable = (table) => {
    console.log("start generateTable");
    console.log('table', table)
    tranx.forEach(tx => {
        // console.log('tx', tx)
        let row = table.insertRow();
        for (key in tx) {
            // if (object.hasOwnProperty(key)) {
            //     const element = object[key];
                
            // }
            let cell = row.insertCell();
            let text = document.createTextNode(tx[key]);
            cell.appendChild(text);
        }
    });
}

// buildTable builds the table based on the result of the buildTransactions function
let buildTable = () =>{
    let headers = Object.keys(tranx[0]);
    generateTableHead(table, headers);
    generateTable(table, tranx);
}

