import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';

import '@fontsource/quicksand/700.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';

import '../node_modules/leaflet/dist/leaflet.css';

import './index.css';
import App from './App';
import theme from './theme';
import * as serviceWorker from './serviceWorker';
import store from './store';

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <ChakraProvider theme={theme}>
                <App />
            </ChakraProvider>
        </ReduxProvider>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
