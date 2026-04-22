import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone and message are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: name.trim(),
          email: email?.trim() || null,
          phone: phone.trim(),
          destination: subject || 'General Inquiry',
          message: message.trim(),
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving inquiry:', error.message);
      return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
