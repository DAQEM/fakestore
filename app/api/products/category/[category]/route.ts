import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category: paramsCategory } = await params;
  const category = decodeURIComponent(paramsCategory);

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}