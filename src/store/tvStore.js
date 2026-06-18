import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTvStore = create(
  persist(
    (set) => ({
      channels: [],
      playlistUrls: [],
      favorites: [],
      recentlyWatched: [],
      addPlaylist: (parsedChannels, url) =>
        set((state) => {
          // If this URL is already loaded, we just skip (optional protection)
          if (state.playlistUrls.includes(url)) return state;

          const mergedChannels = [...state.channels];
          
          parsedChannels.forEach((newChannel) => {
            // Find existing channel by name (case-insensitive)
            const existing = mergedChannels.find(
              (c) => c.name.toLowerCase().trim() === newChannel.name.toLowerCase().trim()
            );

            if (existing) {
              // Ensure we have an array of urls
              if (!existing.urls) {
                existing.urls = [existing.url];
              }
              // Append the new url if not already present
              if (!existing.urls.includes(newChannel.url)) {
                existing.urls.push(newChannel.url);
              }
            } else {
              // New channel, ensure it uses the 'urls' array structure
              mergedChannels.push({
                ...newChannel,
                urls: [newChannel.url]
              });
            }
          });

          return {
            channels: mergedChannels,
            playlistUrls: [...state.playlistUrls, url]
          };
        }),
      removeChannel: (channelId) =>
        set((state) => ({
          channels: state.channels.filter((c) => c.id !== channelId),
        })),
      renameChannel: (channelId, newName) =>
        set((state) => ({
          channels: state.channels.map((c) =>
            c.id === channelId ? { ...c, name: newName } : c
          ),
          favorites: state.favorites.map((c) =>
            c.id === channelId ? { ...c, name: newName } : c
          ),
          recentlyWatched: state.recentlyWatched.map((c) =>
            c.id === channelId ? { ...c, name: newName } : c
          ),
        })),
      clearPlaylists: () =>
        set({ channels: [], playlistUrls: [], favorites: [], recentlyWatched: [] }),
      addFavorite: (channel) =>
        set((state) => ({
          favorites: state.favorites.find((c) => c.id === channel.id)
            ? state.favorites
            : [...state.favorites, channel],
        })),
      removeFavorite: (channelId) =>
        set((state) => ({
          favorites: state.favorites.filter((c) => c.id !== channelId),
        })),
      addToHistory: (channel) =>
        set((state) => {
          const filtered = state.recentlyWatched.filter((c) => c.id !== channel.id);
          return {
            recentlyWatched: [channel, ...filtered].slice(0, 10), // Keep last 10
          };
        }),
    }),
    {
      name: 'mmbtv-storage',
    }
  )
);
