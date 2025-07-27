
import { BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';


export const analazyData = async (data: string) => {
  const client = new OpenAI();

  const response = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: `Actúa como un analista de datos empresariales especializado en detectar patrones y riesgos  No des introducción y comienza con un pequeño resumen.
                Analiza los siguientes datos cargados desde un archivo CSV o Excel. Tu objetivo es:
                1. Identificar tendencias importantes (por ejemplo: aumento o disminución de ventas, comportamiento de clientes, etc.).
                2. Detectar anomalías o valores atípicos.
                3. Proporcionar estadísticas clave (totales, promedios, máximos, mínimos).
                4. Ofrecer recomendaciones accionables basadas en los datos.
                Contenido del archivo:
              ${data}`,
            })

    if (!response) throw new BadRequestException(`Something went wrong with IA`)

    const aiResponse: string = response.output_text
    return aiResponse
}