import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cedula = searchParams.get('cedula');

  if (!cedula) {
    return NextResponse.json({ error: 'Cedula is required' }, { status: 400 });
  }

  try {
    // Hacienda API Public Endpoint
    const url = `https://api.hacienda.go.cr/fe/ae?identificacion=${cedula}`;
    const response = await axios.get(url, { timeout: 3000 });

    // The API returns the name directly or in a structure. Based on previous curl: "nombre": "..."
    if (response.data && response.data.nombre) {
      return NextResponse.json({ nombre: response.data.nombre, raw: response.data });
    } else {
      return NextResponse.json({ error: 'Name not found for this ID' }, { status: 404 });
    }
  } catch (error) {
    console.error('Hacienda API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Hacienda' }, { status: 500 });
  }
}
