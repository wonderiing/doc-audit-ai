
import OpenAI from 'openai';


export const analyzeFileText = async (rawText: string) => {
  const client = new OpenAI();

  const response = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: `Analiza el siguiente documento en profundidad. Quiero que actúes como un auditor experto y me entregues la siguiente información:
              Resumen ejecutivo: Un resumen claro y conciso del contenido del documento.
              Tendencias (Si detectas que el archivo es un csv o excel): Identifica valores atipicos, muestre tendencias, Si contiene métricas financieras, de ventas o desempeño, identifica KPIs o posibles alertas.
              Riesgos o alertas: Señala cualquier inconsistencia, ambigüedad, error, falta de evidencia o riesgo potencial.
              Puntos fuertes y débiles: Resume los elementos mejor desarrollados y los que requieren mejora.
              Aspectos legales, éticos o de cumplimiento (si aplica): Observaciones relacionadas con normativas o buenas prácticas.
              Recomendaciones: Sugerencias para mejorar el contenido o la estructura del documento.
              Si detectas algo adicional que sea relevante para una auditoría documental (como tono, sesgos, formato, falta de fuentes, etc.), inclúyelo también.
              Aquí está el documento para analizar:
              ${rawText}`,
            })

    const aiResponse: string = response.output_text
    return aiResponse
}