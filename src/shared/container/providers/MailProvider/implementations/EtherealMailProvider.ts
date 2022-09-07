import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";

@injectable()
class EtherealMailProvider implements IMailProvider {
	private client: Transporter;

	constructor() {
		nodemailer.createTestAccount().then(account => {
			const transporter = nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				secure: account.smtp.secure,
				auth: {
					user: account.user,
					pass: account.pass
				}
			});

			this.client = transporter;
		}).catch(err => console.error(err));
	}

	async sendMail(to: string, subject: string, variables: unknown, path: string): Promise<void> {
		const templateFileContent = fs.readFileSync(path).toString('utf-8');

		const templateParse = Handlebars.compile(templateFileContent);

		const templeteHTML = templateParse(variables);

		const message = await this.client.sendMail({
			to,
			from: 'Rentx <noreply@rentx.com.br>',
			subject,
			html: templeteHTML,
		});

		console.log('Message sent: %s', message.messageId);
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
	}

}

export { EtherealMailProvider };