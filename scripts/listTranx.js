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

const arrURL = [budgetURL, currencyURL, vendorURL, tranxURL, finAcctURL]
let buildTransactions = () => {
    console.log("start");
    if (budgetsArr.length !== 0 || currenciesArr.length !== 0 || vendorsArr.length !== 0 || tranxArr.length !== 0 || finAcctsArr.length !== 0) {
        tranx = tranxArr;
        tranx.forEach(tx => {
            budgetsArr.forEach(budget => {
                if (tx.budget_id = budget._id) {
                    tx.budget = budget.budget_name
                }
                // console.log('budget', budget)
            })
            currenciesArr.forEach(currency => {
                if (tx.currency_id = currency._id) {
                    tx.currency = currency.currency
                }
                // console.log('currency', currency)
            })
            vendorsArr.forEach(vendor => {
                if (tx.vendor_id = vendor._id) {
                    tx.vendor = vendor.vendor_name
                }
                // console.log('vendor', vendor)
            })
            finAcctsArr.forEach(finAcct => {
                if (tx.fin_acc_id = finAcct._id) {
                    tx.finAcct = finAcct.account_name
                }
                // console.log('finAcct', finAcct)
            })
        })
        console.log('tranx', tranx)
        return tranx
    }
    console.log('tranx', tranx)
    return tranx
}
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
                            console.log('vendorsArr', vendorsArr)
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