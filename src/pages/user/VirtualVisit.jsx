import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import defaultTour from '../../data/musee1.json';

export default function VirtualVisit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getArtworkById } = useAdmin();

  const [artwork, setArtwork] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);

  const [sceneList, setSceneList] = useState([]);
  const [currentSceneId, setCurrentSceneId] = useState(null);

  useEffect(() => {
    const data = getArtworkById ? getArtworkById(id) : null;
    if (!data) { setArtwork(defaultTour); return; }
    const refersToDefault =
      data.tour === defaultTour.id ||
      (typeof data.tourPath === 'string' && data.tourPath.includes(defaultTour.id)) ||
      data.tourId === defaultTour.id ||
      id === defaultTour.id;
    const merged = refersToDefault ? { ...defaultTour, ...data } : { ...defaultTour, ...data };
    if (!merged.scenes || merged.scenes.length === 0) merged.scenes = defaultTour.scenes || [];
    setArtwork(merged);
  }, [id, getArtworkById]);

  useEffect(() => {
    if (!artwork) return;

    const buildSceneList = () => {
      const list = [];
      if (Array.isArray(artwork.scenes) && artwork.scenes.length > 0) {
        artwork.scenes.forEach((s, idx) => {
          const pano = s.panorama || s.image || null;
          if (!pano) return;
          list.push({
            id: s.id ?? `scene-${idx + 1}`,
            title: s.title ?? `Salle ${idx + 1}`,
            panorama: pano,
            thumb: s.thumb || pano,
            room: s.room ?? s.title ?? `Salle ${idx + 1}`,
            floor: s.floor ?? artwork.floor ?? '',
            description: s.description ?? '',
            raw: s
          });
        });
      } else {
        const pano = artwork.panorama || artwork.image || null;
        if (pano) {
          list.push({
            id: 'scene-1',
            title: artwork.title || 'Salle 1',
            panorama: pano,
            thumb: pano,
            room: artwork.room ?? artwork.title ?? 'Salle 1',
            floor: artwork.floor ?? '',
            description: artwork.description ?? '',
            raw: {}
          });
        }
      }
      return list;
    };

    const usableScenes = buildSceneList();
    setSceneList(usableScenes);
    if (usableScenes.length === 0) { console.error('Aucune image panoramique trouvée.'); return; }

    const cssHref = 'https://unpkg.com/pannellum/build/pannellum.css';
    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssHref;
      document.head.appendChild(link);
    }

    const initViewer = () => {
      if (!window.pannellum || !containerRef.current) return;
      try { viewerRef.current && viewerRef.current.destroy(); } catch (e) {}
      const scenesObj = {};
      usableScenes.forEach((s) => {
        const original = s.raw || {};
        scenesObj[s.id] = {
          title: s.title,
          type: 'equirectangular',
          panorama: s.panorama,
          pitch: original.pitch ?? 0,
          yaw: original.yaw ?? 180,
          hfov: original.hfov ?? 110,
          hotSpots: original.hotSpots || []
        };
      });
      const config = { default: usableScenes[0].id, scenes: scenesObj };
      viewerRef.current = window.pannellum.viewer(containerRef.current, config);
      setCurrentSceneId(usableScenes[0].id);
      try {
        viewerRef.current.on('scenechange', () => {
          try { setCurrentSceneId(viewerRef.current.getScene()); } catch (e) {}
        });
      } catch (e) {}
    };

    const scriptSrc = 'https://unpkg.com/pannellum/build/pannellum.js';
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = initViewer;
      document.body.appendChild(script);
    } else {
      initViewer();
    }

    return () => {
      try { viewerRef.current && viewerRef.current.destroy(); } catch (e) {}
      viewerRef.current = null;
      setCurrentSceneId(null);
    };
  }, [artwork]);

  useEffect(() => {
    if (!sceneList || sceneList.length === 0) return;
    sceneList.forEach(s => { const img = new Image(); img.src = s.panorama; });
  }, [sceneList]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') animateYaw(-30);
      if (e.key === 'ArrowRight') animateYaw(30);
      if (e.key === 'ArrowUp') zoomIn();
      if (e.key === 'ArrowDown') zoomOut();
      if (e.key === ' ') { e.preventDefault(); setIsInfoVisible(v => !v); }
      if (/^[1-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (sceneList[idx]) loadScene(sceneList[idx].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sceneList, currentSceneId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (ev) => { touchStartX.current = ev.touches?.[0]?.clientX ?? 0; };
    const onTouchEnd = (ev) => {
      const endX = ev.changedTouches?.[0]?.clientX ?? 0;
      const dx = endX - touchStartX.current;
      if (Math.abs(dx) < 50) return;
      const idx = sceneList.findIndex(s => s.id === currentSceneId);
      if (dx < 0 && idx < sceneList.length - 1) loadScene(sceneList[idx + 1].id);
      if (dx > 0 && idx > 0) loadScene(sceneList[idx - 1].id);
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [sceneList, currentSceneId]);

  const animateYaw = (delta) => {
    const v = viewerRef.current;
    if (!v) return;
    const start = v.getYaw();
    const target = start + delta;
    const duration = 300;
    let t0 = null;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / duration);
      v.setYaw(start + (target - start) * p);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const toggleMute = () => setIsMuted(v => !v);
  const toggleInfo = () => setIsInfoVisible(v => !v);

  const loadScene = (sceneId) => {
    if (!viewerRef.current || isTransitioning || sceneId === currentSceneId) return;
    const target = sceneList.find(s => s.id === sceneId);
    if (!target) return;
    setIsTransitioning(true);
    const img = new Image();
    img.src = target.panorama;
    img.onload = () => {
      try { viewerRef.current.loadScene(sceneId); setCurrentSceneId(sceneId); } catch (e) { console.error(e); }
      setTimeout(() => setIsTransitioning(false), 450);
    };
    img.onerror = () => { console.error('Préchargement panorama échoué', target.panorama); setIsTransitioning(false); };
  };

  const zoomIn = () => { const v = viewerRef.current; if (!v) return; v.setHfov(Math.max(30, v.getHfov() - 10)); };
  const zoomOut = () => { const v = viewerRef.current; if (!v) return; v.setHfov(Math.min(140, v.getHfov() + 10)); };
  const rotateLeft = () => animateYaw(-30);
  const rotateRight = () => animateYaw(30);
  const resetView = () => { const v = viewerRef.current; if (!v) return; v.setPitch(0); v.setYaw(180); v.setHfov(110); };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) { await el.requestFullscreen().catch(() => {}); }
    else { await document.exitFullscreen().catch(() => {}); }
  };

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement de la visite virtuelle...</p>
        </div>
      </div>
    );
  }

  const currentMeta = sceneList.find(s => s.id === currentSceneId) || sceneList[0] || null;

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </button>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {currentMeta ? `${currentMeta.room}${currentMeta.floor ? ' — Étage ' + currentMeta.floor : ''}` : artwork.title}
            </div>
            {currentMeta && <div className="text-sm text-gray-600">{currentMeta.description}</div>}
          </div>
          <div style={{ width: 64 }} />
        </div>
      </div>

      <div className="relative h-[calc(100vh-220px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-160px)]">
        <div id="panorama" ref={containerRef} style={{ width: '100%', height: '100%' }} />

        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            pointerEvents: isTransitioning ? 'auto' : 'none',
            opacity: isTransitioning ? 0.95 : 0,
            transition: 'opacity 350ms ease'
          }}
        >
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white" />
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 sm:left-4 sm:transform-none z-20">
          <div className="bg-black bg-opacity-60 rounded-lg p-3 flex gap-2 items-center">
            <button disabled={isTransitioning} onClick={zoomIn} className="text-white px-2 py-1 rounded bg-gray-700">+</button>
            <button disabled={isTransitioning} onClick={zoomOut} className="text-white px-2 py-1 rounded bg-gray-700">−</button>
            <button disabled={isTransitioning} onClick={rotateLeft} className="text-white px-2 py-1 rounded bg-gray-700 hidden sm:inline-flex">⟲</button>
            <button disabled={isTransitioning} onClick={rotateRight} className="text-white px-2 py-1 rounded bg-gray-700 hidden sm:inline-flex">⟳</button>
            <button disabled={isTransitioning} onClick={resetView} className="text-white px-2 py-1 rounded bg-gray-700">Reset</button>
            <button disabled={isTransitioning} onClick={toggleFullscreen} className="text-white px-2 py-1 rounded bg-gray-700">⤢</button>
            <button disabled={isTransitioning} onClick={toggleMute} className="text-white px-2 py-1 rounded bg-gray-700">
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button disabled={isTransitioning} onClick={toggleInfo} className="text-white px-3 py-1 rounded bg-blue-600">
              {isInfoVisible ? 'Infos' : 'Afficher'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white py-3 px-3 sm:px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto">
          {sceneList.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => loadScene(s.id)}
              disabled={isTransitioning}
              className={`flex flex-col flex-shrink-0 items-center text-center p-1 rounded ${s.id === currentSceneId ? 'ring-2 ring-blue-500' : ''}`}
            >
              <img
                src={s.thumb}
                alt={s.title}
                className="w-24 h-14 sm:w-32 sm:h-20 md:w-40 md:h-24 object-cover rounded"
                style={{ objectFit: 'cover' }}
              />
              <div className="text-xs sm:text-sm text-gray-700 mt-1">{s.room}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">#{idx + 1}</div>
            </button>
          ))}
          {sceneList.length === 0 && (
            <div className="text-red-600">Aucune image panoramique disponible. Placez vos fichiers dans public/panoramas et mettez les chemins dans src/data/musee1.json.</div>
          )}
        </div>
      </div>

      {isInfoVisible && currentMeta && (
        <div className="fixed left-0 right-0 bottom-0 sm:bottom-28 sm:right-4 sm:left-auto sm:max-w-sm sm:rounded-lg bg-white bg-opacity-95 p-3 z-30">
          <div className="max-w-7xl mx-auto sm:mx-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{currentMeta.room}</h3>
            {currentMeta.floor && <p className="text-gray-600 mb-1">Étage {currentMeta.floor}</p>}
            {currentMeta.description && <p className="text-sm text-gray-600 mt-1">{currentMeta.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}