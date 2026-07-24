'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { MediaAsset, filterMediaAssets } from '@eldritch/domain';

export default function GalleryPage() {
  const { activeProject } = useApp();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Lightbox Modal (UC-270)
  const [activeLightboxAsset, setActiveLightboxAsset] = useState<MediaAsset | null>(null);

  // Upload Modal (UC-270, UC-273)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<MediaAsset['category']>('general');
  const [uploadEntityName, setUploadEntityName] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  // Load Assets
  const loadAssets = async () => {
    if (!activeProject) return;
    const list = await db.mediaAssets.where('projectId').equals(activeProject.id).toArray();
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAssets(list);
  };

  useEffect(() => {
    loadAssets();
  }, [activeProject]);

  // Handle Asset Upload (UC-270, UC-273)
  const handleUploadAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim() || !activeProject) return;

    if (uploadFile.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande! Limite de 10MB.');
      return;
    }

    // Convert file to Base64 (DataURL)
    const base64Url = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(uploadFile);
    });

    const tagsArray = uploadTags.split(',').map(t => t.trim()).filter(Boolean);

    const newAsset: MediaAsset = {
      id: `asset_${Date.now()}`,
      projectId: activeProject.id,
      title: uploadTitle.trim(),
      url: base64Url,
      category: uploadCategory,
      tags: tagsArray,
      entityName: uploadEntityName.trim() || undefined,
      fileSizeBytes: uploadFile.size,
      createdAt: new Date().toISOString()
    };

    await db.mediaAssets.put(newAsset);
    setUploadTitle('');
    setUploadEntityName('');
    setUploadTags('');
    setUploadFile(null);
    setShowUploadModal(false);
    await loadAssets();
    setSuccess(`Imagem "${newAsset.title}" adicionada à galeria!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Delete Asset (UC-272)
  const handleDeleteAsset = async (assetId: string, title: string) => {
    if (!confirm(`Deseja realmente excluir a imagem "${title}" da galeria?`)) return;

    await db.mediaAssets.delete(assetId);
    if (activeLightboxAsset?.id === assetId) {
      setActiveLightboxAsset(null);
    }
    await loadAssets();
    setSuccess(`Imagem "${title}" excluída da galeria!`);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Filter Assets (UC-271)
  const filteredAssets = filterMediaAssets(assets, searchQuery, categoryFilter);

  return (
    <div className="gallery-page-container" style={{ padding: '2rem', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🖼️ Galeria de Mídias & Ilustrações (UC-270, UC-271, UC-272)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Gerencie imagens do projeto, retratos de personagens, mapas e brasões.
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ➕ Adicionar Imagem à Galeria
        </button>
      </header>

      {/* Messages */}
      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
          {success}
        </div>
      )}

      {/* Filter and Search Bar (UC-271) */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px', alignItems: 'center' }}>
        <input 
          type="text"
          placeholder="🔎 Pesquisar por título, tag ou entidade (UC-271)..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />

        <select 
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          style={{ padding: '0.6rem 1rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        >
          <option value="ALL">Todas as Categorias</option>
          <option value="character">👤 Personagens</option>
          <option value="location">🏰 Locais</option>
          <option value="map">🗺️ Mapas</option>
          <option value="cover">🖼️ Capas</option>
          <option value="general">📂 Gerais</option>
        </select>
      </div>

      {/* Media Grid (UC-270) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {filteredAssets.map(asset => (
          <div 
            key={asset.id}
            onClick={() => setActiveLightboxAsset(asset)}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s'
            }}
          >
            <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: '#070a12' }}>
              <img src={asset.url} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '0.8rem' }}>
              <h4 style={{ margin: '0 0 0.3rem 0', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{asset.title}</h4>
              {asset.entityName && <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.78rem', color: '#93c5fd' }}>📌 Entidade: {asset.entityName}</p>}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.5 }}>{(asset.fileSizeBytes / 1024).toFixed(0)} KB</span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <a 
                    href={asset.url}
                    download={`midia_${asset.title.toLowerCase().replace(/\s+/g, '_')}.png`}
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}
                  >
                    📥 Baixar (UC-274)
                  </a>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset.id, asset.title); }}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    🗑️ Excluir (UC-272)
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            Nenhuma imagem encontrada na galeria.
          </div>
        )}
      </div>

      {/* Lightbox Modal (UC-270) */}
      {activeLightboxAsset && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.5rem', maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>{activeLightboxAsset.title}</h3>
              <button onClick={() => setActiveLightboxAsset(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>✖️</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.2rem', background: '#070a12', borderRadius: '8px', padding: '1rem' }}>
              <img src={activeLightboxAsset.url} alt={activeLightboxAsset.title} style={{ maxWidth: '100%', maxHeight: '480px', borderRadius: '6px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#9ca3af', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>Categoria: <strong style={{ color: 'white' }}>{activeLightboxAsset.category}</strong></div>
                {activeLightboxAsset.entityName && <div>Vinculado a: <strong style={{ color: '#93c5fd' }}>{activeLightboxAsset.entityName}</strong></div>}
                <div>Tamanho: <strong style={{ color: 'white' }}>{(activeLightboxAsset.fileSizeBytes / 1024).toFixed(1)} KB</strong></div>
              </div>

              <a 
                href={activeLightboxAsset.url} 
                download={`midia_${activeLightboxAsset.title.toLowerCase().replace(/\s+/g, '_')}.png`}
                style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}
              >
                📥 Baixar Imagem (UC-274)
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload (UC-270) */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '1.8rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>➕ Enviar Imagem para a Galeria</h3>
            <form onSubmit={handleUploadAsset}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Título da Imagem:</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Retrato de Kael, Escudo de Família..."
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Arquivo de Imagem:</label>
                <input 
                  type="file"
                  required
                  accept="image/*"
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Categoria:</label>
                <select 
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value as any)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                >
                  <option value="general">📂 Geral</option>
                  <option value="character">👤 Personagem</option>
                  <option value="location">🏰 Localização</option>
                  <option value="map">🗺️ Mapa</option>
                  <option value="cover">🖼️ Capa</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Entidade Vinculada (Opcional):</label>
                <input 
                  type="text"
                  placeholder="Ex: Kael, Winterfell..."
                  value={uploadEntityName}
                  onChange={e => setUploadEntityName(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem' }}>Tags (separadas por vírgula):</label>
                <input 
                  type="text"
                  placeholder="Ex: brasao, oficial, conceito"
                  value={uploadTags}
                  onChange={e => setUploadTags(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: 'transparent', border: 'none', color: '#9ca3af', padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Enviar para Galeria</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
