import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Playlist from '../components/playlist/Playlist';
import CreatePlaylist from '../components/playlist/CreatePlaylist';
import PlaylistLists from '../components/playlist/PlaylistLists';
import PlayerBottom from '../components/homepage/PlayerBottom';

const PlaylistPage = () => {
    const [songs, setSongs] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadingSongs, setLoadingSongs] = useState(true);
    const [refreshPlaylists, setRefreshPlaylists] = useState(false); // to refresh playlists after creation
    const pp = "https://pulseplay-8e09.onrender.com"
    const localhost = "http://localhost:4000"

    // Fetch songs from backend
    useEffect(() => {
        const fetchSongs = async () => {
            setLoadingSongs(true);
            try {
                const res = await axios.get(`${pp}/api/song/songs`, { withCredentials: true });
                setSongs(res.data.songs || []);
            } catch (err) {
                console.error('Failed to fetch songs:', err);
            } finally {
                setLoadingSongs(false);
            }
        };
        fetchSongs();
    }, []);

    const refreshHandler = () => setRefreshPlaylists((prev) => !prev);

    if (loadingSongs) return <p className="text-white mt-4">Loading songs...</p>;

    return (
        <div className="relative bg-[#1A1824] h-auto ">
            {/* Your Playlist Section */}
            <Playlist />
            <CreatePlaylist refreshPlaylists={refreshHandler} />
            <PlaylistLists refreshTrigger={refreshPlaylists} />

        </div>
    );
};

export default PlaylistPage;
