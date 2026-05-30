import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { notifyOwner } from "./_core/notification";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  products: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.category && input.category !== "all") {
          return getProductsByCategory(input.category);
        }
        return getAllProducts();
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
        return product;
      }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          brand: z.string().min(1),
          category: z.enum(["serum", "cream", "toner", "mask", "cleanser", "eye_care", "sunscreen", "other"]),
          description: z.string().optional(),
          ingredients: z.string().optional(),
          usage: z.string().optional(),
          price: z.string(),
          imageUrl: z.string().optional(),
          inStock: z.number().default(1),
        })
      )
      .mutation(async ({ input }) => {
        await createProduct(input as any);
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          brand: z.string().optional(),
          category: z.enum(["serum", "cream", "toner", "mask", "cleanser", "eye_care", "sunscreen", "other"]).optional(),
          description: z.string().optional(),
          ingredients: z.string().optional(),
          usage: z.string().optional(),
          price: z.string().optional(),
          imageUrl: z.string().optional(),
          inStock: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateProduct(id, data as any);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteProduct(input.id);
        return { success: true };
      }),
  }),

  orders: router({
    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(1, "Введите имя"),
          customerPhone: z.string().min(7, "Введите номер телефона"),
          deliveryAddress: z.string().min(5, "Введите адрес доставки"),
          paymentMethod: z.enum(["kaspi_red", "cash"]),
          items: z.array(
            z.object({
              productId: z.number(),
              name: z.string(),
              price: z.number(),
              quantity: z.number().min(1),
            })
          ).min(1, "Корзина пуста"),
          totalAmount: z.number(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const order = await createOrder({
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          deliveryAddress: input.deliveryAddress,
          paymentMethod: input.paymentMethod,
          items: input.items,
          totalAmount: input.totalAmount.toFixed(2),
          notes: input.notes,
        } as any);

        // Notify owner
        const itemsList = input.items
          .map((i) => `• ${i.name} × ${i.quantity} — ${(i.price * i.quantity).toLocaleString("ru-KZ")} ₸`)
          .join("\n");
        await notifyOwner({
          title: `🛍️ Новый заказ от ${input.customerName}`,
          content: `Телефон: ${input.customerPhone}\nАдрес: ${input.deliveryAddress}\nОплата: ${input.paymentMethod === "kaspi_red" ? "Kaspi Red" : "Наличные"}\n\nТовары:\n${itemsList}\n\nИтого: ${input.totalAmount.toLocaleString("ru-KZ")} ₸`,
        });

        return { success: true, orderId: order?.id };
      }),

    list: adminProcedure.query(async () => {
      return getAllOrders();
    }),

    get: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await getOrderById(input.id);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        return order;
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "confirmed", "processing", "shipped", "delivered", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  chat: router({
    message: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const systemPrompt = `Ты — AI-помощник магазина Amor Skincare, премиального магазина корейской и европейской косметики в Казахстане.

Информация о магазине:
- Название: Amor Skincare
- Слоган: "Твой premium skincare space"
- Локации: Уральск — ТРЦ Атриум; Аксай — Asia Plaza
- WhatsApp: wa.me/7774779779 (номер: +7 777 477 97 79)
- Режим работы: Пн-Вс 10:00–21:00
- Оплата: Kaspi Red, наличные

Бренды в магазине: Rorobell, Unleashia, rom&nd, JUST, VT, Davines, Biodance, Ederra lab, Angiopharm, Axis Y, La Sultan, Embrace, Genosys.

Категории товаров: сыворотки, кремы, тонеры, маски, очищающие средства, уход за глазами, солнцезащитные кремы.

Ты помогаешь клиентам:
1. Подобрать подходящие средства для их типа кожи и проблем
2. Ответить на вопросы о составах и применении
3. Рассказать о брендах и их особенностях
4. Предоставить информацию о магазине, доставке и оплате
5. Помочь с составлением рутины ухода за кожей

Отвечай на русском языке. Будь дружелюбным, профессиональным и полезным. Давай конкретные рекомендации. Если клиент спрашивает о конкретном товаре или хочет сделать заказ, направь его в каталог или предложи написать в WhatsApp.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
        });

        const rawContent = response.choices[0]?.message?.content;
        const content = typeof rawContent === 'string' ? rawContent : "Извините, не могу ответить прямо сейчас. Пожалуйста, напишите нам в WhatsApp: wa.me/7774779779";
        return { content };
      }),
  }),
});

export type AppRouter = typeof appRouter;
