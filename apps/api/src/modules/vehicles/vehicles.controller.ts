import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Vehicle } from '@mag-system/database';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll(@Query() filter: FilterVehicleDto): Promise<PaginatedResult<Vehicle>> {
    return this.vehiclesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Vehicle | null> {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Vehicle> {
    return this.vehiclesService.remove(id);
  }
}
