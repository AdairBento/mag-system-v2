import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { UploadFileDto, FileCategory } from './dto/upload-file.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('storage')
@ApiBearerAuth()
@Controller('storage')
@UseGuards(JwtAuthGuard)
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file (metadata + optional base64 content)' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'File uploaded' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  upload(@Body() dto: UploadFileDto) {
    return this.storageService.upload(dto);
  }

  @Get('files')
  @ApiOperation({ summary: 'List all files, optionally filtered by category' })
  @ApiQuery({ name: 'category', enum: FileCategory, required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of files' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  listFiles(@Query('category') category?: FileCategory) {
    return this.storageService.listFiles(category);
  }

  @Get('files/:id')
  @ApiOperation({ summary: 'Get file metadata by ID' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'File found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getFile(@Param('id') id: string) {
    return this.storageService.getFile(id);
  }

  @Delete('files/:id')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'id', description: 'File UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'File deleted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  deleteFile(@Param('id') id: string) {
    return this.storageService.deleteFile(id);
  }
}
