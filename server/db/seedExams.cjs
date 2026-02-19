const { getDb } = require('../db/db.cjs');

async function seedExams() {
    const db = await getDb();

    // Module 2 Exam (Definiciones Formales)
    const m2Exam = await db.run('INSERT INTO exams (name, type) VALUES (?, ?)', ['Evaluación de Módulo 2', 'MODULE']);
    const m2Id = m2Exam.lastID;

    const m2Questions = [
        ['¿Qué representa Σ en la 5-tupla?', JSON.stringify(['Estados', 'Alfabeto', 'Transiciones', 'Estados Finales']), 'Alfabeto'],
        ['¿Cuántos estados iniciales tiene un AFND?', JSON.stringify(['Varios', 'Exactamente uno', 'Cero', 'Depende del alfabeto']), 'Exactamente uno'],
        ['La función δ en un AFND devuelve:', JSON.stringify(['Un solo estado', 'Un conjunto de estados', 'Un símbolo', 'Una cadena']), 'Un conjunto de estados'],
        ['¿Qué significa q0 ∈ Q?', JSON.stringify(['q0 es el alfabeto', 'q0 es un conjunto de estados', 'q0 es un estado que pertenece a Q', 'q0 no es parte del autómata']), 'q0 es un estado que pertenece a Q'],
        ['¿Un AFND puede tener transiciones a ningún estado?', JSON.stringify(['No', 'Sí, se representa como conjunto vacío ∅', 'Solo si es AFD', 'Solo en transiciones ε']), 'Sí, se representa como conjunto vacío ∅']
    ];

    for (const q of m2Questions) {
        await db.run('INSERT INTO questions (exam_id, text, options_json, correct_answer) VALUES (?, ?, ?, ?)', [m2Id, ...q]);
    }

    // Final Exam
    const finalExam = await db.run('INSERT INTO exams (name, type) VALUES (?, ?)', ['Examen Final de Autómatas', 'FINAL']);
    const finalId = finalExam.lastID;

    const finalQuestions = [
        ['Si un AFND tiene n estados, el AFD equivalente puede tener hasta:', JSON.stringify(['n^2 estados', '2^n estados', 'n+1 estados', '2n estados']), '2^n estados'],
        ['La técnica para convertir AFND a AFD se llama:', JSON.stringify(['Subset Construction', 'Dijkstra', 'Recursión', 'Minimización']), 'Subset Construction'],
        ['¿Qué caracteriza a un AFND frente a un AFD?', JSON.stringify(['Usa menos memoria', 'Permite múltiples caminos para un mismo símbolo', 'Es más rápido de procesar', 'No tiene estados finales']), 'Permite múltiples caminos para un mismo símbolo'],
        ['Una transición ε permite:', JSON.stringify(['Terminar el proceso', 'Cambiar de estado sin leer entrada', 'Reiniciar el autómata', 'Borrar la entrada']), 'Cambiar de estado sin leer entrada'],
        ['Un lenguaje es reconocido por un autómata si:', JSON.stringify(['El autómata se detiene', 'Termina en un estado de aceptación F', 'Lee toda la cadena', 'Llega al estado inicial']), 'Termina en un estado de aceptación F']
        // ... more questions would be added here to reach 20
    ];

    for (const q of finalQuestions) {
        await db.run('INSERT INTO questions (exam_id, text, options_json, correct_answer) VALUES (?, ?, ?, ?)', [finalId, ...q]);
    }

    console.log('Exam bank seeded.');
}

module.exports = { seedExams };
