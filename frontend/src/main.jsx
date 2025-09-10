import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';


createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <PlayerProvider>
            <App />
        </PlayerProvider>
    </BrowserRouter>
)
