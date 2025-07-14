import { Global, Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { GamesModule } from './modules/games/games.module';
import { PurchasesModule } from './modules/purchases/purchases.module';

@Global()
@Module({
  imports: [PrismaModule, GamesModule, PurchasesModule],
})
export class AppModule {}
