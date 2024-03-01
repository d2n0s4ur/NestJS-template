import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [],
  exports: [CommonModule],
})
export class CoreModule {}
