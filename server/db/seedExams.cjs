const { getDb } = require('../db/db.cjs');

async function seedExams() {
    const db = await getDb();

    // Clear existing questions and exams to avoid duplicates
    await db.run('DELETE FROM questions');
    await db.run('DELETE FROM exams');

    // Module 2 Exam (Definiciones Formales)
    const m2Exam = await db.run('INSERT INTO exams (name, type) VALUES (?, ?)', ['Evaluación de Módulo 2: Teoría Formal', 'MODULE']);
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

    // Final Exam (20 Questions)
    const finalExam = await db.run('INSERT INTO exams (name, type) VALUES (?, ?)', ['Examen Final de Teoría de Autómatas (NFA/AFND)', 'FINAL']);
    const finalId = finalExam.lastID;

    const finalQuestions = [
        ['Si un AFND tiene n estados, el AFD equivalente puede tener hasta:', JSON.stringify(['n^2 estados', '2^n estados', 'n+1 estados', '2n estados']), '2^n estados'],
        ['La técnica para convertir AFND a AFD se llama:', JSON.stringify(['Subset Construction', 'Dijkstra', 'Recursión', 'Minimización']), 'Subset Construction'],
        ['¿Qué caracteriza a un AFND frente a un AFD?', JSON.stringify(['Usa menos memoria', 'Permite múltiples caminos para un mismo símbolo', 'Es más rápido de procesar', 'No tiene estados finales']), 'Permite múltiples caminos para un mismo símbolo'],
        ['Una transición ε permite:', JSON.stringify(['Terminar el proceso', 'Cambiar de estado sin leer entrada', 'Reiniciar el autómata', 'Borrar la entrada']), 'Cambiar de estado sin leer entrada'],
        ['Un lenguaje es reconocido por un autómata si:', JSON.stringify(['El autómata se detiene', 'Termina en un estado de aceptación F', 'Lee toda la cadena', 'Llega al estado inicial']), 'Termina en un estado de aceptación F'],
        ['¿Quién fue uno de los pioneros de la teoría de autómatas?', JSON.stringify(['Stephen Kleene', 'Isaac Newton', 'Nikola Tesla', 'Albert Einstein']), 'Stephen Kleene'],
        ['¿Qué es Σ*?', JSON.stringify(['El conjunto de estados', 'Todas las cadenas posibles sobre el alfabeto', 'La función de transición', 'El estado final']), 'Todas las cadenas posibles sobre el alfabeto'],
        ['La longitud de la cadena vacía ε es:', JSON.stringify(['1', 'No tiene longitud', '0', '-1']), '0'],
        ['Si Σ = {a, b}, ¿cuál de estas cadenas pertenece a Σ*?', JSON.stringify(['abc', 'ab', 'a2', '10']), 'ab'],
        ['En un diagrama de estados, el estado inicial se reconoce por:', JSON.stringify(['Un doble círculo', 'Una flecha entrante sin origen', 'Estar sombreado', 'Ser el círculo más grande']), 'Una flecha entrante sin origen'],
        ['Los estados finales en un diagrama se representan con:', JSON.stringify(['Un círculo punteado', 'Un doble círculo', 'Un cuadrado', 'Una X']), 'Un doble círculo'],
        ['¿Qué es un conjunto potencia P(Q)?', JSON.stringify(['El conjunto de todos los estados finales', 'El conjunto de todos los subconjuntos del conjunto Q', 'La suma de todos los estados', 'El historial de transiciones']), 'El conjunto de todos los subconjuntos del conjunto Q'],
        ['Un AFND nace de la necesidad de:', JSON.stringify(['Hacer programas más rápidos', 'Modelar procesos con decisiones no deterministas/paralelas', 'Gastar menos energía', 'Evitar errores humanos']), 'Modelar procesos con decisiones no deterministas/paralelas'],
        ['¿Cuál es la diferencia entre un símbolo y una cadena?', JSON.stringify(['Son lo mismo', 'El símbolo es atómico, la cadena es una secuencia', 'La cadena es circular', 'El símbolo es solo numérico']), 'El símbolo es atómico, la cadena es una secuencia'],
        ['La clausura épsilon (ε-closure) de un estado q incluye:', JSON.stringify(['Solo q', 'q y todos los estados alcanzables mediante saltos ε', 'Solo los estados finales', 'Ninguno']), 'q y todos los estados alcanzables mediante saltos ε'],
        ['En el algoritmo de subconjuntos, un nuevo estado es final si:', JSON.stringify(['Es el primero', 'Contiene al menos un estado final original', 'No tiene transiciones', 'Es el estado inicial']), 'Contiene al menos un estado final original'],
        ['Un lenguaje regular es aquel que:', JSON.stringify(['Se escribe en inglés', 'Puede ser reconocido por un autómata finito', 'No tiene límites', 'Se usa solo en IA']), 'Puede ser reconocido por un autómata finito'],
        ['¿Puede un AFD representar lenguajes que un AFND no puede?', JSON.stringify(['Sí', 'No, son equivalentes en poder', 'Solo lenguajes infinitos', 'Depende del hardware']), 'No, son equivalentes en poder'],
        ['Si δ(q0, a) = ∅, ¿qué sucede con esa rama de computación?', JSON.stringify(['Se reinicia', 'Se detiene/muere', 'Entra en bucle infinito', 'Acepta la cadena automáticamente']), 'Se detiene/muere'],
        ['¿Qué autor escribió "Introduction to Automata Theory"?', JSON.stringify(['Hopcroft', 'Sipser', 'Turing', 'Knuth']), 'Hopcroft']
    ];

    for (const q of finalQuestions) {
        await db.run('INSERT INTO questions (exam_id, text, options_json, correct_answer) VALUES (?, ?, ?, ?)', [finalId, ...q]);
    }

    console.log('Exam bank seeded with 20-question final exam.');
}

module.exports = { seedExams };
if (require.main === module) {
    seedExams().catch(console.error);
}
