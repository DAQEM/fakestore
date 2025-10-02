import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  // Assuming your categories table has a 'name' column
  const { data, error } = await supabase.from('categories').select('name');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Supabase returns an array of objects, e.g., [{name: 'electronics'}, ...].
  // We map it to return an array of strings as the original API did.
  const categoryNames = data.map((category) => category.name);
  return NextResponse.json(categoryNames);
}