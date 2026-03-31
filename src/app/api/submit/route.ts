import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      dateOfEntry,
      omcName,
      agencyName,
      domesticReceived,
      commercialReceived,
      industrialReceived,
      domesticDistributed,
      commercialDistributed,
      industrialDistributed,
      startingStock,
    } = body;

    // Validate environment variables
    const authEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const authKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!authEmail || !authKey || !spreadsheetId) {
      return NextResponse.json(
        { message: 'Server configuration error: Missing Google Sheets credentials.' },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: authEmail,
      key: authKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toISOString();
    const values = [
      [
        timestamp,
        dateOfEntry,
        omcName,
        agencyName,
        domesticReceived,
        commercialReceived,
        industrialReceived,
        domesticDistributed,
        commercialDistributed,
        industrialDistributed,
        startingStock,
      ],
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return NextResponse.json({ message: 'Success', data: response.data }, { status: 200 });
  } catch (error: any) {
    console.error('Error submitting to Google Sheets:', error);
    return NextResponse.json(
      { message: 'Error submitting to Google Sheets', error: error.message },
      { status: 500 }
    );
  }
}
