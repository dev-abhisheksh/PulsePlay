import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete, MdRefresh, MdDriveFileRenameOutline, MdCancel, MdCheck } from "react-icons/md";

const PlaylistLists = ({ refreshTrigger, currentIndex, setCurrentIndex, songs, setSongs }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suffleOn, setSuffleOn] = useState(false);
    const [renamePlaylistId, setRenamePlaylistId] = useState(null);
    const [newName, setNewName] = useState("");

    const pp = /*"https://pulseplay-8e09.onrender.com"*/  "http://localhost:4000"

    // Handle renaming a playlist
    const handleRename = async (playlistId) => {
        try {
            await axios.patch(
                `${pp}/api/playlist/${playlistId}/rename`,
                { name: newName },
                { withCredentials: true }
            );
            toast.success("Playlist renamed successfully!");
            setRenamePlaylistId(null);
            setNewName("");
            fetchPlaylists();
        } catch (err) {
            console.error(err);
            toast.error("Failed to rename playlist");
        }
    };

    // Handle play song
    const handlePlayClick = (songId) => {
        const globalIndex = songs.findIndex((s) => s._id === songId);
        if (globalIndex !== -1) {
            setCurrentIndex(globalIndex);
        }
    };

    const isCurrentlyPlaying = (songId) => {
        if (!songs[currentIndex]) return false;
        return songs[currentIndex]._id === songId;
    };

    // Fetch playlists
    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${pp}/api/playlist`, {
                withCredentials: true,
            });

            // Filter out hidden songs
            const filteredPlaylists = res.data.playlists.map((playlist) => ({
                ...playlist,
                songs: playlist.songs.filter((song) => !song.hidden),
            }));

            setPlaylists(filteredPlaylists);
        } catch (error) {
            console.error("Failed to fetch playlists", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSuffle = () => setSuffleOn(!suffleOn);

    // Delete playlist
    const deletePlaylist = (playlistId) => {
        toast.info(
            <div>
                <p>Are you sure you want to delete this playlist?</p>
                <div className="mt-2 flex justify-end gap-2">
                    <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={async () => {
                            toast.dismiss();
                            try {
                                await axios.delete(`${pp}/api/playlist/delete/${playlistId}`, {
                                    withCredentials: true,
                                });
                                fetchPlaylists();
                                toast.success("Playlist deleted successfully!");
                            } catch (err) {
                                console.error(err);
                                toast.error("Failed to delete playlist");
                            }
                        }}
                    >
                        Confirm
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            { autoClose: false, closeButton: false }
        );
    };

    useEffect(() => {
        fetchPlaylists();
    }, [refreshTrigger]);

    if (loading) return <p className="text-white mt-4">Loading playlists...</p>;

    return (
        <div className="flex flex-col gap-4 p-4 bg-[#1A1824] h-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-2xl font-bold">Your Playlists</h2>
                <button
                    onClick={fetchPlaylists}
                    className="px-4 py-2 bg-[#FD830D] hover:bg-[#FD830D] text-white rounded-lg font-semibold transition"
                >
                    <MdRefresh size={25} />
                </button>
            </div>

            {playlists.length === 0 ? (
                <p className="text-white">No playlists found.</p>
            ) : (
                playlists.map((playlist) => (
                    <div
                        key={playlist._id}
                        className="bg-[#2A2738] p-4 rounded-md text-white flex flex-col hover:bg-[#3B3950] transition"
                    >
                        {/* Header Row */}
                        <div className="flex justify-between items-center">
                            {renamePlaylistId === playlist._id ? (
                                <div className="flex gap-2 items-center w-full">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="px-2 py-1 rounded bg-gray-700 text-white flex-1"
                                        placeholder="New playlist name"
                                    />
                                    <button
                                        onClick={() => handleRename(playlist._id)}
                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                                    >
                                        <MdCheck size={20} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setRenamePlaylistId(null);
                                            setNewName("");
                                        }}
                                        className="px-3 py-1 bg-red-500 hover:bg-gray-600 text-white rounded"
                                    >
                                        <MdCancel size={20} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-semibold text-lg">
                                        {playlist.name} ({playlist.songs.length} songs)
                                    </h3>
                                    <div className="flex">
                                        <button
                                            onClick={() => {
                                                setRenamePlaylistId(playlist._id);
                                                setNewName(playlist.name);
                                            }}
                                            className="py-1 px-3 rounded-md bg-green-500 hover:bg-green-600"
                                        >
                                            <MdDriveFileRenameOutline size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deletePlaylist(playlist._id);
                                            }}
                                            className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm flex items-center justify-center"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Songs inside playlist */}
                        <div className="mt-2 ml-2 flex flex-col gap-1">
                            {playlist.songs.length === 0 ? (
                                <p className="text-gray-400 text-sm">No songs added</p>
                            ) : (
                                playlist.songs.map((song) => (
                                    <div
                                        key={song._id}
                                        onClick={() => handlePlayClick(song._id)}
                                        className={`text-white text-sm flex gap-3 items-center cursor-pointer p-2 rounded-md ${isCurrentlyPlaying(song._id)
                                            ? "bg-[#6b6a6e] bg-opacity-20 border-1 border-white"
                                            : ""
                                            }`}
                                    >
                                        <div className="relative">
                                            {song.coverImage ? (
                                                <img
                                                    src={song.coverImage}
                                                    alt={song.title}
                                                    className={`w-12 h-12 border-2 rounded-full transition-all duration-200 ${isCurrentlyPlaying(song._id)
                                                        ? "border-white"
                                                        : "border-white"
                                                        }`}
                                                />
                                            ) : (
                                                <div
                                                    className={`w-12 h-12 border-2 rounded-full flex items-center justify-center ${isCurrentlyPlaying(song._id)
                                                        ? "border-white bg-[#FD830D] bg-opacity-20"
                                                        : "border-white bg-gray-600"
                                                        }`}
                                                >
                                                    <span className="text-white text-xs">No Image</span>
                                                </div>
                                            )}

                                            {/* Playing indicator */}
                                            {isCurrentlyPlaying(song._id) && (
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FD830D] rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h1
                                                className={`font-semibold text-[15px] truncate max-w-[200px] transition-colors duration-200 ${isCurrentlyPlaying(song._id) ? "text-white" : "text-white"
                                                    }`}
                                            >
                                                {song.title || "Unknown"}
                                            </h1>
                                            <p
                                                className={`text-[12px] truncate max-w-[200px] transition-colors duration-200 ${isCurrentlyPlaying(song._id)
                                                    ? "text-white text-opacity-80"
                                                    : "text-white"
                                                    }`}
                                            >
                                                {song.artist || "Unknown"}
                                            </p>
                                        </div>
                                    </div>
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
