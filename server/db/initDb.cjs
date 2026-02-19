const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

async function initDb() {
    const db = await open({
        filename: path.join(__dirname, 'database.sqlite'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'ALUMNO'
        );

        CREATE TABLE IF NOT EXISTS modules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            content_file TEXT
        );

        CREATE TABLE IF NOT EXISTS progress (
            user_id INTEGER,
            module_id INTEGER,
            status TEXT DEFAULT 'COMPLETED',
            PRIMARY KEY (user_id, module_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (module_id) REFERENCES modules(id)
        );

        CREATE TABLE IF NOT EXISTS exams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL -- 'MODULE' or 'FINAL'
        );

        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            exam_id INTEGER,
            text TEXT NOT NULL,
            options_json TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            FOREIGN KEY (exam_id) REFERENCES exams(id)
        );

        CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            exam_id INTEGER,
            score INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (exam_id) REFERENCES exams(id)
        );

        CREATE TABLE IF NOT EXISTS certificates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            folio TEXT UNIQUE NOT NULL,
            issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);

    // Create an admin user if not exists
    const adminExists = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    if (!adminExists) {
        const hash = await bcrypt.hash('admin123', 10);
        await db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin', hash, 'ADMIN']);
        console.log('Admin user created: admin / admin123');
    }

    // Insert modules
    const moduleCount = await db.get('SELECT COUNT(*) as count FROM modules');
    if (moduleCount.count === 0) {
        const moduleData = [
            ['Introducción a los Autómatas', 'Conceptos básicos de la teoría de la computación.', 'm1.json'],
            ['Definiciones Formales', 'La 5-tupla (Q, Σ, δ, q0, F).', 'm2.json'],
            ['El Alfabeto y Lenguajes', 'Cadenas, lenguajes y transiciones.', 'm3.json'],
            ['No Determinismo', 'Transiciones múltiples y transiciones vacías (ε).', 'm4.json'],
            ['Simulación de AFND', 'Seguimiento de conjuntos de estados activos.', 'm5.json'],
            ['Construcción por Subconjuntos', 'Algoritmo de conversión AFND a AFD.', 'm6.json'],
            ['Expresiones Regulares', 'Relación entre ER y Autómatas.', 'm7.json']
        ];
        for (const m of moduleData) {
            await db.run('INSERT INTO modules (title, description, content_file) VALUES (?, ?, ?)', m);
        }
    }

    console.log('Database initialized successfully.');
    return db;
}

if (require.main === module) {
    initDb().catch(err => {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    });
}

module.exports = { initDb };
