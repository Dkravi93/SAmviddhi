import React, { useState } from 'react';
import axios from 'axios';

const ExchangeForm = () => {
  const [fromCurrency, setFromCurrency] = useState('INR');
  
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleConvert = async () => {
    setLoading(true);

    try {
      const exchangeRateResponse = await axios.get(`http://localhost:3001/api/currency-exchange?from=${fromCurrency}&to=${toCurrency}`);
      console.log("hgghggh", exchangeRateResponse);
      const exchangeRate = exchangeRateResponse.data.exchange_rate;

      setExchangeRate(exchangeRate);

      
      const convertedAmountResponse = await axios.get(`http://localhost:3001/api/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`);
      console.log("jhvhvvv", convertedAmountResponse);
      const convertedAmount = convertedAmountResponse.data;
      setConvertedAmount(convertedAmount.max_value);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <label>From:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          <option value="INR">INR</option>
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CNY">CNY</option>
        </select>
      </div>
      <div>
        <label>To:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          <option value="INR">INR</option>
          <option value="KRW">KRW</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CNY">CNY</option>
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <button onClick={handleConvert}>Convert</button>
      {loading && <p>Loading...</p>}
      {exchangeRate && convertedAmount && (
        <div>
          <p>Exchange Rate: {convertedAmount}</p>
          <p>Converted Amount: {exchangeRate}</p>
        </div>
      )}
    </div>
  );
};

export default ExchangeForm;
