/**
 * Gio's Chronology — Learning Tracker
 * Google Apps Script backend — a JSON API over a Google Sheet.
 *
 * The frontend (index.html / styles.css / script.js) is hosted separately
 * (e.g. GitHub Pages) and talks to this project over fetch()/HTTP.
 *
 * SECURITY: every data operation requires a Firebase ID token, verified
 * server-side against Google's Identity Toolkit in verifyIdToken_(). The
 * email used to read/write the Sheet always comes from that verified
 * token — never from anything the client claims — so a signed-in user
 * can only ever touch their own row(s).
 *
 * Sheet schema (row 1 = header, one row per user+module+topic):
 *   A: User Email | B: Module ID | C: Topic ID | D: Status | E: Notes | F: Last Updated
 *
 * This script lives inside (bound to) the existing Google Sheet at
 * SPREADSHEET_ID below — that Sheet is the datastore.
 *
 * SETUP:
 *   1. Select "setupSpreadsheet" in the function dropdown at the top of the
 *      editor and click Run. This adds the "Progress" tab with headers to
 *      the Sheet above, if it isn't there already. Check View > Executions
 *      for confirmation.
 *   2. Deploy > New deployment > Web app.
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      ("Anyone" only means "reachable over HTTP from your GitHub-hosted
 *      frontend" — every request is still gated by a verified Firebase
 *      sign-in, see verifyIdToken_() below.)
 *   3. Copy the deployment's Web app URL (ends in /exec) into the
 *      APPS_SCRIPT_URL constant in index.html.
 */

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------

/** The ID of the existing Google Sheet this script uses as the datastore. */
const SPREADSHEET_ID = '1KhFEK8CXc0FE7C56O8PcVbpO5aw86Oj5YkQAw199nYs';

/**
 * Your Firebase project's Web API key (same value as apiKey in
 * index.html's firebaseConfig). Used only to call Google's own
 * token-verification endpoint below — this is a public project
 * identifier, not a secret, so it's fine hardcoded here.
 */
const FIREBASE_API_KEY = 'AIzaSyD3P1zTnWwW6VonvZghgVTnb0Eokxr7AzE';

/** Name of the sheet/tab that stores progress rows. */
const SHEET_NAME = 'Progress';

/** Header row, in column order. Keep in sync with the schema above. */
const HEADERS = ['User Email', 'Module ID', 'Topic ID', 'Status', 'Notes', 'Last Updated'];

// ---------------------------------------------------------------------------
// HTTP ENTRY POINTS
// ---------------------------------------------------------------------------

/** GET is just a human-friendly health check (open the /exec URL directly). */
function doGet(e) {
  return jsonOutput_({ ok: true, message: "Gio's Chronology API is running." });
}

/**
 * Single POST entry point for all data operations. Body is JSON, sent as
 * Content-Type: text/plain from the client on purpose — that keeps the
 * request a CORS "simple request" so browsers skip the OPTIONS preflight
 * that Apps Script web apps don't handle. We parse the JSON ourselves.
 *
 * Expected body: { action: string, idToken: string, payload?: any }
 * Always responds 200 with { ok: true, data } or { ok: false, error }.
 */
function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || '{}');
    const action = body.action;
    const email = verifyIdToken_(body.idToken); // throws if not a real, current sign-in
    const payload = body.payload || {};

    let data;
    switch (action) {
      case 'getProgress':
        data = getProgressForUser_(email);
        break;
      case 'saveProgress':
        data = saveProgress_(email, payload);
        break;
      case 'saveProgressBatch':
        data = saveProgressBatch_(email, payload.records);
        break;
      case 'deleteProgress':
        data = deleteProgress_(email, payload.moduleId, payload.topicId);
        break;
      default:
        throw new Error('Unknown action: ' + action);
    }

    return jsonOutput_({ ok: true, data: data });
  } catch (err) {
    return jsonOutput_({ ok: false, error: err.message });
  }
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------------------
// AUTH — the email used everywhere below always comes from here, never
// from a client-supplied field.
// ---------------------------------------------------------------------------

/**
 * Verifies a Firebase ID token against Google's Identity Toolkit and
 * returns the verified, lowercased email it belongs to. Throws if the
 * token is missing, malformed, expired, or doesn't resolve to an account.
 * This is the REST equivalent of the Firebase Admin SDK's verifyIdToken(),
 * used here because Apps Script can't run the Admin SDK.
 *
 * @param {string} idToken
 * @return {string} verified email address, lowercased
 */
function verifyIdToken_(idToken) {
  if (!idToken) throw new Error('Not signed in. Please sign in and try again.');

  const url = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + FIREBASE_API_KEY;
  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({ idToken: idToken }),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error('Your session has expired. Please sign in again.');
  }

  const body = JSON.parse(response.getContentText());
  const user = body.users && body.users[0];

  if (!user || !user.email) {
    throw new Error('Could not verify your account. Please sign in again.');
  }

  return String(user.email).trim().toLowerCase();
}

