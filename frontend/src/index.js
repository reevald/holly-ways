import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // tailwindcss
import App from './App';
import { UserContextProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Init QueryClient and QueryClientProvider
import { QueryClient, QueryClientProvider } from "react-query";

// Init client from queryClient
const client = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
