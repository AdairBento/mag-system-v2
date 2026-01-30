import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FilterDriverDto } from './dto/filter-driver.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('drivers')
@Controller('drivers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo motorista' })
  async create(@Body() createDriverDto: CreateDriverDto): Promise<any> {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os motoristas' })
  async findAll(@Query() filter: FilterDriverDto): Promise<any> {
    return this.driversService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar motorista por ID' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.driversService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar motorista' })
  async update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto): Promise<any> {
    return this.driversService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar motorista' })
  async remove(@Param('id') id: string): Promise<any> {
    return this.driversService.remove(id);
  }
}
