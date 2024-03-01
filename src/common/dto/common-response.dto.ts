import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<T> {
  @ApiProperty({ example: 200, description: 'status code' })
  statusCode: number;

  @ApiProperty({ example: 'success', description: 'status message' })
  message: string;

  data: T;

  cnt?: number;

  constructor(data: T) {
    this.statusCode = 200;
    this.message = 'success';
    this.data = data ?? ({} as T);
  }
}
