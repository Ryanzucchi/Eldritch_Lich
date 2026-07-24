"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMBIENT_LIBRARY = void 0;
exports.generateChapterPlaylist = generateChapterPlaylist;
exports.AMBIENT_LIBRARY = [
    {
        id: 'tr-1',
        title: 'Eldritch Shadows',
        artist: 'Lich Ensemble',
        mood: 'tensao',
        durationSeconds: 180,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=dark-ambient-112328.mp3'
    },
    {
        id: 'tr-2',
        title: 'Whispering Winds',
        artist: 'Mystic Echoes',
        mood: 'misterio',
        durationSeconds: 210,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a815a3.mp3?filename=mysterious-celestial-10023.mp3'
    },
    {
        id: 'tr-3',
        title: 'Sorrowful Rain',
        artist: 'Piano Nocturne',
        mood: 'melancolia',
        durationSeconds: 195,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_9b65e9036c.mp3?filename=sad-piano-ambient-8473.mp3'
    },
    {
        id: 'tr-4',
        title: 'March of the Titans',
        artist: 'Orchestral Doom',
        mood: 'epico',
        durationSeconds: 240,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939a3a9df.mp3?filename=epic-battle-124844.mp3'
    },
    {
        id: 'tr-5',
        title: 'Serene Sanctuary',
        artist: 'Acoustic Peace',
        mood: 'tranquilo',
        durationSeconds: 220,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-light-nature-13811.mp3'
    }
];
/**
 * Analisa o texto do capítulo/manuscrito para identificar o humor predominante
 * e gerar uma playlist ordenada com transições de crossfade.
 */
function generateChapterPlaylist(manuscriptId, htmlOrText) {
    const plainText = htmlOrText.replace(/<[^>]*>/g, '').toLowerCase();
    if (!plainText.trim()) {
        throw new Error('Capítulo vazio. Digite texto antes de gerar uma playlist por IA.');
    }
    // Keywords dictionary per mood
    const moodScores = {
        tensao: 0,
        misterio: 0,
        melancolia: 0,
        epico: 0,
        tranquilo: 0,
        action: 0
    };
    const keywords = {
        tensao: ['medo', 'sombra', 'sangue', 'perigo', 'terror', 'morte', 'monstro', 'escuridão', 'gritou'],
        misterio: ['segredo', 'enigma', 'estranho', 'suspeito', 'oculto', 'silêncio', 'sussurro', 'névoa'],
        melancolia: ['triste', 'lágrima', 'saudade', 'dor', 'solidão', 'luto', 'choro', 'perda', 'vazio'],
        epico: ['glória', 'batalha', 'vitória', 'coragem', 'espada', 'rei', 'império', 'exército', 'poder'],
        tranquilo: ['paz', 'sol', 'jardim', 'riso', 'amigo', 'brisa', 'calma', 'doce', 'descanso'],
        action: ['luta', 'corrida', 'fogo', 'golpe', 'explosão', 'ataque', 'defesa', 'veloz', 'choque']
    };
    Object.keys(keywords).forEach(mood => {
        keywords[mood].forEach(word => {
            const matches = plainText.split(word).length - 1;
            moodScores[mood] += matches;
        });
    });
    // Find mood with max score, fallback to misterio
    let dominantMood = 'misterio';
    let maxScore = -1;
    Object.keys(moodScores).forEach(mood => {
        if (moodScores[mood] > maxScore) {
            maxScore = moodScores[mood];
            dominantMood = mood;
        }
    });
    // Build playlist with dominant mood track first, then related tracks
    const primaryTrack = exports.AMBIENT_LIBRARY.find(t => t.mood === dominantMood) || exports.AMBIENT_LIBRARY[1];
    const otherTracks = exports.AMBIENT_LIBRARY.filter(t => t.id !== primaryTrack.id);
    return {
        manuscriptId,
        detectedMood: dominantMood,
        tracks: [primaryTrack, ...otherTracks],
        crossfadeSeconds: 2,
        generatedAt: new Date().toISOString()
    };
}
