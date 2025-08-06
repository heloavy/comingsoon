/*import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, found_us, work } = req.body;

  if (!name || !email || !found_us || !work) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          name,
          email,
          found_us,
          work
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ message: 'Database error' });
    }

    return res.status(200).json({ message: 'Successfully added to waitlist' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}*/