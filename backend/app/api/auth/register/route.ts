import { NextRequest } from 'next/server';
import { AuthController } from '../../../../src/controllers/AuthController';

export async function POST(req: NextRequest) {
  return AuthController.register(req);
}

export async function OPTIONS() {
  return AuthController.register(null as any); // Or standard options payload
}
