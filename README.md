## Purpose
Using this module, you can easily and quickly restrict access to controller actions. 
This module works with JSON Web Tokens. 
Access can be granted based on the user's role specified in the token.

## Installation
```shell script
npm i @evilive3000/nest-jwt-access
```

## Import module
Simple static way:
```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtAccessModule } from '@evilive3000/nest-jwt-access';
import { ExtractJwt } from 'passport-jwt';

@Module({
  imports: [
    JwtAccessModule.forRoot({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret@key',
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```
read about `ExtractJwt` on [passportjs.org](http://www.passportjs.org/packages/passport-jwt/#extracting-the-jwt-from-the-request)

With ConfigModule:
```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAccessModule } from '@evilive3000/nest-jwt-access';
import { AppController } from './app.controller';
import { ExtractJwt } from 'passport-jwt';
import { schema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: schema }),
    JwtAccessModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secretOrKey: cfg.get<string>('JWT_SECRET'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

If you can't stand this mess your `app.module` turns into. I suggest considering another way.
```typescript
//app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtAccessModule } from '@evilive3000/nest-jwt-access';
import { AppController } from './app.controller';
import { schema } from './config.schema';
import { JwtAccessConfigService } from './jwt-access-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: schema, isGlobal: true }),
    JwtAccessModule.forRootAsync({ useClass: JwtAccessConfigService }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

just move all related settings into a separate file, and don't forget to set `{isGlobal: true}` for ConfigModule
```typescript
// jwt-access-config.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, StrategyOptions } from 'passport-jwt';
import { StrategyOptionsFactory } from '@evilive3000/nest-jwt-access';

@Injectable()
export class JwtAccessConfigService implements StrategyOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createJwtStrategyOptions(): StrategyOptions {
    return {
      secretOrKey: this.config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };
  }
}
```

## Usage

```typescript
import { Controller, Get } from '@nestjs/common';
import { JwtAccess } from '@evilive3000/nest-jwt-access';

@Controller()
export class AppController {
  @Get('one')
  @JwtAccess()
  getOne(): string {
    return 'Any authorized user have access for this route';
  }

  @Get('two')
  @JwtAccess('admin', 'moderator')
  getTwo(): string {
    return 'Only admin or moderator have access for this route';
  }
}
```

In order to gain access to a route protected by a role, 
it is necessary the JWT Payload has a field `roles: string[]` with the required role.

JWT Payload example: 
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022,
  "roles": ["admin"]
}
```
