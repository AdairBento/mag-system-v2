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
import { MultasService } from './multas.service';
import { CreateMultaDto } from './dto/create-multa.dto';
import { UpdateMultaDto } from './dto/update-multa.dto';
import { FilterMultaDto } from './dto/filter-multa.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('multas')
@ApiBearerAuth()
@Controller('multas')
@UseGuards(JwtAuthGuard)
export class MultasController {
  constructor(private readonly multasService: MultasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a fine record' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Fine created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  create(@Body() dto: CreateMultaDto) {
    return this.multasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fines with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of fines' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAll(@Query() filter: FilterMultaDto) {
    return this.multasService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a fine by ID' })
  @ApiParam({ name: 'id', description: 'Fine UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fine found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.multasService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a fine' })
  @ApiParam({ name: 'id', description: 'Fine UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fine updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateMultaDto) {
    return this.multasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a fine' })
  @ApiParam({ name: 'id', description: 'Fine UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Fine deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.multasService.remove(id);
  }
}
