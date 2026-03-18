import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Extract answers
    const answers: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key.startsWith('answers[')) {
        const index = key.match(/\[(\d+)\]/)?.[1];
        if (index !== undefined) {
          answers[index] = value as string;
        }
      }
    });

    const file = formData.get('file') as File | null;

    // Mapping answers back to readable fields
    const company = answers['0'] || 'Unknown';
    const budget = answers['1'] || 'Not specified';
    const vision = answers['2'] || 'Not provided';
    const contact = answers['3'] || 'Not provided';

    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bodlizstudio@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Handle Attachments
    const attachments = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const mailOptions = {
      from: 'L BODI <bodlizstudio@gmail.com>',
      to: 'bodlizstudio@gmail.com',
      replyTo: contact,
      subject: `L BODI - New Ecosystem Inquiry [${company}]`,
      attachments,
      html: `
        <div style="background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px;">
          <div style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a1a; padding: 40px; border-radius: 20px;">
            <h1 style="color: #39FF14; font-size: 24px; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 10px;">New Ecosystem Inquiry</h1>
            
            <div style="margin-bottom: 25px;">
              <p style="color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;">Company</p>
              <p style="font-size: 18px; margin: 0;">${company}</p>
            </div>

            <div style="margin-bottom: 25px;">
              <p style="color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;">Intended Investment</p>
              <p style="font-size: 18px; margin: 0; color: #39FF14;">${budget}</p>
            </div>

            <div style="margin-bottom: 25px;">
              <p style="color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;">Project Vision</p>
              <p style="font-size: 16px; line-height: 1.6; margin: 0; color: #ccc;">${vision}</p>
            </div>

            ${file ? `
            <div style="margin-bottom: 25px; padding: 15px; background: #111; border: 1px dashed #39FF14; border-radius: 10px;">
               <p style="color: #39FF14; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;">Discovery Document Attached</p>
               <p style="font-size: 14px; margin: 0; color: #fff;">${file.name}</p>
            </div>
            ` : ''}

            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
              <p style="color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;">Contact Transmission</p>
              <p style="font-size: 16px; margin: 0;">${contact}</p>
            </div>
            
            <p style="margin-top: 50px; color: #444; font-size: 10px; text-align: center; letter-spacing: 1px;">TRANSMITTED VIA L BODI BIO-DIGITAL ENGINE</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ status: 'success', message: 'Evolution request transmitted.' });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ status: 'error', message: 'Transmission failed.' }, { status: 500 });
  }
}
