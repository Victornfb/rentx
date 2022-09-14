import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import Handlebars from "handlebars";
import aws from "aws-sdk";

@injectable()
class SESMailProvider implements IMailProvider {
	private client: Transporter;

	constructor() {
		this.client = nodemailer.createTransport({
			SES: new aws.SES({
				apiVersion: "2010-12-01",
				region: process.env.AWS_REGION
			})
		})
	}

	async sendMail(to: string, subject: string, variables: unknown, path: string): Promise<void> {
		const templateFileContent = fs.readFileSync(path).toString('utf-8');

		const templateParse = Handlebars.compile(templateFileContent);

		const templeteHTML = templateParse(variables);

		await this.client.sendMail({
			to,
			from: 'Rentx <contato@victornfb.com.br>',
			subject,
			html: templeteHTML,
		});
	}

}

export { SESMailProvider };