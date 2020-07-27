import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StrategyOptions } from 'passport-jwt';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JWT_STRATEGY_OPTIONS } from './jwt-access.constants';
import { StrategyOptionsFactory, ModuleAsyncOptions } from './jwt-access.interfaces';

@Module({
  imports: [PassportModule],
  providers: [JwtAccessStrategy],
  exports: [],
})
export class JwtAccessModule {
  static forRoot(options: StrategyOptions): DynamicModule {
    const jwtStrategyOptionsProvider: Provider = {
      provide: JWT_STRATEGY_OPTIONS,
      useValue: options,
    };

    return {
      module: JwtAccessModule,
      providers: [jwtStrategyOptionsProvider],
    };
  }

  static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    const provider = JwtAccessModule.makeAsyncStrategyOptionsProvider(options);

    return {
      module: JwtAccessModule,
      imports: options.imports,
      providers: options.useClass ? [provider, options.useClass] : [provider],
    };
  }

  private static makeAsyncStrategyOptionsProvider(options: ModuleAsyncOptions): Provider {
    if (!(options.useClass || options.useExisting || options.useFactory)) {
      throw new Error('Invalid JwtAccessModule options');
    }

    if (options.useFactory) {
      return {
        provide: JWT_STRATEGY_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    return {
      provide: JWT_STRATEGY_OPTIONS,
      useFactory: async (factory: StrategyOptionsFactory): Promise<StrategyOptions> =>
        factory.createJwtStrategyOptions(),
      inject: [options.useClass || options.useExisting],
    };
  }
}
