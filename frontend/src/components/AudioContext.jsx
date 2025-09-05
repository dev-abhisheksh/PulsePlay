import React, { createContext, useContext, useState, useRef } from "react";

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playToggle, setPlayToggle] = useState(false);
    const audioRef = useRef(null);

    return (
        <AudioContext.Provider
            value={{ songs, setSongs, currentIndex, setCurrentIndex, playToggle, setPlayToggle, audioRef }}
        >
            {children}
        </AudioContext.Provider>
    );
};

