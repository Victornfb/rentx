import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import createConnection from '../index'

async function create() {
	const connection = await createConnection('localhost');

	const id = uuidv4();
	const password = await hash('admin', 8);

	await connection.query(
		`insert into users (id, name, email, password, is_admin, created_at, driver_license)
		values ('${id}', 'Admin', 'admin@rentx.com.br', '${password}', true, 'now()', 'XXXXXXX')`
	);

	await connection.close();
}

create().then(() => { console.log('User admin created') });