import express from "express";
import ViteExpress from "vite-express";
import { config } from "dotenv";
import pg from "pg";

const { Pool } = pg;

config();

const app = express();

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	database: "Intercorp",
	password: "213262",
	port: 5432,
});

// const pool = new pg.Pool({
// 	connectionString: process.env.DATABASE_URL,
// });

app.use(express.json());

app.get("/api/productos", async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM producto ORDER BY id ASC"
		);
		res.json(result.rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error en el servidor" });
	}
});

app.put("/api/productos/:id", async (req, res) => {
	const { id } = req.params;
	const { nombre, precio } = req.body;

	try {
		const result = await pool.query(
			"UPDATE producto SET nombre = $1, precio = $2 WHERE id = $3 RETURNING *",
			[nombre, precio, id]
		);
		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error en el servidor" });
	}
});

app.delete("/api/productos/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			"DELETE FROM producto WHERE id = $1 RETURNING *",
			[id]
		);
		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error en el servidor" });
	}
});
app.post("/api/productos", async (req, res) => {
	try {
		const { nombre, precio } = req.body;

		// Verifica que el nombre sea proporcionado
		if (!nombre) {
			return res
				.status(400)
				.json({ error: "El nombre del producto es requerido." });
		}

		const query =
			"INSERT INTO producto(nombre, precio) VALUES($1, $2) RETURNING *";
		const values = [nombre, precio];

		const result = await pool.query(query, values);

		res.json(result.rows[0]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
});

app.get("/hello", (req, res) => {
	res.send("Hello Vite + React!");
});

ViteExpress.listen(app, 3000, () =>
	console.log("Server is listening on port 3000...")
);
