import { Game } from 'generated/prisma';
import { z } from 'zod';

export const GameSchema = z.object({
  name: z.string().min(1),
  releaseDate: z.coerce.date(),
});

export type CreateGameDTO = Omit<Game, 'id'>;
