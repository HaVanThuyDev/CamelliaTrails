import { NextRequest } from 'next/server';
import { TourController } from '../../../src/controllers/TourController';

export async function GET() {
  return TourController.getTours();
}

export async function POST(req: NextRequest) {
  return TourController.saveTour(req);
}
