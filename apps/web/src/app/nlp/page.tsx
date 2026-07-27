'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../db/schema';
import { detectTextLanguage, tokenizeAndValidateWords, segmentSentences, extractNamedEntities, suggestSubfolderGrouping, DetectedEntity, SubfolderSuggestion } from '@eldritch/domain';

export default function NlpDashboardPage() {
  const { activeProject } = useApp();

  const [inputText, setInputText] = useState(
    'O jovem guerreiro Arthur encontrou a lendária espada Excalibur na antiga cidade de Camelot. Ele pertencia à Ordem dos Cavaleiros da Távola Redonda.'
  );

  const [langCode, setLangCode] = useState<string>('pt');
  const [langConfidence, setLangConfidence] = useState<number>(1.0);
  const [sentences, setSentences] = useState<{ sentence: string; startIndex: number; endIndex: number }[]>([]);
  const [words, setWords] = useState<{ word: string; isRecognized: boolean; startIndex: number; endIndex: number }[]>([]);
  const [entities, setEntities] = useState<DetectedEntity[]>([]);
  
  // Dicionário customizado para testes (UC-016)
  const [customDict, setCustomDict] = useState<string[]>(['Arthur', 'Excalibur', 'Camelot', 'Cavaleiros', 'Távola']);
  const [newDictWord, setNewDictWord] = useState('');

  // Auto Subpastear (UC-019)
  const [dummyFiles, setDummyFiles] = useState<{ id: string; title: string; content: string }[]>([
    { id: '1', title: 'Ficha de Arthur', content: 'Ficha de personagem: Arthur é o rei de Camelot e lidera o clã.' },
    { id: '2', title: 'Ficha de Morgana', content: 'Ficha de personagem: Morgana é uma maga aliada.' },
    { id: '3', title: 'Capítulo 1', content: 'Capítulo inicial da saga. Arthur saca a espada na cena do lago.' },
    { id: '4', title: 'Capítulo 2', content: 'Capítulo seguinte. A guilda se reúne na távola redonda.' },
    { id: '5', title: 'Lore Camelot', content: 'Informações de lore e worldbuilding sobre o reino de Camelot.' }
  ]);
  const [subfolderSuggestions, setSubfolderSuggestions] = useState<SubfolderSuggestion[]>([]);

  // Executa o pipeline NLP (UC-015, UC-016, UC-017, UC-018)
  const handleAnalyzeText = () => {
    // 1. Idioma
    const lang = detectTextLanguage(inputText);
    setLangCode(lang.langCode);
    setLangConfidence(lang.confidence);

    // 2. Sentenças
    const sents = segmentSentences(inputText);
    setSentences(sents);

    // 3. Tokenizador de Palavras + Dicionário
    // Adiciona termos comuns em português no dicionário de teste
    const baseDict = ['o', 'jovem', 'guerreiro', 'encontrou', 'a', 'lendária', 'na', 'antiga', 'cidade', 'de', 'ele', 'pertencia', 'à', 'dos', 'da', 'redonda'];
    const mergedDict = [...baseDict, ...customDict];
    const tokens = tokenizeAndValidateWords(inputText, mergedDict);
    setWords(tokens);

    // 4. NER Entidades
    const known = customDict.map(name => {
      let type: DetectedEntity['type'] = 'PERSONAGEM';
      if (name === 'Camelot') type = 'LOCAL';
      if (name === 'Excalibur') type = 'OBJETO';
      if (name === 'Cavaleiros') type = 'ORGANIZACAO';
      return { name, type };
    });
    const extracted = extractNamedEntities(inputText, known);
    setEntities(extracted);
  };

  useEffect(() => {
    handleAnalyzeText();
  }, [inputText, customDict]);

  const handleAddWordToDict = () => {
    if (!newDictWord.trim()) return;
    setCustomDict([...customDict, newDictWord.trim()]);
    setNewDictWord('');
  };

  const handleRunSubpastear = () => {
    const sugs = suggestSubfolderGrouping(dummyFiles);
    setSubfolderSuggestions(sugs);
  };

  return (
    <div className="nlp-dashboard-container" style={{ padding: '2rem', color: '#f3f4f6', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🧠 Assistente IA & Pipeline NLP (UC-015 to UC-019)
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', opacity: 0.7 }}>
            Detecção multilingue de idiomas, segmentação de sentenças, corretores baseados em dicionário, NER e agrupador inteligente de pastas.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Text Input & Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>📝 Texto para Análise</h3>
            <textarea 
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1rem', lineHeight: '1.5' }}
            />

            {/* Language Banner (UC-015) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '0.8rem 1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <div>
                <span>Idioma Detectado: <strong>{langCode.toUpperCase()}</strong></span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6, marginLeft: '1rem' }}>Confiança: {Math.round(langConfidence * 100)}%</span>
              </div>
              <span style={{ fontSize: '0.78rem', background: '#3b82f6', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                AUTO DETECT (UC-015)
              </span>
            </div>
          </div>

          {/* Tokens and spellcheck preview (UC-016) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>🔍 Validação Gramatical de Palavras (UC-016)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', lineHeight: '2' }}>
              {words.map((w, idx) => (
                <span 
                  key={idx}
                  style={{
                    padding: '0.1rem 0.3rem',
                    borderRadius: '4px',
                    background: w.isRecognized ? 'transparent' : 'rgba(239, 68, 68, 0.15)',
                    borderBottom: w.isRecognized ? 'none' : '2px dashed #ef4444',
                    cursor: w.isRecognized ? 'default' : 'pointer'
                  }}
                  title={w.isRecognized ? 'Palavra Reconhecida' : 'Não cadastrada no dicionário'}
                  onClick={() => {
                    if (!w.isRecognized) {
                      setNewDictWord(w.word);
                    }
                  }}
                >
                  {w.word}
                </span>
              ))}
            </div>
          </div>

          {/* Sentences Boundary (UC-017) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>🔲 Segmentação de Sentenças (UC-017)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {sentences.map((s, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 700, marginRight: '0.5rem' }}>Frase {idx + 1}:</span>
                  {s.sentence}
                </div>
              ))}
            </div>
          </div>

          {/* Named Entities NER (UC-018) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem' }}>🏷️ Reconhecimento de Entidades Nomeadas (NER - UC-018)</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
              {entities.map(e => {
                const color = e.type === 'PERSONAGEM' ? '#60a5fa' : e.type === 'LOCAL' ? '#34d399' : e.type === 'OBJETO' ? '#fbbf24' : '#c084fc';
                return (
                  <div key={e.id} style={{ border: `1px solid ${color}`, color, padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                    <strong>{e.name}</strong> <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>({e.type})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dictionary Customizer & Auto Subpastear */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Dictionary config (UC-016) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>📖 Dicionário de Projeto</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text"
                placeholder="Nova palavra..."
                value={newDictWord}
                onChange={e => setNewDictWord(e.target.value)}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}
              />
              <button 
                onClick={handleAddWordToDict}
                style={{ background: '#10b981', border: 'none', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
              >
                Adicionar
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '150px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '0.6rem', borderRadius: '6px' }}>
              {customDict.map((w, idx) => (
                <span key={idx} style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {w}
                </span>
              ))}
            </div>
          </div>

          {/* Auto Subpastear (UC-019) */}
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>📁 Auto Subpastear (UC-019)</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '1rem' }}>
              Organize arquivos temáticos soltos em novas subpastas temáticas automaticamente.
            </p>

            <button 
              onClick={handleRunSubpastear}
              style={{ width: '100%', background: '#3b82f6', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1rem' }}
            >
              📂 Agrupar Arquivos Soltos
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {subfolderSuggestions.map((sug, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.8rem', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                  <strong style={{ fontSize: '0.85rem', display: 'block', color: '#60a5fa' }}>Pasta: {sug.folderName}</strong>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5, display: 'block', margin: '0.2rem 0' }}>Razão: {sug.reason}</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.4rem' }}>
                    {sug.fileIds.map(fid => (
                      <span key={fid} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>
                        Doc ID: {fid}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
