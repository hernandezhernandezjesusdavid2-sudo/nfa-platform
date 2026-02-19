const express = require('express');
const { getDb } = require('../db/db.cjs');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get all modules (with user progress)
router.get('/', async (req, res) => {
    try {
        const userId = req.query.userId;
        const db = await getDb();
        const modules = await db.all('SELECT * FROM modules');

        let completedIds = [];
        if (userId) {
            const progress = await db.all('SELECT module_id FROM progress WHERE user_id = ?', [userId]);
            completedIds = progress.map(p => p.module_id);
        }

        const result = modules.map(m => ({
            ...m,
            completed: completedIds.includes(m.id)
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get module content
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();
        const module = await db.get('SELECT * FROM modules WHERE id = ?', [id]);
        if (!module) return res.status(404).json({ error: 'Módulo no encontrado' });

        const contentPath = path.join(__dirname, '../content', module.content_file);
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

        res.json({ ...module, content: content.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mark module as completed
router.post('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const db = await getDb();

        await db.run('INSERT OR IGNORE INTO progress (user_id, module_id) VALUES (?, ?)', [userId, id]);
        res.json({ message: 'Progreso guardado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
