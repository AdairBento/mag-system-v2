import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { FilterRentalDto } from './dto/filter-rental.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Rental } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Controller('rentals')
@UseGuards(JwtAuthGuard)
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(@Body() createRentalDto: CreateRentalDto): Promise<Rental> {
    return this.rentalsService.create(createRentalDto);
  }

  @Get()
  findAll(@Query() filter: FilterRentalDto): Promise<PaginatedResult<Rental>> {
    return this.rentalsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Rental | null> {
    return this.rentalsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRentalDto: UpdateRentalDto): Promise<Rental> {
    return this.rentalsService.update(id, updateRentalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Rental> {
    return this.rentalsService.remove(id);
  }
}