// ---------------------------------------------------------------------------
// MANUAL SETUP
// Run this once from the Apps Script editor (select "setupSpreadsheet" in
// the function dropdown, then click Run) to create the "Progress" tab (with
// headers) in the Sheet above right now, instead of waiting for the first
// real request to do it implicitly.
// ---------------------------------------------------------------------------

function setupSpreadsheet() {
  const sheet = getProgressSheet_();
  sheet.autoResizeColumns(1, HEADERS.length);
  Logger.log('Setup OK — "%s" tab is ready in: %s', SHEET_NAME, sheet.getParent().getUrl());
}

// ---------------------------------------------------------------------------
// SHEET HELPERS
// ---------------------------------------------------------------------------

/**
 * Returns the Progress sheet, creating the "Progress" tab (with headers)
 * in the existing spreadsheet above if it doesn't exist yet.
 */
function getProgressSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }

  return sheet;
}

/**
 * Reads all data rows from the Progress sheet into an array of objects.
 */
function readAllRows_() {
  const sheet = getProgressSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();

  return values
    .map(function (row, index) {
      return {
        rowIndex: index + 2, // 1-based sheet row number
        userEmail: row[0],
        moduleId: row[1],
        topicId: row[2],
        status: row[3],
        notes: row[4],
        lastUpdated: row[5]
      };
    })
    .filter(function (r) { return r.userEmail; }); // skip blank rows
}

/**
 * Upserts one row for (email, moduleId, topicId). Internal — assumes email
 * has already been verified by the caller.
 */
function upsertProgressRow_(email, moduleId, topicId, status, notes) {
  const sheet = getProgressSheet_();
  const now = new Date();

  const rows = readAllRows_();
  const existing = rows.find(function (r) {
    return String(r.userEmail).trim().toLowerCase() === email &&
      String(r.moduleId) === String(moduleId) &&
      String(r.topicId) === String(topicId);
  });

  if (existing) {
    sheet.getRange(existing.rowIndex, 1, 1, HEADERS.length).setValues([[
      email, moduleId, topicId, status, notes, now
    ]]);
  } else {
    sheet.appendRow([email, moduleId, topicId, status, notes, now]);
  }

  return {
    moduleId: moduleId,
    topicId: topicId,
    status: status,
    notes: notes,
    lastUpdated: now.toISOString()
  };
}

// ---------------------------------------------------------------------------
// DATA OPERATIONS
// Every function's first argument is the ID-token-verified email from
// doPost() above — never a client-supplied one.
// ---------------------------------------------------------------------------

/**
 * Returns all progress records for the signed-in user.
 * @param {string} email
 * @return {Array<Object>} [{ moduleId, topicId, status, notes, lastUpdated }, ...]
 */
function getProgressForUser_(email) {
  return readAllRows_()
    .filter(function (r) { return String(r.userEmail).trim().toLowerCase() === email; })
    .map(function (r) {
      return {
        moduleId: r.moduleId,
        topicId: r.topicId,
        status: r.status,
        notes: r.notes,
        lastUpdated: r.lastUpdated instanceof Date ? r.lastUpdated.toISOString() : r.lastUpdated
      };
    });
}

/**
 * Creates or updates a single topic's progress row for the signed-in user.
 * @param {string} email
 * @param {Object} record { moduleId, topicId, status, notes }
 * @return {Object} the saved record, including the server-set lastUpdated timestamp
 */
function saveProgress_(email, record) {
  if (!record || !record.moduleId || !record.topicId) {
    throw new Error('moduleId and topicId are required.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return upsertProgressRow_(email, record.moduleId, record.topicId, record.status || 'Not Started', record.notes || '');
  } finally {
    lock.releaseLock();
  }
}

/**
 * Batch-saves multiple progress records in one call (e.g. bulk sync).
 * @param {string} email
 * @param {Array<Object>} records
 * @return {Array<Object>} the saved records
 */
function saveProgressBatch_(email, records) {
  if (!Array.isArray(records)) throw new Error('records must be an array.');

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    return records.map(function (r) {
      return upsertProgressRow_(email, r.moduleId, r.topicId, r.status || 'Not Started', r.notes || '');
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Deletes a single topic's progress row for the signed-in user (resets it
 * to "not tracked").
 * @param {string} email
 * @param {string} moduleId
 * @param {string} topicId
 * @return {boolean} true if a row was deleted
 */
function deleteProgress_(email, moduleId, topicId) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getProgressSheet_();
    const rows = readAllRows_();
    const existing = rows.find(function (r) {
      return String(r.userEmail).trim().toLowerCase() === email &&
        String(r.moduleId) === String(moduleId) &&
        String(r.topicId) === String(topicId);
    });

    if (existing) {
      sheet.deleteRow(existing.rowIndex);
      return true;
    }
    return false;
  } finally {
    lock.releaseLock();
  }
}
