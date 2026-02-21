import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { FilterSettingDto } from './dto/filter-setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('settings')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a setting' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Setting created' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  create(@Body() dto: CreateSettingDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all settings with pagination' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of settings' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findAll(@Query() filter: FilterSettingDto) {
    return this.settingsService.findAll(filter);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get a setting by key' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Setting found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put('key/:key')
  @ApiOperation({ summary: 'Upsert a setting by key' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Setting upserted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  upsert(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.upsert(key, dto.value ?? '', dto.type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a setting by ID' })
  @ApiParam({ name: 'id', description: 'Setting UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Setting found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.settingsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a setting' })
  @ApiParam({ name: 'id', description: 'Setting UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Setting updated' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() dto: UpdateSettingDto) {
    return this.settingsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a setting' })
  @ApiParam({ name: 'id', description: 'Setting UUID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Setting deleted' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.settingsService.remove(id);
  }
}
