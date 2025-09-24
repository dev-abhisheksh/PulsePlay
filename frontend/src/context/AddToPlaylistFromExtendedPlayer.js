import { createContext } from "react";

export const AddToPlaylistFromExtendedPlayer = createContext({
    playlistId: null,
    playlistState: {},
    handleAddSong: () => { },
    handleRemoveSong: () => { }
});   