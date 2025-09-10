// context/PlayerContext.jsx
import React from "react";
import { createContext, useState } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playToggle, setPlayToggle] = useState(false);

    return (
        <PlayerContext.Provider
            value={{ songs, setSongs, currentIndex, setCurrentIndex, playToggle, setPlayToggle }}
        >
            {children}
        </PlayerContext.Provider>
    );
};
