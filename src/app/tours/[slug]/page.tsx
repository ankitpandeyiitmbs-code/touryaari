import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function TourRedirectPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  
  // Check if tour exists
  const supabase = createClient();
  const { data: tour } = await supabase
    .from('tours')
    .select('slug')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  
  if (tour) {
    // Redirect to the correct singular route
    redirect(`/tour/${slug}`);
  }
  
  // If tour doesn't exist, redirect to tours listing
  redirect('/tours');
}
