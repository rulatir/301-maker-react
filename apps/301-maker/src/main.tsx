import './debug/wdyr.js';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {attachConsole} from "@tauri-apps/plugin-log";

(async function init() {
    await attachConsole();

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
             <App />
            {/*<LogDiagnostics />*/}
        </React.StrictMode>,
    );
})();