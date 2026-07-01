import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Registra una actividad generada por IA en el colegio del usuario actual.
 * @param {string} colegioId - El ID del colegio al que pertenece el usuario.
 * @param {string} tipo - 'evaluacion', 'rubrica', o 'planificacion'.
 * @param {string} asignatura - La asignatura seleccionada.
 * @param {string} nivel - El nivel escolar (ej: '1° Medio').
 * @param {string} oaId - El identificador del OA trabajado (ej: 'OA 3').
 */
export async function logActividadColegio(colegioId, tipo, asignatura, nivel, oaId) {
  if (!colegioId) return; // Si no pertenece a un colegio, no se loguea en la analítica B2B
  
  try {
    // Si oaId viene con texto como "OA 3: Analizar...", extraemos solo "OA 3"
    let cleanOa = oaId || 'Sin OA';
    if (cleanOa.includes(':')) {
      cleanOa = cleanOa.split(':')[0].trim();
    }

    await addDoc(collection(db, 'actividad_colegios'), {
      colegioId,
      tipo,
      asignatura: asignatura || 'General',
      nivel: nivel || 'General',
      oaId: cleanOa,
      userId: auth.currentUser?.uid || 'unknown',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging activity to Firebase:", error);
  }
}
