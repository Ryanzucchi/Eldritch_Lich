'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { groupAndAnalyzeLexicon, groupSimilarDocumentsSemantic, desambiguateWordContext, generateContextualWordLinks, LexicalFrequency, SemanticTextGroup, WordContextDefinition, ContextualWordLink } from '@eldritch/domain';

export default function SemanticsPage() {
  const { activeProject } = useApp();

  const [inputText, setInputText] = useState(
    'O cavaleiro desembainhou sua espada prateada. Ele foi até o banco da praça para se sentar e pensar na coroa do rei e na monarquia.'
  );

  const [lexicon, setLexicon] = useState<LexicalFrequency[]>([]);
  const [activeTab, setActiveTab] = useState<'LEXICAL' | 'CLUSTERING' | 'CONTEXT'>('LEXICAL');

  // Word context desambiguation states (UC-030)
  const [selectedWord, setSelectedWord] = useState('banco');
  const [contextResult, setContextResult] = useState<WordContextDefinition | null>(null);

  // Document Clustering States (UC-021)
  const [documents, setDocuments] = useState([
    { id: 'doc1', title: 'A Magia do Elemento Fogo', content: 'Fórmula de magia e feitiços arcanos usando chamas de fogo.' },
    { id: 'doc2', title: 'O Livro das Encantações', content: 'Feitiços e encantamentos mágicos medievais perdidos.' },
    { id: 'doc3', title: 'A Revolução Industrial', content: 'O surgimento das máquinas a vapor, ferrovias e indústrias modernas.' },
    { id: 'doc4', title: 'Motores a Vapor', content: 'Manual técnico de engenharia de máquinas térmicas industriais.' },
    { id: 'doc5', title: 'Táticas de Batalha', content: 'Estratégias de exércitos em guerras e cercos históricos.' }
  ]);
  const [clusteredGroups, setClusteredGroups] = useState<SemanticTextGroup[]>([]);
  const [clusteringSensitivity, setClusteringSensitivity] = useState(0.5);

  // Contextual Links (UC-033)
  const [contextLinks, setContextLinks] = useState<ContextualWordLink[]>([]);

  // Análise Léxica (UC-020)
  const handleAnalyzeLexicon = () => {
    const list = groupAndAnalyzeLexicon(inputText);
    setLexicon(list);

    // Links Contextuais Automáticos
    const lexiconDb = [
      { word: 'Monarquia', documentTitle: 'Wiki: A Coroa Real', docId: 'wiki_1' },
      { word: 'Cavaleiros', documentTitle: 'Wiki: Guilda dos Cavaleiros', docId: 'wiki_2' },
      { word: 'Finanças', documentTitle: 'Wiki: Banco Central', docId: 'wiki_3' }
    ];
    const links = generateContextualWordLinks(inputText, lexiconDb);
    setContextLinks(links);
  };

  // Desambiguação (UC-030)
  const handleDesambiguate = (word: string) => {
    setSelectedWord(word);
    const res = desambiguateWordContext(word, inputText);
    setContextResult(res);
  };

  // Clustering (UC-021)
  const handleRunClustering = () => {
    const groups = groupSimilarDocumentsSemantic(documents, clusteringSensitivity);
    setClusteredGroups(groups);
  };

  useEffect(() => {
    handleAnalyzeLexicon();
    handleDesambiguate(selectedWord);
  }, [inputText, selectedWord]);

  useEffect(() => {
    handleRunClustering();
  }, [clusteringSensitivity]);

  return (
    <div className="semantics-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🔮 Inteligência Semântica & Análise Léxica (UC-020, UC-021, UC-030, UC-033)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Classificação contextual de palavras, clustering semântico de documentos, nuvem léxica de frequências e links lógicos automáticos.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveTab('LEXICAL')}
            style={{ background: activeTab === 'LEXICAL' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📊 Nuvem Léxica (UC-020)
          </button>
          <button 
            onClick={() => setActiveTab('CLUSTERING')}
            style={{ background: activeTab === 'CLUSTERING' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            📂 Clustering Temático (UC-021)
          </button>
          <button 
            onClick={() => setActiveTab('CONTEXT')}
            style={{ background: activeTab === 'CONTEXT' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            🔍 Sentido & Links Contextuais (UC-030/033)
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>📝 Texto de Entrada</h3>
            <textarea 
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', lineHeight: '1.5' }}
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'LEXICAL' && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.2rem 0' }}>📊 Nuvem Léxica e Frequência de Termos Agrupados (UC-020)</h3>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
                {lexicon.map((lex, idx) => {
                  const size = Math.min(2.2, 0.9 + (lex.count * 0.35));
                  return (
                    <span 
                      key={idx} 
                      style={{ fontSize: `${size}rem`, fontWeight: lex.count > 1 ? 700 : 400, color: lex.count > 1 ? '#60a5fa' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
                      title={`Termo raiz: ${lex.term} (${lex.count}x). Variações: ${lex.variations.join(', ')}`}
                    >
                      {lex.term}
                    </span>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {lexicon.slice(0, 5).map((lex, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                    <span>Termo Raiz: <strong>{lex.term}</strong> <span style={{ opacity: 0.5, fontSize: '0.8rem' }}>({lex.variations.join(', ')})</span></span>
                    <strong>{lex.count} ocorrências</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'CLUSTERING' && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>📂 Sugestões de Agrupamento de Textos Semelhantes (UC-021)</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Rigidez:</span>
                  <input 
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={clusteringSensitivity}
                    onChange={e => setClusteringSensitivity(parseFloat(e.target.value))}
                  />
                  <span>{clusteringSensitivity}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {clusteredGroups.map(group => (
                  <div key={group.groupId} style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #10b981', padding: '1rem', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#34d399' }}>{group.themeTitle}</strong>
                      <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Confiança Semântica: {Math.round(group.confidence * 100)}%</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {group.fileIds.map(fid => {
                        const file = documents.find(d => d.id === fid);
                        return (
                          <span key={fid} style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            📄 {file?.title}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'CONTEXT' && (
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <h3 style={{ margin: 0 }}> desambiguação e Links Contextuais Automáticos (UC-030, UC-033)</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => handleDesambiguate('banco')}
                  style={{ background: selectedWord === 'banco' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Verificar Palavra: "banco"
                </button>
                <button 
                  onClick={() => handleDesambiguate('coroa')}
                  style={{ background: selectedWord === 'coroa' ? '#3b82f6' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Verificar Palavra: "coroa"
                </button>
              </div>

              {contextResult && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa' }}>Significado Contextual (UC-030)</h4>
                  <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.9rem', lineHeight: '1.5' }}>{contextResult.contextDefinition}</p>
                  <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Sinônimos Sugeridos: {contextResult.synonyms.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Area: Contextual Connections Links Grafo */}
        <div>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>🔗 Vínculos Contextuais do Grafo (UC-033)</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {contextLinks.map((link, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                    <span style={{ color: '#f59e0b' }}>{link.sourceWord}</span>
                    <span>➔ {link.targetWord}</span>
                  </div>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.78rem', opacity: 0.7 }}>
                    <strong>Relação:</strong> {link.contextReason}
                  </p>
                </div>
              ))}

              {contextLinks.length === 0 && (
                <div style={{ opacity: 0.5, textAlign: 'center', padding: '2rem 0' }}>
                  Nenhum link contextual identificado na frase digitada.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
