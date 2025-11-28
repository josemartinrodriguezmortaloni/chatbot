import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { EmbeddingsService } from './embeddings.service';
import { VectorSearchService } from './vector-search.service';

@Module({
  providers: [RagService, EmbeddingsService, VectorSearchService]
})
export class RagModule {}
