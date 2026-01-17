# Generate Daily Trivia Edge Function

Supabase Edge Function that fetches sports trivia questions from Open Trivia DB and stores them in your database.

## Features

- **Lazy Generation**: Only generates trivia if today's set doesn't exist
- Fetches 5 sports multiple-choice questions from Open Trivia DB
- Decodes HTML entities in questions and answers
- Randomly shuffles answer options
- Stores in `daily_trivia_sets` table with upsert (one per day)

## Deployment

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy generate-daily-trivia
```

## Usage

### Invoke Manually

**Via curl:**
```bash
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/generate-daily-trivia' \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

**Via Supabase Dashboard:**
1. Go to Edge Functions
2. Select `generate-daily-trivia`
3. Click "Invoke"

### Invoke from Your App

```javascript
const { data, error } = await supabase.functions.invoke('generate-daily-trivia');

if (data.ok) {
  if (data.skipped) {
    console.log('Trivia already exists for today');
  } else {
    console.log(`Generated ${data.count} questions for ${data.play_date}`);
  }
}
```

## Response Format

### Success - New Trivia Generated
```json
{
  "ok": true,
  "skipped": false,
  "play_date": "2026-01-14",
  "count": 5
}
```

### Success - Already Exists
```json
{
  "ok": true,
  "skipped": true,
  "play_date": "2026-01-14",
  "message": "Trivia already exists for today"
}
```

### Error
```json
{
  "ok": false,
  "error": "Error message here"
}
```

## How It Works

1. **Check if today's trivia exists** - Queries `daily_trivia_sets` for today's date
2. **If exists** - Returns `skipped: true` immediately (no API call)
3. **If not exists** - Fetches from Open Trivia DB, transforms data, and inserts
4. **Transformation**:
   - Combines `incorrect_answers` + `correct_answer`
   - Shuffles all answers randomly
   - Records the new index of the correct answer as `correctIndex`
   - Decodes HTML entities (e.g., `&quot;` → `"`)

## Data Format

The function inserts questions in this format:

```json
{
  "question": "What sport is played at Wimbledon?",
  "answers": ["Tennis", "Golf", "Cricket", "Soccer"],
  "correctIndex": 0
}
```

## Environment Variables

These are automatically provided by Supabase:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin access)

## Testing Locally

```bash
# Serve locally
supabase functions serve generate-daily-trivia

# Test in another terminal
curl -X POST 'http://localhost:54321/functions/v1/generate-daily-trivia' \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Integration

Call this function from your app when users visit the Mini Games page. If trivia doesn't exist for today, it will be generated on-demand.

Example integration in `MiniGamesPage.jsx`:

```javascript
useEffect(() => {
  // Generate today's trivia if it doesn't exist
  supabase.functions.invoke('generate-daily-trivia').then(({ data }) => {
    if (data?.ok && !data.skipped) {
      console.log('Generated new trivia for today');
    }
  });
}, []);
```
