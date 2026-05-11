import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Delete()
  async clean() {
    await this.seedService.cleanDb();
    return {
      statusCode: HttpStatus.OK,
      message: 'ok',
    };
  }

  @Get(':limit')
  async populateDB(@Param('limit', ParseIntPipe) limit: number) {
    const { message } = await this.seedService.populateDB(limit);
    return {
      statusCode: HttpStatus.OK,
      message,
    };
  }
}
