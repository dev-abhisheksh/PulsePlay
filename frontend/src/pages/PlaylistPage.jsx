import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import Playlist from '../components/playlist/Playlist';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import PlaylistLists from '../components/playlist/PlaylistLists';
import PlayerBottom from '../components/homepage/PlayerBottom';
import Navbar from '../components/homepage/Navbar';
import { ApiContext } from '../context/ApiContext';

const PlaylistPage = ({ songs, currentIndex, setCurrentIndex }) => {
    const [loadingSongs, setLoadingSongs] = useState(false); // Set to false since songs come from props
    const [refreshPlaylists, setRefreshPlaylists] = useState(false);
    const [playToggle, setPlayToggle] = useState(false);
    const pp = useContext(ApiContext)


    const refreshHandler = () => setRefreshPlaylists((prev) => !prev);

    if (loadingSongs) return <p className="text-white mt-4">Loading songs...</p>;

    return (
        <div className="bg-[#1A1824] h-screen flex flex-col">
            {/* Fixed Top Section */}
            <div className="flex-shrink-0">
                <Navbar />
                <CreatePlaylist refreshPlaylists={refreshHandler} />
            </div>

            {/* Scrollable Playlist Section */}
            <div className="flex-1 overflow-y-auto">
                <PlaylistLists
                    songs={songs.filter(song => !song.hidden)}
                    refreshTrigger={refreshPlaylists}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
            </div>

            {/* PlayerBottom */}
            <PlayerBottom
                songs={songs}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                playToggle={playToggle}
                setPlayToggle={setPlayToggle}
            />
        </div>
    );
};

export default PlaylistPage;