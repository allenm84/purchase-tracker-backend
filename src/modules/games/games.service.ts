import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDTO } from './games.schema';
import { Game } from '@prisma/client';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async getGames(): Promise<Game[]> {
    return await this.prisma.game.findMany();
  }

  async getGameById(id: number): Promise<Game | null> {
    return await this.prisma.game.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createNewGame(data: CreateGameDTO): Promise<Game> {
    return await this.prisma.game.create({ data: data });
  }

  async deleteGame(id: number): Promise<Game> {
    return await this.prisma.game.delete({ where: { id: id } });
  }
}
