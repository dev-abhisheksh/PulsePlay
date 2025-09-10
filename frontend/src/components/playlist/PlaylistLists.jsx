import React, { useState, useEffect } from "react";
import axios from "axios";

const PlaylistLists = ({ refreshTrigger }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const pp = "https://pulseplay-8e09.onrender.com"
    const localhost = "http://localhost:4000"


    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${pp}/api/playlist`, {
                withCredentials: true, // send cookies for auth
            });
            console.log("Fetched playlists:", res.data.playlists);
            setPlaylists(res.data.playlists);
        } catch (error) {
            console.error("Failed to fetch playlists", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [refreshTrigger]); // refreshTrigger lets parent re-fetch when new playlist is created

    if (loading) return <p className="text-white mt-4">Loading playlists...</p>;

    return (
        <div className="flex flex-col gap-4 p-4 bg-[#1A1824] h-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">Your Playlists</h2>
                <button
                    onClick={fetchPlaylists}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-semibold transition"
                >
                    Refresh
                </button>
            </div>

            {playlists.length === 0 ? (
                <p className="text-white">No playlists found.</p>
            ) : (
                playlists.map((playlist) => (
                    <div
                        key={playlist._id}
                        className="bg-[#2A2738] p-4 rounded-md text-white cursor-pointer hover:bg-[#3B3950] transition"
                    >
                        <h3 className="font-semibold text-lg">
                            {playlist.name} ({playlist.songs.length} songs)
                        </h3>

                        <div className="mt-2 ml-2">
                            {playlist.songs.length === 0 ? (
                                <p className="text-gray-400 text-sm">No songs added</p>
                            ) : (
                                playlist.songs.map((song) => (
                                    <p key={song._id} className="text-gray-300 text-sm">
                                        {song.title} - {song.artist || "Unknown Artist"}
                                    </p>
                                ))
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PlaylistLists;
