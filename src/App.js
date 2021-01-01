import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow'

const BASE_URL = 'https://forex.cbm.gov.mm/api/latest'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount =  amount / exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount * exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {

        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions(["MMK", ...Object.keys(data.rates)])
        setFromCurrency("MMK")
        setToCurrency(firstCurrency)
        setExchangeRate(changeRateFormat(data.rates[firstCurrency]))

        console.log("firstCurrency", firstCurrency)
        console.log("CUrrency Ooptions", ["MMK", ...Object.keys(data.rates)])
        console.log("SetExhange Rate", changeRateFormat(data.rates[firstCurrency]))
      })
  }, [])


  const changeRateFormat = (str) => {
    if (typeof str != "undefined") {
      if (str.includes(",")) {
        let result = parseFloat(str.replace(/,/g, ""));
        return result;
      } else {
        let result = parseFloat(str);
        return result;
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
          setExchangeRate(changeRateFormat(data.rates[toCurrency]))
        })
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow
        currencyOptions={currencyOptions}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
