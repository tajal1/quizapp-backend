import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { SyllabusService } from './syllabus.service';
import { CreateSyllabusDto } from './dto/create-syllabus.dto';
import { UpdateSyllabusDto } from './dto/update-syllabus.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('syllabus')
export class SyllabusController {
  constructor(private readonly syllabusService: SyllabusService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Res() res: any) {
    if (!file) throw new Error('No file uploaded');
      const tempImagePath = "/Users/mdtajalislam/Documents/Founding/quizapp-backend/src/modules/syllabus/rename.png";

    const result = await this.syllabusService.extractTextFromImage(tempImagePath)
    const parseText = await this.syllabusService.parseOcrResult(result)
    console.log('=========result', result)
    // const result = await this.syllabusService.extractPDFToJSON(file.buffer);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.json(parseText);
  }
}
