
import { BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';


export const analyzeLegalContract = async (contractText: string) => {
  const client = new OpenAI();

  const response = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: `Actúa como un analista legal experto en revisión de contratos No des introducción. Comienza directamente con el análisis y un pequeño.
              Analiza el siguiente contrato legal. Tu objetivo es:
              1. Identificar cláusulas ambiguas, abusivas o de alto riesgo.
              2. Detectar posibles omisiones importantes (garantías, fechas clave, penalizaciones, derechos y obligaciones de las partes).
              3. Resumir los puntos más importantes del contrato en lenguaje claro.
              4. Sugerir mejoras o cambios antes de firmar el contrato.
              Texto del contrato:
              ${contractText}`,
            })

    if (!response) throw new BadRequestException(`Something went wrong with IA`)

    const aiResponse: string = response.output_text
    return aiResponse
}