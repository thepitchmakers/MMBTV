import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTvStore } from '../store/tvStore';

export default function useKeyboardNavigation(channels, currentChannelId) {
  const navigate = useNavigate();
  const { addToHistory } = useTvStore();

  const playAdjacentChannel = useCallback((direction) => {
    if (!channels || channels.length === 0 || !currentChannelId) return;
    const idx = channels.findIndex((c) => c.id === currentChannelId);
    if (idx === -1) return;
    let next = idx + direction;
    if (next < 0) next = channels.length - 1;
    if (next >= channels.length) next = 0;
    const ch = channels[next];
    addToHistory(ch);
    navigate(`/player/${ch.id}`);
  }, [channels, currentChannelId, navigate, addToHistory]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowUp') { e.preventDefault(); playAdjacentChannel(-1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); playAdjacentChannel(1); }
      if (e.key === ' ') {
        e.preventDefault();
        const v = document.getElementById('hls-video');
        if (v) v.paused ? v.play() : v.pause();
      }
      if (e.key.toLowerCase() === 'f') {
        const v = document.getElementById('hls-video');
        if (v) {
          if (!document.fullscreenElement) v.requestFullscreen();
          else document.exitFullscreen();
        }
      }
      if (e.key.toLowerCase() === 'm') {
        const v = document.getElementById('hls-video');
        if (v) v.muted = !v.muted;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [playAdjacentChannel]);
}
