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
import BcGovFormioComponents from '@bcgov/formio';
// import FormioContrib from '@formio/contrib';

// import reportWebVitals from './reportWebVitals';

Formio.setProjectUrl(AppConfig.projectUrl);
Formio.setBaseUrl(AppConfig.apiUrl);
Formio.use(BcGovFormioComponents);
/* Uncomment this and the editForm of textfield will be completely overridden with only the components below to show
Formio.Components.components.textfield.editForm = function () {
    return {
        components: [
            {
                type: 'textfield',
                key: 'label',
                label: 'Label',
            },
        ],
    };
};
*/
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
