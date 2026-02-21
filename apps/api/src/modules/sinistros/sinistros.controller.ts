import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SinistrosService } from './sinistros.service';
import { CreateSinistroDto } from './dto/create-sinistro.dto';
import { UpdateSinistroDto } from './dto/update-sinistro.dto';
import { FilterSinistroDto } from './dto/filter-sinistro.dto';
import { CreateSinistroDocumentDto } from './dto/create-sinistro-document.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('sinistros')
@ApiBearerAuth()
@Controller('sinistros')
@UseGuards(JwtAuthGuard)
export class SinistrosController {
  constructor(private readonly sinistrosService: SinistrosService) {}

  @Post()
  @ApiOperation({ summary: 'Create an accident record' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Accident created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  create(@Body() dto: CreateSinistroDto) {
    return this.sinistrosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accidents with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of accidents' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAll(@Query() filter: FilterSinistroDto) {
    return this.sinistrosService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an accident by ID' })
  @ApiParam({ name: 'id', description: 'Accident UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Accident found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.sinistrosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an accident' })
  @ApiParam({ name: 'id', description: 'Accident UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Accident updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateSinistroDto) {
    return this.sinistrosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an accident' })
  @ApiParam({ name: 'id', description: 'Accident UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Accident deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.sinistrosService.remove(id);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Add a document to an accident' })
  @ApiParam({ name: 'id', description: 'Accident UUID' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Document added' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  addDocument(@Param('id') id: string, @Body() dto: CreateSinistroDocumentDto) {
    return this.sinistrosService.addDocument(id, dto);
  }
}
