// Wedding RSVP Apps Script
// Copy this entire file to your Google Apps Script editor and redeploy

// GET = validate code, POST = submit/update RSVP
function doGet(e) {
  return handleValidation(e);
}

function doPost(e) {
  return handleSubmission(e);
}

// Rate limiting helper
function checkRateLimit(clientId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'rate_' + clientId;
  const attempts = parseInt(cache.get(cacheKey) || '0');

  if (attempts >= 10) {
    return false;
  }
  cache.put(cacheKey, String(attempts + 1), 60);
  return true;
}

// GET: Validate invitation code and return existing response if any
function handleValidation(e) {
  const clientId = e.parameter.clientId || 'unknown';
  if (!checkRateLimit(clientId)) {
    return jsonResponse({ success: false, error: 'Too many attempts. Please wait a minute.' });
  }

  const code = (e.parameter.code || '').trim().toUpperCase();
  if (!code) {
    return jsonResponse({ success: false, error: 'No code provided' });
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const guestsSheet = ss.getSheetByName('Guests');
    if (!guestsSheet) {
      return jsonResponse({ success: false, error: 'Sheet not found' });
    }

    const data = guestsSheet.getDataRange().getValues();
    const headers = data[0].map(h => h.toString().toLowerCase().trim());
    const codeIdx = headers.indexOf('code');
    const nameIdx = headers.indexOf('name');
    const maxGuestsIdx = headers.indexOf('max_guests');
    const messageIdx = headers.indexOf('message');

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowCode = (row[codeIdx] || '').toString().trim().toUpperCase();
      if (rowCode === code) {
        const guest = {
          name: row[nameIdx] || '',
          max_guests: parseInt(row[maxGuestsIdx]) || 1,
          message: row[messageIdx] || 'We welcome you to join us in our celebration!'
        };

        // Check for existing response
        const responsesSheet = ss.getSheetByName('Wedding Responses');
        if (responsesSheet) {
          const respData = responsesSheet.getDataRange().getValues();
          const respHeaders = respData[0];
          const respCols = {
            timestamp: respHeaders.indexOf('timestamp'),
            code: respHeaders.indexOf('code'),
            attending: respHeaders.indexOf('attending'),
            guests: respHeaders.indexOf('guests'),
            dietary: respHeaders.indexOf('dietary'),
            message: respHeaders.indexOf('message')
          };

          for (let j = 1; j < respData.length; j++) {
            const respRow = respData[j];
            const respCode = (respRow[respCols.code] || '').toString().trim().toUpperCase();
            if (respCode === code) {
              guest.existing = {
                timestamp: respRow[respCols.timestamp] ? respRow[respCols.timestamp].toISOString() : '',
                attending: respRow[respCols.attending] || '',
                guests: respRow[respCols.guests] ? respRow[respCols.guests].toString() : '',
                dietary: respRow[respCols.dietary] || '',
                message: respRow[respCols.message] || ''
              };
              break;
            }
          }
        }

        return jsonResponse({ success: true, guest: guest });
      }
    }
    return jsonResponse({ success: false, error: 'Invalid code' });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Server error: ' + error.toString() });
  }
}

// POST: Submit or update RSVP
function handleSubmission(e) {
  try {
    const params = e.parameter;
    const code = (params.code || '').trim().toUpperCase();

    if (!code) {
      return jsonResponse({ success: false, error: 'No code provided' });
    }

    // Get or create Wedding Responses sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Wedding Responses');
    if (!sheet) {
      sheet = ss.insertSheet('Wedding Responses');
      sheet.appendRow(['timestamp', 'code', 'name', 'attending', 'guests', 'dietary', 'message']);
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    // Find column indices
    const cols = {
      timestamp: headers.indexOf('timestamp'),
      code: headers.indexOf('code'),
      name: headers.indexOf('name'),
      attending: headers.indexOf('attending'),
      guests: headers.indexOf('guests'),
      dietary: headers.indexOf('dietary'),
      message: headers.indexOf('message')
    };

    // Prepare row data
    const newRow = [
      new Date(),
      code,
      params.name || '',
      params.attending || '',
      params.guests || '',
      params.dietary || '',
      params.message || ''
    ];

    // Check if code already exists (update) or new (insert)
    let updated = false;
    for (let i = 1; i < data.length; i++) {
      const rowCode = (data[i][cols.code] || '').toString().trim().toUpperCase();
      if (rowCode === code) {
        // Update existing row
        sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
        updated = true;
        break;
      }
    }

    if (!updated) {
      // Insert new row
      sheet.appendRow(newRow);
    }

    return jsonResponse({ success: true, updated: updated });
  } catch (error) {
    return jsonResponse({ success: false, error: 'Server error: ' + error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
