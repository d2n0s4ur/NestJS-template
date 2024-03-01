import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import { LoggerContextMiddleware } from './middleware/logger-context.middleware';

const logDir = 'logs';
const dailyOptions = (level: string) => {
  return {
    level,
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    datePattern: 'YYYYMMDD',
    zippedArchive: true,
    maxFiles: '14d',
  };
};

@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transports: [
          new winston.transports.Console({
            level:
              configService.get<string>('NODE_ENV') === 'production'
                ? 'http'
                : 'silly',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              utilities.format.nestLike('API', { prettyPrint: true }),
            ),
          }),
          new winstonDaily(dailyOptions('http')),
          new winstonDaily(dailyOptions('info')),
          new winstonDaily(dailyOptions('warn')),
          new winstonDaily(dailyOptions('error')),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CommonModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
