// Mail service for sending emails from chat workflow
export class MailService {
  private static readonly BACKEND_URL = process.env.API_URL || 'https://legacy-backend-151726525663.europe-west1.run.app';

  static async sendContactEmails(userData: any): Promise<void> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email || '',
          phone: userData.phone || '',
          account: 'Chat Support Request',
          message: `User requested contact through chat workflow.\nCity: ${userData.city || 'Not provided'}\nPrevious messages: Available in chat logs`
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send emails: ${response.statusText}`);
      }

      console.log('Contact emails sent successfully from chat workflow');
    } catch (error) {
      console.error('Error sending contact emails from chat:', error);
      throw error;
    }
  }
}
