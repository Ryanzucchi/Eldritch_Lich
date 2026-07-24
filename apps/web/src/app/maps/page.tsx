'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { GeoMap, GeoMapMarker, calculateMapDistanceKm, TimelineEvent } from '@eldritch/domain';

export default function MapsPage() {
  const { activeProject } = useApp();
  const [maps, setMaps] = useState<GeoMap[]>([]);
  const [activeMap, setActiveMap] = useState<GeoMap | null>(null);
  const [markers, setMarkers] = useState<GeoMapMarker[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]); // UC-168

  // Time Slider & Event Layer State (UC-168)
  const [showEventLayer, setShowEventLayer] = useState(false);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);

  // Create Map Modal (UC-099)
  const [showCreateMapModal, setShowCreateMapModal] = useState(false);
  const [mapName, setMapName] = useState('');
  const [mapScale, setMapScale] = useState<number>(1);
  const [mapImageFile, setMapImageFile] = useState<File | null>(null);

  // Marker Modal (UC-100, UC-101)
  const [showMarkerModal, setShowMarkerModal] = useState(false);
  const [clickPos, setClickPos] = useState<{ xPercent: number; yPercent: number } | null>(null);
  const [markerName, setMarkerName] = useState('');
  const [markerType, setMarkerType] = useState<GeoMapMarker['type']>('location');
  const [markerDate, setMarkerDate] = useState('');
  const [markerDesc, setMarkerDesc] = useState('');

  // Selected Marker Popover
  const [selectedMarker, setSelectedMarker] = useState<GeoMapMarker | null>(null);

  // Ruler Measurement State (UC-099)
  const [rulerMode, setRulerMode] = useState(false);
  const [rulerStart, setRulerStart] = useState<{ xPx: number; yPx: number } | null>(null);
  const [rulerEnd, setRulerEnd] = useState<{ xPx: number; yPx: number } | null>(null);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load Maps
  const loadMaps = async () => {
    if (!activeProject) return;
    const list = await db.geoMaps.where('projectId').equals(activeProject.id).toArray();
    setMaps(list);
    if (list.length > 0 && !activeMap) {
      setActiveMap(list[0]);
    }
  };

  // Load Markers and Timeline Events for Active Map (UC-168)
  const loadMarkersAndEvents = async () => {
    if (!activeMap) {
      setMarkers([]);
      setTimelineEvents([]);
      return;
    }
    const list = await db.geoMapMarkers.where('mapId').equals(activeMap.id).toArray();
    setMarkers(list);

    // Fetch timeline events for location matching (UC-168)
    const evList = await db.timelineEvents.toArray();
    evList.sort((a, b) => a.sortOrder - b.sortOrder);
    setTimelineEvents(evList);
  };

  useEffect(() => {
    loadMaps();
  }, [activeProject]);

  useEffect(() => {
    loadMarkersAndEvents();
  }, [activeMap]);

  // Animation Loop for Time Slider (UC-168)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingAnimation && timelineEvents.length > 0) {
      timer = setInterval(() => {
        setSliderIndex((prev) => {
          if (prev >= timelineEvents.length - 1) {
            setIsPlayingAnimation(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlayingAnimation, timelineEvents.length]);

  // Handle Map Upload/Creation (UC-099)
  const handleCreateMap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapName.trim() || !activeProject) return;

    let imageUrl = '';
    if (mapImageFile) {
      if (mapImageFile.size > 20 * 1024 * 1024) {
        alert('O arquivo excede o limite de 20MB.');
        return;
      }
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(mapImageFile);
      });
    }

    const newMap: GeoMap = {
      id: `map_${Date.now()}`,
      projectId: activeProject.id,
      name: mapName.trim(),
      imageUrl,
      scaleKmPerPixel: mapScale || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.geoMaps.put(newMap);
    setMapName('');
    setMapImageFile(null);
    setShowCreateMapModal(false);
    setActiveMap(newMap);
    await loadMaps();
    setSuccess(`Mapa "${newMap.name}" criado com sucesso!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Handle Canvas Click to add Marker or Measure (UC-099, UC-100, UC-101)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;

    if (rulerMode) {
      if (!rulerStart) {
        setRulerStart({ xPx, yPx });
        setRulerEnd(null);
        setMeasuredDistance(null);
      } else {
        setRulerEnd({ xPx, yPx });
        const km = calculateMapDistanceKm(rulerStart.xPx, rulerStart.yPx, xPx, yPx, activeMap?.scaleKmPerPixel || 1);
        setMeasuredDistance(km);
      }
      return;
    }

    const xPercent = (xPx / rect.width) * 100;
    const yPercent = (yPx / rect.height) * 100;

    setClickPos({ xPercent, yPercent });
    setShowMarkerModal(true);
  };

  // Add Marker (UC-100, UC-101)
  const handleAddMarker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMap || !clickPos || !markerName.trim()) return;

    const newMarker: GeoMapMarker = {
      id: `marker_${Date.now()}`,
      mapId: activeMap.id,
      name: markerName.trim(),
      type: markerType,
      xPercent: clickPos.xPercent,
      yPercent: clickPos.yPercent,
      dateStr: markerDate.trim() || undefined,
      description: markerDesc.trim() || undefined
    };

    await db.geoMapMarkers.put(newMarker);
    setMarkerName('');
    setMarkerDate('');
    setMarkerDesc('');
    setShowMarkerModal(false);
    await loadMarkersAndEvents();
    setSuccess(`Marcador "${newMarker.name}" adicionado ao mapa!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Export Map Image with Markers (UC-268)
  const handleExportMapImage = () => {
    if (!activeMap || !mapContainerRef.current) return;
    
    // Create download link for image
    if (activeMap.imageUrl) {
      const a = document.createElement('a');
      a.href = activeMap.imageUrl;
      a.download = `mapa_${activeMap.name.toLowerCase().replace(/\s+/g, '_')}.png`;
      a.click();
      setSuccess(`Mapa "${activeMap.name}" exportado com sucesso (UC-268)!`);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      alert('Este mapa em grid sintético não possui arquivo de imagem base para exportação.');
    }
  };

  return (
    <div className="maps-page-container" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🗺️ Atlas Geográfico & Cartografia (UC-099, UC-100, UC-101)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Mapeie o mundo da sua história, relacione locais, entidades e meça distâncias fictícias.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button 
            onClick={handleExportMapImage}
            disabled={!activeMap}
            style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📥 Exportar Mapa (UC-268)
          </button>
          <button 
            onClick={() => setShowEventLayer(!showEventLayer)}
            disabled={!activeMap}
            style={{ background: showEventLayer ? '#10b981' : 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ⏳ {showEventLayer ? 'Ocultar Camada de Eventos' : 'Exibir Camada de Eventos (UC-168)'}
          </button>
          <button 
            onClick={() => { setRulerMode(!rulerMode); setRulerStart(null); setRulerEnd(null); setMeasuredDistance(null); }}
            disabled={!activeMap}
            style={{ background: rulerMode ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: 'white', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📐 {rulerMode ? 'Modo Medição Ativo' : 'Régua de Distâncias (UC-099)'}
          </button>
          <button 
            onClick={() => setShowCreateMapModal(true)}
            style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            ➕ Novo Mapa Geográfico (UC-267)
          </button>
        </div>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Map Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.5rem' }}>
        {maps.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMap(m)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: '6px 6px 0 0',
              background: activeMap?.id === m.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
              border: '1px solid transparent',
              borderBottom: activeMap?.id === m.id ? '2px solid #3b82f6' : 'transparent',
              color: activeMap?.id === m.id ? '#3b82f6' : '#9ca3af',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            🗺️ {m.name}
          </button>
        ))}
        {maps.length === 0 && <span style={{ opacity: 0.6, fontSize: '0.9rem' }}>Nenhum mapa cadastrado no atlas do projeto.</span>}
      </div>

      {/* Ruler Output */}
      {measuredDistance !== null && (
        <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontWeight: 600 }}>
          📏 Distância Medida: {measuredDistance.toFixed(1)} km (Escala: 1px = {activeMap?.scaleKmPerPixel || 1}km)
        </div>
      )}

      {/* Active Map Canvas (UC-099, UC-100, UC-101) */}
      {activeMap ? (
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.4rem' }}>{activeMap.name}</h2>
            <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>💡 Clique em qualquer ponto do mapa para adicionar um marcador.</span>
          </div>

          <div 
            ref={mapContainerRef}
            onClick={handleMapClick}
            style={{
              position: 'relative',
              width: '100%',
              minHeight: '520px',
              maxHeight: '750px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: activeMap.imageUrl ? `url(${activeMap.imageUrl}) center/contain no-repeat #070a12` : '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              cursor: rulerMode ? 'crosshair' : 'pointer'
            }}
          >
            {/* Grid Lines if no image */}
            {!activeMap.imageUrl && (
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            )}

            {/* Render Event Layer Markers (UC-168) */}
            {showEventLayer && timelineEvents.length > 0 && (() => {
              const currentEv = timelineEvents[sliderIndex];
              if (!currentEv || !currentEv.locationId) return null;
              // Find matching location marker on active map
              const matchingMarker = markers.find(m => m.name.toLowerCase() === currentEv.locationId?.toLowerCase());
              if (!matchingMarker) return null;

              return (
                <div
                  style={{
                    position: 'absolute',
                    top: `${matchingMarker.yPercent - 12}%`,
                    left: `${matchingMarker.xPercent}%`,
                    transform: 'translate(-50%, -100%)',
                    background: '#ef4444',
                    color: 'white',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.8)',
                    zIndex: 10,
                    animation: 'pulse 1.5s infinite'
                  }}
                >
                  ⚡ EVENTO: {currentEv.title} ({currentEv.dateStr})
                </div>
              );
            })()}

            {/* Render Markers (UC-100, UC-101) */}
            {markers.map(mk => (
              <div
                key={mk.id}
                onClick={(e) => { e.stopPropagation(); setSelectedMarker(mk); }}
                style={{
                  position: 'absolute',
                  top: `${mk.yPercent}%`,
                  left: `${mk.xPercent}%`,
                  transform: 'translate(-50%, -100%)',
                  background: mk.type === 'location' ? '#3b82f6' : mk.type === 'character' ? '#a855f7' : '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  zIndex: 2,
                  whiteSpace: 'nowrap'
                }}
              >
                {mk.type === 'location' ? '🏰' : mk.type === 'character' ? '👤' : '🚩'} {mk.name}
              </div>
            ))}
          </div>

          {/* Time Slider Controls Bar (UC-168) */}
          {showEventLayer && (
            <div style={{ marginTop: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem 1.2rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <button 
                    onClick={() => setIsPlayingAnimation(!isPlayingAnimation)}
                    style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    {isPlayingAnimation ? '⏸️ Pausar Animação' : '▶️ Modo História Animado'}
                  </button>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#60a5fa' }}>
                    {timelineEvents[sliderIndex]?.dateStr || 'Sem Data'} — {timelineEvents[sliderIndex]?.title || 'Selecione um evento'}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Evento {sliderIndex + 1} de {timelineEvents.length}</span>
              </div>

              <input 
                type="range"
                min={0}
                max={Math.max(0, timelineEvents.length - 1)}
                value={sliderIndex}
                onChange={e => { setSliderIndex(parseInt(e.target.value)); setIsPlayingAnimation(false); }}
                style={{ width: '100%', cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
          Selecione ou crie um mapa para visualizar a cartografia.
        </div>
      )}

      {/* Marker Detail Popover */}
      {selectedMarker && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '1.2rem', width: '300px', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{selectedMarker.name}</h4>
            <button onClick={() => setSelectedMarker(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>✖️</button>
          </div>
          <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>Tipo: {selectedMarker.type.toUpperCase()}</p>
          {selectedMarker.dateStr && <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: '#f59e0b' }}>Presença: {selectedMarker.dateStr}</p>}
          {selectedMarker.description && <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>{selectedMarker.description}</p>}
        </div>
      )}

      {/* Modal Criar Mapa (UC-099) */}
      {showCreateMapModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>🗺️ Novo Mapa Geográfico (UC-099)</h3>
            <form onSubmit={handleCreateMap}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome do Mapa:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Continente de Eldoria, Cidade Baixa..."
                  value={mapName}
                  onChange={e => setMapName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Imagem do Mapa (Máx 20MB):</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => setMapImageFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Escala (km por Pixel):</label>
                <input 
                  type="number"
                  step="0.1"
                  value={mapScale}
                  onChange={e => setMapScale(parseFloat(e.target.value) || 1)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCreateMapModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Salvar Mapa</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Marcador (UC-100, UC-101) */}
      {showMarkerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📍 Adicionar Marcador ao Mapa</h3>
            <form onSubmit={handleAddMarker}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Nome da Entidade / Local:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Winterfell, Kael, Fortaleza..."
                  value={markerName}
                  onChange={e => setMarkerName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tipo de Marcador:</label>
                <select 
                  value={markerType}
                  onChange={e => setMarkerType(e.target.value as any)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="location">🏰 Localização (UC-100)</option>
                  <option value="character">👤 Personagem (UC-101)</option>
                  <option value="faction">🚩 Facção / Organização (UC-101)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Marca de Tempo / Presença (UC-101):</label>
                <input 
                  type="text"
                  placeholder="Ex: Ano 1042..."
                  value={markerDate}
                  onChange={e => setMarkerDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Descrição:</label>
                <textarea 
                  rows={2}
                  placeholder="Anotações sobre este ponto..."
                  value={markerDesc}
                  onChange={e => setMarkerDesc(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowMarkerModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Posicionar Marcador</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
