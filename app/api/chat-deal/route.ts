import { NextRequest, NextResponse } from "next/server";

interface DealInquiryData {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  subject: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: DealInquiryData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'city', 'message'];
    const missingFields = requiredFields.filter(field => !data[field as keyof DealInquiryData]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Here you would typically:
    // 1. Send notification email to your team
    // 2. Send confirmation email to the user
    // 3. Store the inquiry in a database
    
    // For now, we'll just log the data and return success
    console.log('Deal inquiry received:', {
      ...data,
      timestamp: new Date().toISOString()
    });

    // Send notification to backend contact API (reuse existing email functionality)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://legacy-backend-151726525663.europe-west1.run.app';
      
      await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          account: 'Deal Inquiry',
          message: `${data.subject}\n\nCity: ${data.city}\n\nOriginal Message: ${data.message}`
        }),
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Continue even if email fails - the deal inquiry is still recorded
    }

    return NextResponse.json({
      success: true,
      message: 'Deal inquiry submitted successfully'
    });

  } catch (error) {
    console.error('Error processing deal inquiry:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process deal inquiry'
    }, { status: 500 });
  }
}
