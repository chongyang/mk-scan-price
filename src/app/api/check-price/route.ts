import { NextResponse } from 'next/server';
import { getProductByQR } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get('sku');

  if (!sku) {
    return NextResponse.json(
      { error: 'SKU is required' },
      { status: 400 }
    );
  }
  
  try {
    const product = await getProductByQR(sku);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 