import { z } from "zod";

const holidaySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "A data do feriado é inválida."),
  name: z.string().min(1),
  type: z.string().min(1),
});

const holidaysSchema = z.array(holidaySchema);

export type Holiday = z.infer<typeof holidaySchema>;

export interface HolidaysResult {
  holidays: Holiday[];
  error: string | null;
}

export async function getNationalHolidays(
  year: number,
): Promise<HolidaysResult> {
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return {
      holidays: [],
      error: "O ano informado não é válido.",
    };
  }

  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/feriados/v1/${year}`,
      {
        headers: {
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5_000),
        next: {
          revalidate: 60 * 60 * 24,
        },
      },
    );

    if (!response.ok) {
      console.error(
        "BrasilAPI request failed:",
        response.status,
        response.statusText,
      );

      return {
        holidays: [],
        error: "O calendário de feriados está temporariamente indisponível.",
      };
    }

    const data: unknown = await response.json();
    const validation = holidaysSchema.safeParse(data);

    if (!validation.success) {
      console.error("Invalid BrasilAPI response:", validation.error.flatten());

      return {
        holidays: [],
        error: "A API retornou dados em um formato inesperado.",
      };
    }

    return {
      holidays: validation.data,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch national holidays:", error);

    return {
      holidays: [],
      error:
        "Não foi possível consultar os feriados. Tente novamente mais tarde.",
    };
  }
}
