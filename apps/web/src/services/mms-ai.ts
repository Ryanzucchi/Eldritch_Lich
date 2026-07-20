let extractorInstance: any = null;
let nerInstance: any = null;
let pipelineFn: any = null;

export interface ProgressPayload {
  status: string;
  progress?: number;
  loaded?: number;
  total?: number;
  file?: string;
}

type ProgressCallback = (payload: ProgressPayload) => void;

/**
 * Dynamically imports Hugging Face Transformers.js pipeline function.
 */
async function getPipelineFn() {
  if (!pipelineFn) {
    const module = await import('@huggingface/transformers');
    pipelineFn = module.pipeline;
  }
  return pipelineFn;
}

/**
 * Initializes and retrieves the multilingual-e5-small embedding pipeline.
 */
export async function getEmbeddingPipeline(onProgress?: ProgressCallback) {
  if (!extractorInstance) {
    const pipeline = await getPipelineFn();
    extractorInstance = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small', {
      progress_callback: (data: any) => {
        if (onProgress && data.status === 'progress') {
          onProgress({
            status: 'loading_embeddings',
            progress: data.progress,
            loaded: data.loaded,
            total: data.total,
            file: data.file
          });
        }
      }
    });
  }
  return extractorInstance;
}

/**
 * Initializes and retrieves the NER pipeline.
 */
export async function getNERPipeline(onProgress?: ProgressCallback) {
  if (!nerInstance) {
    const pipeline = await getPipelineFn();
    // Light-weight multilingual NER model suitable for browser environments
    nerInstance = await pipeline('token-classification', 'Xenova/bert-base-multilingual-cased-ner-xxl', {
      progress_callback: (data: any) => {
        if (onProgress && data.status === 'progress') {
          onProgress({
            status: 'loading_ner',
            progress: data.progress,
            loaded: data.loaded,
            total: data.total,
            file: data.file
          });
        }
      }
    });
  }
  return nerInstance;
}

/**
 * Computes embeddings vector using multilingual-e5-small.
 */
export async function computeE5Embedding(text: string, onProgress?: ProgressCallback): Promise<number[]> {
  const extractor = await getEmbeddingPipeline(onProgress);
  const prefixText = `query: ${text}`;
  const output = await extractor(prefixText, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

/**
 * Performs NER token classification using multilingual BERT NER model.
 */
export async function extractEntitiesWithNER(text: string, onProgress?: ProgressCallback): Promise<{ entity: string; word: string }[]> {
  const classifier = await getNERPipeline(onProgress);
  const result = await classifier(text);
  
  return result.map((item: any) => ({
    entity: item.entity,
    word: item.word
  }));
}
