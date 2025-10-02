import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Note: It's recommended to move client creation to a separate lib file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  const { data, error } = await supabase.from('products').select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}