import React from "react";
import USD  from './assets/dollar.png'
import EUR from './assets/euro.png'
import BTN from './assets/bitc.png'

export default function CurrencyRow({
                                        currencyOptions,
                                        selectedCurrency,
                                        onChangeCurrency,
                                        onChangeAmount,
                                        amount
}) {

    let selectedSymbol
    (() => {
         selectedCurrency == 'USD'
             ? selectedSymbol = USD
             : selectedCurrency == 'EUR'
        ? selectedSymbol = EUR
             : selectedCurrency = 'BTN'
        ? selectedSymbol = BTN : null
    })()

    return (
        <div className="exchange-form">
            <select
                title={'fromTo'}
                value={selectedCurrency}
                onChange={onChangeCurrency}
            >
                {currencyOptions
                    .filter((option) => (
                        option == 'EUR' || option == 'USD' || option == 'BTN'
                    ))
                    .map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
            </select>
            <div className="symbol-input">
            <img src={selectedSymbol} alt="" className="img-symbol"/>
            <input className={"input"} value={amount} onChange={onChangeAmount}/>
            </div>
            </div>
    )
}