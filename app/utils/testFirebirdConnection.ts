const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function testFirebirdApi(
	host: string,
	port: string,
	database: string,
	user: string,
	password: string,
): Promise<{ success: boolean; message: string }> {
	const query = new URLSearchParams({
		host,
		port,
		database,
		user,
		password,
	})

	const res = await fetch(`${API_URL}/firebird?${query.toString()}`)

	return await res.json()
}
