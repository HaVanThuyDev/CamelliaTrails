import { NextRequest, NextResponse } from 'next/server';
import { TourService } from '../services/TourService';
import { HttpException } from '../exceptions/HttpException';

export class TourController {
  /**
   * Fetch all tours controller
   */
  static async getTours() {
    try {
      const tours = await TourService.getTours();
      return NextResponse.json(tours);
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }

  /**
   * Save a tour controller
   */
  static async saveTour(req: NextRequest) {
    try {
      const body = await req.json();
      const tour = await TourService.saveTour(body);
      return NextResponse.json({ status: 'success', id: tour.id, tour });
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }

  /**
   * Delete a tour controller
   */
  static async deleteTour(req: NextRequest, id: string) {
    try {
      await TourService.deleteTour(id);
      return NextResponse.json({ status: 'success', message: `Tour ${id} deleted` });
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }
}
