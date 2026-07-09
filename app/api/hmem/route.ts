import { NextResponse } from 'next/server';
import { runSimulation } from '@/lib';

export async function GET() {
  try {
    const result = await runSimulation();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Simulation failed', details: String(error) },
      { status: 500 }
    );
  }
}
