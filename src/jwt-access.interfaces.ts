import { ModuleMetadata, Type } from '@nestjs/common';
import { StrategyOptions } from 'passport-jwt';

export interface StrategyOptionsFactory {
  createJwtStrategyOptions: () => Promise<StrategyOptions> | StrategyOptions;
}

export interface ModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<StrategyOptionsFactory>;
  useClass?: Type<StrategyOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<StrategyOptions> | StrategyOptions;
  inject?: any[];
}
