import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST') || 'localhost',
          port: parseInt(configService.get('DB_PORT'), 10) || 5432,
          username: configService.get('DB_USERNAME') || 'postgres',
          password: configService.get('SUPABASE_PASSWORD') || 'postgres',
          database: configService.get('DB_DATABASE') || 'postgres',
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
