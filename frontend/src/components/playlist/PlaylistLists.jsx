import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete, MdRefresh, MdDriveFileRenameOutline, MdCancel, MdCheck } from "react-icons/md";
import { ApiContext } from "../../context/ApiContext";

const PlaylistLists = ({ refreshTrigger, currentIndex, setCurrentIndex, songs, setSongs }) => {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [suffleOn, setSuffleOn] = useState(false);
    const [renamePlaylistId, setRenamePlaylistId] = useState(null);
    const [newName, setNewName] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const { user, authChecked } = useContext(AuthContext);

    useEffect(() => {
        if (!authChecked) return;
        if (!user) return;

        fetchPlaylists();
    }, [authChecked, user, refreshTrigger]);

    const checkAuth = async () => {
        try {
            await axios.get(`${pp}/api/verify`, { withCredentials: true });
            setIsAuthenticated(true);
        } catch {
            setIsAuthenticated(false);
        } finally {
            setAuthChecked(true); // 🔑 THIS IS THE KEY
        }
    };


    const pp = useContext(ApiContext)

    useEffect(() => {
        checkAuth();
    }, []);


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
    // Fetch playlists
    const fetchPlaylists = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${pp}/api/playlist`, {
                withCredentials: true,
            });

            const filteredPlaylists = res.data.playlists.map((playlist) => ({
                ...playlist,
                songs: playlist.songs.filter(song => !song.hidden),
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
        if (!isAuthenticated) return;
        fetchPlaylists();
    }, [isAuthenticated, refreshTrigger]);


    if (loading) return <p className="text-white mt-4">Loading playlists...</p>;

    return (
        <div className="flex flex-col gap-5 p-5 bg-[#1A1824] h-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-white text-2xl font-semibold tracking-wide">
                    Your Playlists
                </h2>

                <button
                    onClick={fetchPlaylists}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FD830D] text-black rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                >
                    <MdRefresh size={22} />
                    Refresh
                </button>
            </div>

            {/* Empty state */}
            {playlists.length === 0 ? (
                <div className="text-center text-gray-400 py-10 border border-dashed border-gray-600 rounded-lg">
                    No playlists found
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {playlists.map((playlist) => (
                        <div
                            key={playlist._id}
                            className="bg-[#232031] border border-[#332F45] rounded-xl p-4 shadow-sm hover:shadow-md transition"
                        >
                            {/* Playlist Header */}
                            <div className="flex justify-between items-center mb-3">
                                {renamePlaylistId === playlist._id ? (
                                    <div className="flex gap-2 w-full">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="flex-1 px-3 py-2 rounded-md bg-[#1A1824] border border-gray-600 text-white focus:outline-none focus:border-[#FD830D]"
                                            placeholder="New playlist name"
                                        />

                                        <button
                                            onClick={() => handleRename(playlist._id)}
                                            className="p-2 bg-green-600 rounded-md hover:bg-green-700 transition"
                                        >
                                            <MdCheck size={20} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setRenamePlaylistId(null);
                                                setNewName("");
                                            }}
                                            className="p-2 bg-red-600 rounded-md hover:bg-red-700 transition"
                                        >
                                            <MdCancel size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">
                                                {playlist.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {playlist.songs.length} songs
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setRenamePlaylistId(playlist._id);
                                                    setNewName(playlist.name);
                                                }}
                                                className="p-2 bg-[#2E8B57] rounded-md hover:bg-[#3CB371] transition"
                                            >
                                                <MdDriveFileRenameOutline size={20} />
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deletePlaylist(playlist._id);
                                                }}
                                                className="p-2 bg-[#8B2E2E] rounded-md hover:bg-red-600 transition"
                                            >
                                                <MdDelete size={20} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Songs */}
                            <div className="flex flex-col gap-1">
                                {playlist.songs.length === 0 ? (
                                    <p className="text-sm text-gray-500 ml-1">
                                        No songs added
                                    </p>
                                ) : (
                                    playlist.songs.map((song) => (
                                        <div
                                            key={song._id}
                                            onClick={() => handlePlayClick(song._id)}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
                                            ${isCurrentlyPlaying(song._id)
                                                    ? "bg-[#FD830D]/10 border border-[#FD830D]"
                                                    : "hover:bg-[#2F2B3D]"
                                                }`}
                                        >
                                            {/* Cover */}
                                            <div className="relative">
                                                {song.coverImage ? (
                                                    <img
                                                        src={song.coverImage}
                                                        alt={song.title}
                                                        className="w-12 h-12 rounded-full border border-gray-500 object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                                                        N/A
                                                    </div>
                                                )}

                                                {isCurrentlyPlaying(song._id) && (
                                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FD830D] rounded-full animate-pulse" />
                                                )}
                                            </div>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate text-white">
                                                    {song.title || "Unknown"}
                                                </p>
                                                <p className="text-xs truncate text-gray-400">
                                                    {song.artist || "Unknown"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};

export default PlaylistLists;
