import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './Database/database.module';
import { CommonModule } from './common/common.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
    DatabaseModule,
    CommonModule,
    CoreModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
