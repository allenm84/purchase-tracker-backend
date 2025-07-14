import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function omitId<T extends { id: number }>(obj: T): Omit<T, 'id'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = obj;
  return rest;
}

export function isPrismaNotFoundError(e: any) {
  return e instanceof PrismaClientKnownRequestError && e.code === 'P2025';
}
