import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './chat.gateway';

@Module({
  imports: [
    // CacheModule.register({
    //   store: redisStore,
    //   host: 'localhost',
    //   port: 3344,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
