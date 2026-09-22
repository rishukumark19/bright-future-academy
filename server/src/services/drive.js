/**
 * GOOGLE DRIVE SERVICE
 * Grants viewer access to the course folder for a given Gmail address
 */
import { google } from 'googleapis';

// Service account credentials from environment variables
function getAuthClient() {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error('Google Service Account credentials not configured.');
  }

  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/drive']
  );
}

/**
 * Grants reader access to the course Drive folder for the given email.
 * @param {string} studentEmail - The student's Google Account email
 */
export async function grantDriveAccess(studentEmail) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID not configured.');
  }

  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  await drive.permissions.create({
    fileId: folderId,
    requestBody: {
      type: 'user',
      role: 'reader',
      emailAddress: studentEmail,
    },
    // Set to false to NOT send Google's default share notification email
    // (we send our own confirmation email instead)
    sendNotificationEmail: false,
    fields: 'id',
  });

  console.log(`🗂️  Google Drive: granted reader access to ${studentEmail} for folder ${folderId}`);
}

/**
 * Revokes Drive access — for admin use (email corrections)
 * @param {string} studentEmail
 */
export async function revokeDriveAccess(studentEmail) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) throw new Error('GOOGLE_DRIVE_FOLDER_ID not configured.');

  const auth = getAuthClient();
  const drive = google.drive({ version: 'v3', auth });

  // List permissions to find the one for this email
  const perms = await drive.permissions.list({
    fileId: folderId,
    fields: 'permissions(id, emailAddress)',
  });

  const perm = perms.data.permissions?.find(
    p => p.emailAddress?.toLowerCase() === studentEmail.toLowerCase()
  );

  if (perm) {
    await drive.permissions.delete({ fileId: folderId, permissionId: perm.id });
    console.log(`🗂️  Google Drive: revoked access for ${studentEmail}`);
  } else {
    console.warn(`Google Drive: no permission found for ${studentEmail}`);
  }
}
