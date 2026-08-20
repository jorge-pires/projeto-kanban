import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getNationalHolidays } from "@/lib/services/holidays";

interface MockResponseOptions {
  data?: unknown;
  ok?: boolean;
  status?: number;
  statusText?: string;
}

function createMockResponse({
  data = null,
  ok = true,
  status = 200,
  statusText = "OK",
}: MockResponseOptions = {}) {
  return {
    ok,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

const fetchMock = vi.fn<typeof fetch>();

describe("getNationalHolidays", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);

    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("rejects an unsupported year without calling the API", async () => {
    const result = await getNationalHolidays(1999);

    expect(result).toEqual({
      holidays: [],
      error: "O ano informado não é válido.",
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns validated national holidays", async () => {
    const responseData = [
      {
        date: "2026-01-01",
        name: "Confraternização mundial",
        type: "national",
      },
      {
        date: "2026-04-21",
        name: "Tiradentes",
        type: "national",
      },
    ];

    fetchMock.mockResolvedValue(
      createMockResponse({
        data: responseData,
      }),
    );

    const result = await getNationalHolidays(2026);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://brasilapi.com.br/api/feriados/v1/2026",
      {
        headers: {
          Accept: "application/json",
        },
        next: {
          revalidate: 60 * 60 * 24,
        },
      },
    );

    expect(result).toEqual({
      holidays: responseData,
      error: null,
    });
  });

  it("handles an unsuccessful HTTP response", async () => {
    fetchMock.mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 503,
        statusText: "Service Unavailable",
      }),
    );

    const result = await getNationalHolidays(2026);

    expect(result).toEqual({
      holidays: [],
      error: "O calendário de feriados está temporariamente indisponível.",
    });
  });

  it("rejects an invalid API response", async () => {
    fetchMock.mockResolvedValue(
      createMockResponse({
        data: [
          {
            date: "data-inválida",
            name: "",
            type: "national",
          },
        ],
      }),
    );

    const result = await getNationalHolidays(2026);

    expect(result).toEqual({
      holidays: [],
      error: "A API retornou dados em um formato inesperado.",
    });
  });

  it("handles a network failure", async () => {
    fetchMock.mockRejectedValue(new Error("Network unavailable"));

    const result = await getNationalHolidays(2026);

    expect(result).toEqual({
      holidays: [],
      error:
        "Não foi possível consultar os feriados. Tente novamente mais tarde.",
    });
  });
});
