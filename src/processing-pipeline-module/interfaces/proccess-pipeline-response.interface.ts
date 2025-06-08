import { AiAnalysisResponseDto } from "src/ai/dto/ai-anlysis-response.dto";
import { FileType } from "src/files/interfaces/file-type.interface";

export interface PipelinePlainResponse {
    fileUploaded:   File;
    textExtraction: TextExtraction;
    aiAnalysis:     AiAnalysisResponseDto;
}


export interface File {
    id:          number;
    filename:    string;
    url:         string;
    type:        FileType;
    uploaded_at: Date;
    is_active:   Boolean;
    user:        User;
}

export interface User {
    id:        number;
    fullName:  string;
    email:     string;
    roles:     string[];
    createdAt: Date;
    isActive:  Boolean;
}

export interface TextExtraction {
    id:           number;
    raw_text:     string;
    extracted_at: Date;
    file:         File;
}
