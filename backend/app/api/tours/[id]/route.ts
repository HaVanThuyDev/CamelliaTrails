import { NextRequest } from 'next/server';
import { TourController } from '../../../../src/controllers/TourController';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return TourController.deleteTour(req, params.id);
}
