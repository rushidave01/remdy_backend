import dotenv from "dotenv";
import ejs from "ejs";
import fs from "fs/promises";
import nodemailer from "nodemailer";
import path from "path";
dotenv.config();

// MailService class handles sending emails using nodemailer
export class MailService {
  private transporter: nodemailer.Transporter;

  // Constructor initializes the transporter with SMTP configuration
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_CONFIG_HOST, // SMTP host
      port: Number(process.env.EMAIL_CONFIG_PORT) || 465, // SMTP port
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_CONFIG_USERNAME, // SMTP username
        pass: process.env.EMAIL_CONFIG_PASSWORD, // SMTP password
      },
    });
  }

  // Utility to read an email template file from disk
  private async readTemplate(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error) {
      throw new Error(`Error reading email template: ${error}`);
    }
  }

  // Core function to send an email using the transporter
  private async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<nodemailer.SentMessageInfo> {
    const mailOptions = {
      from: `"${process.env.APP_NAME}">`, // Sender name (configured)
      to, // Recipient email
      subject, // Email subject
      html, // Email content in HTML
    };

    return this.transporter.sendMail(mailOptions); // Send the email
  }

  // Public method to send a welcome email to a doctor upon approval
  public async sendDoctorWelcomeMail(
    name: string,
    email: string,
    password: string
  ): Promise<nodemailer.SentMessageInfo> {
    // Setup email variables
    const platformName = process.env.APP_NAME || "Your Doctor Platform";
    const supportEmail = process.env.SUPPORT_EMAIL || "support@platform.com";
    const portalLoginUrl = process.env.CLIENT_USER_PORTAL_LOGIN_URL || "#";

    // Load the welcome email template
    const templatePath = path.join(
      __dirname,
      "../assets/templates/welcome-email/email.html"
    );
    const templateHTML = await this.readTemplate(templatePath);

    // Prepare data for EJS template rendering
    const templateData = {
      lastName: name.split(" ").slice(-1)[0], // Extract last name
      platformName,
      email: email,
      password: password,
      loginLink: portalLoginUrl + "/" + password, // Login URL (can be changed to exclude password in real apps)
      supportEmail,
      senderName: "Admin",
      senderTitle: "Admin Team",
      contactInfo: "123-456-7890",
      website: "https://yourplatform.com",
    };

    // Render the final HTML with dynamic values
    const messageHtml = ejs.render(templateHTML, templateData);
    const subject = `Welcome to ${platformName}`; // Email subject

    // Send the email
    return this.sendEmail(email, subject, messageHtml);
  }

  // Sends a rejection email to a doctor whose registration has been denied.
  public async sendDoctorRejectionMail(
    name: string,
    email: string
  ): Promise<nodemailer.SentMessageInfo> {
    const subject = "Doctor Registration Update";
    const messageHtml = `<p>Dear ${name || "Doctor"},</p>
      <p>We regret to inform you that your registration request has been denied by the admin team.</p>
      <p>If you believe this was a mistake or need further clarification, feel free to contact us at ${
        process.env.SUPPORT_EMAIL
      }.</p>
      <p>Regards,<br/>Admin Team</p>`;

    return this.sendEmail(email, subject, messageHtml);
  }
}
