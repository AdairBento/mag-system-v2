import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('rentals')
@Controller('rentals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}
  @Post() async create(@Body() dto: CreateRentalDto): Promise<any> { return this.rentalsService.create(dto); }
  @Get() async findAll(@Query() filter: FilterRentalDto): Promise<any> { return this.rentalsService.findAll(filter); }
  @Get(':id') async findOne(@Param('id') id: string): Promise<any> { return this.rentalsService.findOne(id); }
  @Put(':id') async update(@Param('id') id: string, @Body() dto: UpdateRentalDto): Promise<any> { return this.rentalsService.update(id, dto); }
  @Delete(':id') async remove(@Param('id') id: string): Promise<any> { return this.rentalsService.remove(id); }
}
