export interface Manuscript {
  id: string;
  title: string;
  content: string;
  status: 'RASCUNHO' | 'REVISAO' | 'FINALIZADO';
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}
