import { Injectable } from '@nestjs/common';
import { LongTermMemoryStrategy } from './long-term-memory.strategy';
import { IMemoryStrategy } from './memory-stategy.interface';
import { ShortTermMemoryStrategy } from './short-term-memory.strategy';

export type MemoryType = 'short-term' | 'long-term';

@Injectable()
export class MemoryFactory {
  constructor(
    private readonly shortTermMemory: ShortTermMemoryStrategy,
    private readonly longTermMemory: LongTermMemoryStrategy,
  ) {}

  createStrategy(memoryType: MemoryType): IMemoryStrategy {
    switch (memoryType) {
      case 'short-term':
        return this.shortTermMemory;
      case 'long-term':
        return this.longTermMemory;
      default: {
        // Este caso nunca debería ocurrir debido al tipo MemoryType
        const exhaustiveCheck: never = memoryType;
        throw new Error(`Unsupported memory type: ${String(exhaustiveCheck)}`);
      }
    }
  }
}
