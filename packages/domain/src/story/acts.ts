export interface StoryAct {
  id: string;
  projectId: string;
  name: string; // e.g. "Ato I: Apresentação"
  description?: string;
  sceneIds: string[];
  sortOrder: number;
}

export interface HeroJourneyStage {
  id: string;
  projectId: string;
  characterName: string;
  stageName: string; // e.g. "Chamado à Aventura", "A Provação Suprema"
  sceneId?: string;
  notes?: string;
  stepNumber: number;
}

export const CLASSIC_HERO_JOURNEY_STAGES = [
  '1. Mundo Comum',
  '2. Chamado à Aventura',
  '3. Recusa do Chamado',
  '4. Encontro com o Mentor',
  '5. Travessia do Primeiro Limiar',
  '6. Testes, Aliados e Inimigos',
  '7. Aproximação da Caverna Oculta',
  '8. Provação Suprema',
  '9. Recompensa (A Espada)',
  '10. O Caminho de Volta',
  '11. Ressurreição',
  '12. Retorno com o Elixir'
];

export const DAN_HARMON_STORY_CIRCLE = [
  '1. Um personagem na sua zona de conforto (YOU)',
  '2. Mas ele deseja algo (NEED)',
  '3. Ele entra em uma situação não familiar (GO)',
  '4. Adapta-se a ela (SEARCH)',
  '5. Consegue o que queria (FIND)',
  '6. Paga um preço alto por isso (TAKE)',
  '7. Retorna à situação familiar (RETURN)',
  '8. Mudou/transformou-se (CHANGE)'
];
