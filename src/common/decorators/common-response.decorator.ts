import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const ApiCommonResponse = (
  obj?: SchemaObject & Partial<ReferenceObject>,
) => {
  if (!obj) {
    return applyDecorators(
      ApiOkResponse({
        schema: {
          properties: {
            statusCode: {
              type: 'number',
              example: 200,
              description: 'status code',
            },
            message: {
              type: 'string',
              example: '',
              description: 'status message',
            },
            data: {
              type: 'string',
              example: '',
            },
          },
        },
      }),
    );
  }
  return applyDecorators(
    ApiOkResponse({
      schema: {
        properties: {
          statusCode: {
            type: 'number',
            example: 200,
            description: 'status code',
          },
          message: {
            type: 'string',
            example: '',
            description: 'status message',
          },
          data: {
            type: 'array',
            items: {
              ...obj,
            },
          },
        },
      },
    }),
  );
};
