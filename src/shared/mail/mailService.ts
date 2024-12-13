import * as fs from 'fs-extra';
import handlebars from 'handlebars';
import path from 'path';
import transporter from './mailConfig';

type MailOptions = {
    to: string;
    subject: string;
    template: string;
    context: Record<string, string>;
};

const readTemplate = async (templateName: string): Promise<string> => {
    try {
        const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
        const templateContent = await fs.readFile(templatePath, 'utf-8'); // Type is explicitly string
        return templateContent;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error reading template: ${error.message}`);
        } else {
            throw new Error('Unknown error occurred while reading the template');
        }
    }
};

const sendMail = async ({ to, subject, template, context }: MailOptions): Promise<void> => {
    try {
        const templateContent = await readTemplate(template);
        const compiledTemplate = handlebars.compile(templateContent);
        const html = compiledTemplate(context);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error sending email: ', error.message);
        } else {
            console.error('Unknown error occurred while sending email');
        }
    }
};

export { MailOptions, sendMail };
