/**
 * Supabase Edge Function: Send Validation Email
 * 
 * This function sends the final transformed image to the user for validation.
 * 
 * To deploy this function:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Link your project: supabase link --project-ref your-project-ref
 * 4. Deploy: supabase functions deploy send-validation-email
 * 
 * Environment variables needed:
 * - SENDGRID_API_KEY (if using SendGrid)
 * - MAILGUN_API_KEY and MAILGUN_DOMAIN (if using Mailgun)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId, finalImageUrl, userEmail } = await req.json()

    if (!orderId || !finalImageUrl || !userEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // TODO: Implement email sending
    // Option 1: Using SendGrid
    // const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')!
    // const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${sendgridApiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{
    //       to: [{ email: userEmail }],
    //     }],
    //     from: { email: 'noreply@iapostershop.com' },
    //     subject: 'Votre poster est prêt pour validation',
    //     content: [{
    //       type: 'text/html',
    //       value: `
    //         <h1>Votre poster est prêt !</h1>
    //         <p>Votre image transformée est prête. Veuillez la valider en cliquant sur le lien ci-dessous.</p>
    //         <img src="${finalImageUrl}" alt="Votre poster" style="max-width: 100%; height: auto;" />
    //         <p><a href="${supabaseUrl}/orders/${orderId}">Voir la commande</a></p>
    //       `,
    //     }],
    //   }),
    // })

    // Option 2: Using Mailgun
    // const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY')!
    // const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN')!
    // const mailgunResponse = await fetch(
    //   `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Basic ${btoa(`api:${mailgunApiKey}`)}`,
    //     },
    //     body: new FormData({
    //       from: 'IA Poster Shop <noreply@iapostershop.com>',
    //       to: userEmail,
    //       subject: 'Votre poster est prêt pour validation',
    //       html: `
    //         <h1>Votre poster est prêt !</h1>
    //         <p>Votre image transformée est prête. Veuillez la valider.</p>
    //         <img src="${finalImageUrl}" alt="Votre poster" style="max-width: 100%; height: auto;" />
    //         <p><a href="${supabaseUrl}/orders/${orderId}">Voir la commande</a></p>
    //       `,
    //     }),
    //   }
    // )

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        final_image_url: finalImageUrl,
        status: 'sent_for_validation',
      })
      .eq('id', orderId)

    if (updateError) {
      throw updateError
    }

    // Placeholder response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully (placeholder)',
        orderId,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
