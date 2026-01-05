# Supabase Edge Functions

This directory contains Supabase Edge Functions for the IA Poster Shop.

## Functions

### send-validation-email

Sends the final transformed image to the user for validation via email.

**Usage:**
```typescript
const response = await fetch('https://your-project.supabase.co/functions/v1/send-validation-email', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    orderId: 'order-uuid',
    finalImageUrl: 'https://...',
    userEmail: 'user@example.com',
  }),
})
```

## Deployment

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Set environment variables:
```bash
supabase secrets set SENDGRID_API_KEY=your-key
# OR
supabase secrets set MAILGUN_API_KEY=your-key MAILGUN_DOMAIN=your-domain
```

5. Deploy the function:
```bash
supabase functions deploy send-validation-email
```

## Notes

- These are placeholder implementations
- For production, implement actual email sending using SendGrid or Mailgun
- Ensure proper error handling and logging
- Consider rate limiting for production use
