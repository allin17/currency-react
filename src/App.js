import './App.css';
import React, {useState, useEffect} from 'react'
import CurrencyRow from "./CurrencyRow";

const BASE_URL_OLD = 'http://api.exchangeratesapi.io/latest?access_key=75f551a14f051876bfe13b3cd7a0c673'
const BASE_URL = 'https://api.fastforex.io/'
const API_KEY = 'api_key=95602cf3a5-e5a497f49d-r9nxjr'

function App() {

    const [currencyOptions, setCurrencyOptions] = useState([])
    const [fromCurrency, setFromCurrency] = useState()
    const [toCurrency, setToCurrency] = useState()
    const [exchangeRate, setExchangeRate] = useState()
    const [fromAmount, setFromAmount] = useState(1)
    const [toAmount, setToAmount] = useState(1)

    const [todaysChange, setTodaysChange] = useState(0)
    const date = new Date()


    useEffect(() => {
        fetch(`${BASE_URL}fetch-all?${API_KEY}`)
            .then(res => res.json())
            .then((data) => {
                const results = Object.keys(data.results)
                setCurrencyOptions([...Object.keys(data.results)])
                setFromCurrency(data.base)
                setToCurrency(data[results[21]])
                setExchangeRate(data.results[results[21]])

                if (data.results[results[21]] > 0) {
                    setToAmount(fromAmount * data.results[results[21]])
                } else {
                    setFromAmount(toAmount / data.results[results[21]])
                }
            })

    }, [])



    useEffect(() => {
        if (fromCurrency && toCurrency) {

            fetch(`${BASE_URL}fetch-one?${API_KEY}&from=${fromCurrency}&to=${toCurrency}`)
                .then(res => res.json())
                .then(data => {
                    setExchangeRate(data.result[toCurrency])
                    setToAmount(fromAmount * data.result[toCurrency])
                })


        }

    }, [toCurrency, fromCurrency])

    useEffect(() => {
        toCurrency &&
        fetch(`${BASE_URL}historical?date=2022-04-01&${API_KEY}&from=${fromCurrency}`)
            .then(res => res.json())
            .then(data => {
                    const yesterday = (data.results[Object.keys(data.results).filter((el) => el == toCurrency)])
                    if (yesterday > exchangeRate) {
                        setTodaysChange(yesterday - exchangeRate)
                    } else {
                        setTodaysChange(exchangeRate - yesterday)
                    }
                }
            )
    }, [exchangeRate])



    function handleFromAmountChange(e) {
        setFromAmount(e.target.value)
        if (exchangeRate > 0) {
            setToAmount(e.target.value * exchangeRate)
        }
        if (exchangeRate < 0) {
            setToAmount(e.target.value / exchangeRate)
        }

    }

    function handleToAmountChange(e) {
        setToAmount(e.target.value)
        if (exchangeRate < 0) {
            setFromAmount(e.target.value / exchangeRate)
        }
        if (exchangeRate > 0) {
            setFromAmount(e.target.value * exchangeRate)
        }
    }

    function onSwitchCurrency() {
        const toC = toCurrency
        setToCurrency(fromCurrency)
        setFromCurrency(toC)
    }

    return (
        <>
            <h1>Exchange money</h1>
            <div className={"inputs"}>
                <div className="currency-row">
                    <CurrencyRow
                        currencyOptions={currencyOptions}
                        selectedCurrency={fromCurrency}
                        onChangeCurrency={e => {
                            setFromCurrency(e.target.value)
                        }}
                        amount={fromAmount}
                        onChangeAmount={handleFromAmountChange}
                    />
                </div>
                <div className="currency-row">
                    <CurrencyRow
                        currencyOptions={currencyOptions}
                        selectedCurrency={toCurrency}
                        onChangeCurrency={e => setToCurrency(e.target.value)}
                        amount={toAmount}
                        onChangeAmount={handleToAmountChange}
                    />
                </div>
            </div>
            <div className="bottom-section">
                <button
                    onClick={onSwitchCurrency}
                    className={"switch-button"}
                >SWAP
                </button>
                <div className="options">
                    Current rate
                    <div className="current-rate">
                        {exchangeRate && exchangeRate.toFixed(3)}
                    </div>
                </div>
                <div className="options">
                    Today's change
                    <div className="todays-change">{todaysChange.toFixed(3)}</div>
                </div>
            </div>
        </>)
        ;
}

export default App;
