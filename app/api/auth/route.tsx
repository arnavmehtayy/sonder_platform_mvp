import { NextResponse } from 'next/server';
import { supabase } from '../supabase/initSupabase';

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json();

    if (action === 'signup') {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      return NextResponse.json({ message: 'Check your email for confirmation' });
    }

    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return NextResponse.json({ session: data.session });
    }

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "error" }, { status: 400 });
  }
}