import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Purchase } from '@prisma/client';
import { CreatePurchaseDTO } from './purchases.schema';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPurchases(): Promise<Purchase[]> {
    return await this.prisma.purchase.findMany();
  }

  async getPurhcasesByGame(gameId: number): Promise<Purchase[]> {
    return await this.prisma.purchase.findMany({
      where: {
        gameId: gameId,
      },
    });
  }

  async getPurchaseByYear(year: number): Promise<Purchase[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    return await this.prisma.purchase.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }

  async createNewPurchase(data: CreatePurchaseDTO): Promise<Purchase> {
    return await this.prisma.purchase.create({ data: data });
  }

  async deletePurchase(id: number): Promise<Purchase> {
    return await this.prisma.purchase.delete({
      where: {
        id: id,
      },
    });
  }
}
