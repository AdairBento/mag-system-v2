import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { FilterVehicleDto } from './dto/filter-vehicle.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}
  @Post() async create(@Body() createVehicleDto: CreateVehicleDto): Promise<any> {
    return this.vehiclesService.create(createVehicleDto);
  }
  @Get() async findAll(@Query() filter: FilterVehicleDto): Promise<any> {
    return this.vehiclesService.findAll(filter);
  }
  @Get(':id') async findOne(@Param('id') id: string): Promise<any> {
    return this.vehiclesService.findOne(id);
  }
  @Put(':id') async update(
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto
  ): Promise<any> {
    return this.vehiclesService.update(id, updateVehicleDto);
  }
  @Delete(':id') async remove(@Param('id') id: string): Promise<any> {
    return this.vehiclesService.remove(id);
  }
}
