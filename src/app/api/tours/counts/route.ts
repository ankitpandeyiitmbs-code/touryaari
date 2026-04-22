import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();

  try {
    const { data: tours } = await supabase
      .from('tours')
      .select('category')
      .eq('is_active', true);

    const counts: Record<string, number> = {};
    
    if (tours) {
      tours.forEach((tour: any) => {
        if (tour.category) {
          counts[tour.category] = (counts[tour.category] || 0) + 1;
        }
      });
    }

    return NextResponse.json({ counts });
  } catch (error) {
    console.error('Error fetching tour counts:', error);
    return NextResponse.json({ error: 'Failed to fetch tour counts' }, { status: 500 });
  }
}
