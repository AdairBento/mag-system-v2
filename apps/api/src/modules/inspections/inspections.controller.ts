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
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Inspection } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@ApiTags('inspections')
@ApiBearerAuth()
@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inspection' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inspection successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  create(@Body() createInspectionDto: CreateInspectionDto): Promise<Inspection> {
    return this.inspectionsService.create(createInspectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspections with pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of inspections retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  findAll(@Query() filter: FilterInspectionDto): Promise<PaginatedResult<Inspection>> {
    return this.inspectionsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an inspection by ID' })
  @ApiParam({ name: 'id', description: 'Inspection UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inspection found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  findOne(@Param('id') id: string): Promise<Inspection | null> {
    return this.inspectionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an inspection' })
  @ApiParam({ name: 'id', description: 'Inspection UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inspection successfully updated',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto
  ): Promise<Inspection> {
    return this.inspectionsService.update(id, updateInspectionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an inspection' })
  @ApiParam({ name: 'id', description: 'Inspection UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inspection successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Inspection not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - JWT token required',
  })
  remove(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionsService.remove(id);
  }
}
