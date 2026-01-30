import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Driver } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  create(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  findAll(@Query() filter: FilterDriverDto): Promise<PaginatedResult<Driver>> {
    return this.driversService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Driver | null> {
    return this.driversService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto): Promise<Driver> {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Driver> {
    return this.driversService.remove(id);
  }
}
