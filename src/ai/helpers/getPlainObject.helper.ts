import { plainToInstance } from "class-transformer"
import { AiAnalysisResponseDto } from "../dto/ai-anlysis-response.dto"
import { AiAnalysis } from "../entities/ai-analysis.entity"

 export function getPlainObject(aiAnalysis: AiAnalysis) {
    const response = plainToInstance(AiAnalysisResponseDto, {
        id: aiAnalysis.id,
        aiResponse: aiAnalysis.ai_response,
        textExtractionId: aiAnalysis.text_extraction.id,
        analyzedAt: aiAnalysis.analyzed_at,
        rawText: aiAnalysis.text_extraction.raw_text
      })

    return response
  }