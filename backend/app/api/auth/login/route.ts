import { NextRequest } from 'next/server';
import { AuthController } from '../../../../src/controllers/AuthController';

export async function POST(req: NextRequest) {
  return AuthController.login(req);
}

export async function OPTIONS() {
  return AuthController.login(null as any);
}
