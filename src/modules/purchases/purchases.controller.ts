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
import { PurchasesService } from './purchases.service';
import { Purchase } from '@prisma/client';
import { CreatePurchaseDTO, PurchaseSchema } from './purchases.schema';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { isPrismaNotFoundError } from '../shared/helpers';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Get()
  async getPurchases(): Promise<Purchase[]> {
    return await this.service.getPurchases();
  }

  @Get(':gameId')
  async getPurchasesByGame(
    @Param('gameId', ParseIntPipe) gameId: number,
  ): Promise<Purchase[]> {
    return await this.service.getPurhcasesByGame(gameId);
  }

  @Get(':year')
  async getPurchasesByYear(
    @Param('year', ParseIntPipe) year: number,
  ): Promise<Purchase[]> {
    return await this.service.getPurchaseByYear(year);
  }

  @Post()
  async createPurchase(@Body() data: CreatePurchaseDTO): Promise<Purchase> {
    const parsed = PurchaseSchema.safeParse(data);
    if (parsed.success === false) {
      throw new BadRequestException(parsed.error);
    }
    return await this.service.createNewPurchase(parsed.data);
  }

  @Delete(':id')
  async deletePurchase(@Param('id', ParseIntPipe) id: number) {
    try {
      const purchase = await this.service.deletePurchase(id);
      return {
        message: `Purchase with ID ${id} successfully deleted.`,
        purchase,
      };
    } catch (e) {
      if (isPrismaNotFoundError(e)) {
        throw new NotFoundException(`Purchase with ID ${id} not found.`);
      }
    }
  }
}
