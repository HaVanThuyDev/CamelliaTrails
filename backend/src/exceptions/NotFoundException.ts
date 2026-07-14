import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  constructor(message: string = 'Resource Not Found') {
    super(message, 404);
  }
}
