// Test script to manually trigger side bet generation
// Run this in browser console or as a Node script

const testGenerateSidebet = async () => {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    'https://qmtolckqtosbfaiadjqz.supabase.co',
    'YOUR_ANON_KEY_HERE' // Replace with your anon key
  );

  console.log('Calling generate-daily-sidebet edge function...');
  
  const { data, error } = await supabase.functions.invoke('generate-daily-sidebet');
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success:', data);
  }
};

// Or just refresh your app - the DailySideBet component already calls this!
console.log('Just refresh your app at /mini-games and it will auto-generate');
