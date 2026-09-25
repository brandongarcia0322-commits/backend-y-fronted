import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(12, { message: 'La contraseña debe tener mínimo 12 caracteres' }),
  fullName: z.string().min(2, { message: 'El nombre es requerido' }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
});

export const AddToCartSchema = z.object({
  variantId: z.string().uuid({ message: 'ID de variante inválido' }),
  quantity: z.number().int().positive().max(10, { message: 'Máximo 10 prendas por ítem' }),
});

export const CreateCheckoutSchema = z.object({
  items: z.array(AddToCartSchema).min(1, { message: 'El carrito no puede estar vacío' }),
});