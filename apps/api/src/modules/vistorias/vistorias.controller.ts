import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { VistoriasService } from './vistorias.service';
import { CreateDamageDto } from './dto/create-damage.dto';
import { UpdateDamageDto } from './dto/update-damage.dto';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('vistorias')
@ApiBearerAuth()
@Controller('vistorias')
@UseGuards(JwtAuthGuard)
export class VistoriasController {
  constructor(private readonly vistoriasService: VistoriasService) {}

  // ── Damages ───────────────────────────────────────────────────────────────
  @Post('damages')
  @ApiOperation({ summary: 'Record a damage' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Damage created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  createDamage(@Body() dto: CreateDamageDto) {
    return this.vistoriasService.createDamage(dto);
  }

  @Get('damages/:inspectionId')
  @ApiOperation({ summary: 'Get damages for an inspection' })
  @ApiParam({ name: 'inspectionId', description: 'Inspection UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of damages' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findDamagesByInspection(@Param('inspectionId') inspectionId: string) {
    return this.vistoriasService.findDamagesByInspection(inspectionId);
  }

  @Patch('damages/:id')
  @ApiOperation({ summary: 'Update a damage' })
  @ApiParam({ name: 'id', description: 'Damage UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Damage updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  updateDamage(@Param('id') id: string, @Body() dto: UpdateDamageDto) {
    return this.vistoriasService.updateDamage(id, dto);
  }

  @Delete('damages/:id')
  @ApiOperation({ summary: 'Delete a damage' })
  @ApiParam({ name: 'id', description: 'Damage UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Damage deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  removeDamage(@Param('id') id: string) {
    return this.vistoriasService.removeDamage(id);
  }

  // ── Photos ────────────────────────────────────────────────────────────────
  @Post('photos')
  @ApiOperation({ summary: 'Upload a photo for an inspection' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Photo created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  createPhoto(@Body() dto: CreatePhotoDto) {
    return this.vistoriasService.createPhoto(dto);
  }

  @Get('photos/:inspectionId')
  @ApiOperation({ summary: 'Get photos for an inspection' })
  @ApiParam({ name: 'inspectionId', description: 'Inspection UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of photos' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findPhotosByInspection(@Param('inspectionId') inspectionId: string) {
    return this.vistoriasService.findPhotosByInspection(inspectionId);
  }

  @Delete('photos/:id')
  @ApiOperation({ summary: 'Delete a photo' })
  @ApiParam({ name: 'id', description: 'Photo UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Photo deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  removePhoto(@Param('id') id: string) {
    return this.vistoriasService.removePhoto(id);
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  @Get('summary/:inspectionId')
  @ApiOperation({ summary: 'Get inspection summary (damages + photos)' })
  @ApiParam({ name: 'inspectionId', description: 'Inspection UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Inspection summary' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  getInspectionSummary(@Param('inspectionId') inspectionId: string) {
    return this.vistoriasService.getInspectionSummary(inspectionId);
  }
}
