import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/AuthService';
import { HttpException } from '../exceptions/HttpException';

export class AuthController {
  /**
   * Register endpoint controller
   */
  static async register(req: NextRequest) {
    try {
      const body = await req.json();
      const user = await AuthService.register(body);
      return NextResponse.json({
        status: 'success',
        message: 'User registered successfully',
        user
      });
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }

  /**
   * Login endpoint controller
   */
  static async login(req: NextRequest) {
    try {
      const body = await req.json();
      const result = await AuthService.login(body);
      return NextResponse.json({
        status: 'success',
        message: 'Login successful',
        ...result
      });
    } catch (err: any) {
      if (err instanceof HttpException) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json({ error: err.message || err }, { status: 500 });
    }
  }
}
