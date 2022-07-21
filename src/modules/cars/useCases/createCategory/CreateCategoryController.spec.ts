import { app } from "@shared/infra/http/app";
import request from "supertest";
import { Connection } from "typeorm";
import createConnection from '@shared/infra/typeorm';
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';

let connection: Connection;

describe('Create Category Controller', () => {

	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();

		const id = uuidv4();
		const password = await hash('admin', 8);

		await connection.query(
			`insert into users (id, name, email, password, is_admin, created_at, driver_license)
			values ('${id}', 'Admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXX')`
		);
	});

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	})

	it('should be able to create a new category', async () => {
		const responseToken = await request(app)
			.post('/sessions')
			.send({
				email: 'admin@rentx.com.br',
				password: 'admin'
			});

		const { token } = responseToken.body;

		const response = await request(app)
			.post('/categories')
			.send({
				name: "Category Test",
				description: "Category Test Description"
			})
			.set({
				Authorization: `Bearer ${token}`
			});

		expect(response.status).toBe(201);
	});

	it('should not be able to create a category with a used name', async () => {
		const responseToken = await request(app)
			.post('/sessions')
			.send({
				email: 'admin@rentx.com.br',
				password: 'admin'
			});

		const { token } = responseToken.body;

		const response = await request(app)
			.post('/categories')
			.send({
				name: "Category Test",
				description: "Category Test Description"
			})
			.set({
				Authorization: `Bearer ${token}`
			});

		expect(response.status).toBe(400);
	});

});