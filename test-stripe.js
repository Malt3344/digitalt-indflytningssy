// Test script til at teste Stripe API direkte
console.log('Testing Stripe API...')

const testAPI = async () => {
  try {
    console.log('Environment variables:')
    console.log('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY)
    console.log('NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD:', process.env.NEXT_PUBLIC_STRIPE_PRICE_PDF_DOWNLOAD)
    
    console.log('\n=== Testing with sample request ===')
    
    const response = await fetch('http://localhost:3000/api/stripe/create-pdf-payment-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'sb-uxhhvfyincgpaktsqwjw-auth-token=TOKEN_HERE' // You need to put real cookie here
      },
      body: JSON.stringify({
        inspectionId: 'test-id-123',
      }),
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    const data = await response.text()
    console.log('Response body:', data)
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testAPI()