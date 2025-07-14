import { Decimal } from '@prisma/client/runtime/library';
import { Purchase } from 'generated/prisma';
import { z } from 'zod';

const ZodDecimal = z
  .union([
    z.instanceof(Decimal),
    z.string().refine(
      (val) => {
        try {
          new Decimal(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid decimal string' },
    ),
    z.number().refine(
      (val) => {
        try {
          new Decimal(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid number for decimal' },
    ),
  ])
  .transform((val) => {
    return new Decimal(val);
  });

const ZodPositiveDecimal = ZodDecimal.refine((d) => d.greaterThanOrEqualTo(0), {
  message: 'Amount must be positive',
});

export const PurchaseTypeEnum = z.enum(['Debit', 'Credit']);

export const PurchaseSchema = z.object({
  amount: ZodPositiveDecimal,
  date: z.coerce.date(),
  gameId: z.number().int().positive(),
  type: PurchaseTypeEnum,
});

export type CreatePurchaseDTO = Omit<Purchase, 'id'>;
