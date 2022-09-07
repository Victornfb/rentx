interface IMailProvider {
	sendMail(to: string, subject: string, variables: unknown, path: string): Promise<void>;
}

export { IMailProvider };