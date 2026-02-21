import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SegurosService } from './seguros.service';
import { CreateSeguroDto } from './dto/create-seguro.dto';
import { UpdateSeguroDto } from './dto/update-seguro.dto';
import { FilterSeguroDto } from './dto/filter-seguro.dto';

@ApiTags('seguros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('seguros')
export class SegurosController {
  constructor(private readonly service: SegurosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar apólice de seguro' })
  @ApiResponse({ status: 201, description: 'Seguro criado com sucesso' })
  create(@Body() dto: CreateSeguroDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar seguros com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista paginada de seguros' })
  findAll(@Query() filter: FilterSeguroDto) {
    return this.service.findAll(filter);
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar seguros ativos' })
  @ApiResponse({ status: 200, description: 'Seguros com status ACTIVE' })
  findActive() {
    return this.service.findActive();
  }

  @Get('vehicle/:vehicleId')
  @ApiOperation({ summary: 'Listar seguros de um veículo' })
  @ApiParam({ name: 'vehicleId', description: 'ID do veículo' })
  @ApiResponse({ status: 200, description: 'Seguros do veículo' })
  findByVehicle(@Param('vehicleId') vehicleId: string) {
    return this.service.findByVehicle(vehicleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar seguro por ID' })
  @ApiParam({ name: 'id', description: 'ID do seguro' })
  @ApiResponse({ status: 200, description: 'Seguro encontrado' })
  @ApiResponse({ status: 404, description: 'Seguro não encontrado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar apólice de seguro' })
  @ApiParam({ name: 'id', description: 'ID do seguro' })
  @ApiResponse({ status: 200, description: 'Seguro atualizado' })
  @ApiResponse({ status: 404, description: 'Seguro não encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateSeguroDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover apólice de seguro' })
  @ApiParam({ name: 'id', description: 'ID do seguro' })
  @ApiResponse({ status: 204, description: 'Seguro removido' })
  @ApiResponse({ status: 404, description: 'Seguro não encontrado' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
