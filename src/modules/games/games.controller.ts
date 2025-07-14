import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { Game } from '@prisma/client';
import { CreateGameDTO, GameSchema } from './games.schema';
import { isPrismaNotFoundError } from '../shared/helpers';

@Controller('games')
export class GamesController {
  constructor(private readonly service: GamesService) {}

  @Get()
  async getGames(): Promise<Game[]> {
    return await this.service.getGames();
  }

  @Get(':id')
  async getGame(@Param('id', ParseIntPipe) id: number): Promise<Game> {
    const result = await this.service.getGameById(id);
    if (result === null) {
      throw new NotFoundException(`A game with id ${id} was not found`);
    }
    return result;
  }

  @Post()
  async createNewGame(@Body() data: CreateGameDTO): Promise<Game> {
    const parsed = GameSchema.safeParse(data);
    if (parsed.success === false) {
      throw new BadRequestException(parsed.error);
    }
    return await this.service.createNewGame(parsed.data);
  }

  @Delete(':id')
  async deleteGame(@Param('id', ParseIntPipe) id: number) {
    try {
      const game = await this.service.deleteGame(id);
      return {
        message: `Game with ID ${id} successfully deleted.`,
        game: game,
      };
    } catch (e) {
      if (isPrismaNotFoundError(e)) {
        throw new NotFoundException(`Game with ID ${id} not found.`);
      }
    }
  }
}
