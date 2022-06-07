import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { store } from './store';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { BaseTheme } from './styles/Theme';
import { Formio } from '@formio/react';
import { AppConfig } from './config';
// import reportWebVitals from './reportWebVitals';

Formio.setProjectUrl(AppConfig.formio.projectUrl);
Formio.setBaseUrl(AppConfig.formio.apiUrl);

// eslint-disable-next-line
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    // <React.StrictMode>
    <Provider store={store}>
        <ThemeProvider theme={BaseTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
