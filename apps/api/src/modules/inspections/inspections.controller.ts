import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Inspection } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Controller('inspections')
@UseGuards(JwtAuthGuard)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto): Promise<Inspection> {
    return this.inspectionsService.create(createInspectionDto);
  }

  @Get()
  findAll(@Query() filter: FilterInspectionDto): Promise<PaginatedResult<Inspection>> {
    return this.inspectionsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Inspection | null> {
    return this.inspectionsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto
  ): Promise<Inspection> {
    return this.inspectionsService.update(id, updateInspectionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Inspection> {
    return this.inspectionsService.remove(id);
  }
}
