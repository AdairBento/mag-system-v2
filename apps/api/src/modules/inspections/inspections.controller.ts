import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { FilterInspectionDto } from './dto/filter-inspection.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('inspections')
@Controller('inspections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}
  @Post() async create(@Body() dto: CreateInspectionDto): Promise<any> {
    return this.inspectionsService.create(dto);
  }
  @Get() async findAll(@Query() filter: FilterInspectionDto): Promise<any> {
    return this.inspectionsService.findAll(filter);
  }
  @Get(':id') async findOne(@Param('id') id: string): Promise<any> {
    return this.inspectionsService.findOne(id);
  }
  @Put(':id') async update(
    @Param('id') id: string,
    @Body() dto: UpdateInspectionDto
  ): Promise<any> {
    return this.inspectionsService.update(id, dto);
  }
  @Delete(':id') async remove(@Param('id') id: string): Promise<any> {
    return this.inspectionsService.remove(id);
  }
}
