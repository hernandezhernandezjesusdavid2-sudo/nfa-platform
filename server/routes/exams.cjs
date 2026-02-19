const express = require('express');
const { getDb } = require('../db/db.cjs');

const router = express.Router();

// Get exam by type
router.get('/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const db = await getDb();
        const exam = await db.get('SELECT * FROM exams WHERE type = ?', [type]);
        if (!exam) return res.status(404).json({ error: 'Examen no encontrado' });

        const questions = await db.all('SELECT id, text, options_json FROM questions WHERE exam_id = ?', [exam.id]);
        const formattedQuestions = questions.map(q => ({
            ...q,
            options: JSON.parse(q.options_json)
        }));

        res.json({ ...exam, questions: formattedQuestions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get exam by ID with questions
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDb();

        const exam = await db.get('SELECT * FROM exams WHERE id = ?', [id]);
        if (!exam) return res.status(404).json({ error: 'Examen no encontrado' });

        const questions = await db.all('SELECT id, text, options_json FROM questions WHERE exam_id = ?', [id]);
        const formattedQuestions = questions.map(q => ({
            ...q,
            options: JSON.parse(q.options_json)
        }));

        res.json({ ...exam, questions: formattedQuestions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit exam attempt
router.post('/:id/submit', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, answers } = req.body;
        const db = await getDb();

        const questions = await db.all('SELECT id, correct_answer FROM questions WHERE exam_id = ?', [id]);

        let correctCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correct_answer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);
        await db.run('INSERT INTO attempts (user_id, exam_id, score) VALUES (?, ?, ?)', [userId, id, score]);

        // If final exam and score >= 80, check if 100% progress for certificate
        const exam = await db.get('SELECT type FROM exams WHERE id = ?', [id]);
        let certificate = null;

        if (exam.type === 'FINAL' && score >= 80) {
            const progress = await db.get('SELECT COUNT(*) as count FROM progress WHERE user_id = ?', [userId]);
            const totalModules = await db.get('SELECT COUNT(*) as count FROM modules');

            if (progress.count === totalModules.count) {
                const folio = `NFA-${Date.now()}-${userId}`;
                const cert = await db.run('INSERT INTO certificates (user_id, folio) VALUES (?, ?)', [userId, folio]);
                certificate = { folio, date: new Date().toISOString() };
            }
        }

        res.json({ score, certificate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
