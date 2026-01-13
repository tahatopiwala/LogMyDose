const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface ApiError {
  message: string;
  code?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = localStorage.getItem("accessToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }

      const error: ApiError = await response.json().catch(() => ({
        message: "An unexpected error occurred",
      }));
      throw new Error(error.message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);

// Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface SubstanceCategory {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Substance {
  id: string;
  categoryId: string;
  name: string;
  aliases: string[];
  subcategory?: string;
  defaultDose?: number;
  doseUnit?: string;
  defaultFrequency?: string;
  administrationRoute?: string;
  preparationInstructions?: string;
  storageTemp?: string;
  storageNotes?: string;
  shelfLifeDays?: number;
  shelfLifeReconstitutedDays?: number;
  requiresCycling: boolean;
  commonCycleOnWeeks?: number;
  commonCycleOffWeeks?: number;
  contraindications: string[];
  commonSideEffects: string[];
  interactions: string[];
  onsetTimeline?: string;
  isPrescriptionRequired: boolean;
  isActive: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    displayName: string;
  };
}

export interface ProtocolTemplate {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  substanceId?: string;
  defaultDose?: number;
  doseUnit?: string;
  frequency?: string;
  titrationPlan?: Record<string, unknown>;
  cycleOnWeeks?: number;
  cycleOffWeeks?: number;
  difficultyLevel?: string;
  tags: string[];
  useCount: number;
  isPublic: boolean;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    displayName: string;
  };
  substance?: {
    id: string;
    name: string;
    doseUnit?: string;
  };
}

// API functions
export const substancesApi = {
  getCategories: () =>
    api.get<{ categories: SubstanceCategory[] }>("/substances/categories"),

  createCategory: (data: {
    name: string;
    displayName: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
  }) =>
    api.post<{ category: SubstanceCategory }>("/substances/categories", data),

  updateCategory: (
    id: string,
    data: Partial<{
      name: string;
      displayName: string;
      description?: string;
      icon?: string;
      sortOrder?: number;
      isActive?: boolean;
    }>,
  ) =>
    api.put<{ category: SubstanceCategory }>(
      `/substances/categories/${id}`,
      data,
    ),

  getSubstances: (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
  }) =>
    api.get<{ substances: Substance[]; pagination: Pagination }>(
      "/substances",
      params,
    ),

  getSubstance: (id: string) =>
    api.get<{ substance: Substance }>(`/substances/${id}`),

  createSubstance: (
    data: Omit<Substance, "id" | "isActive" | "createdAt" | "category">,
  ) => api.post<{ substance: Substance }>("/substances", data),

  updateSubstance: (
    id: string,
    data: Partial<Omit<Substance, "id" | "createdAt" | "category">>,
  ) => api.put<{ substance: Substance }>(`/substances/${id}`, data),
};

export const protocolsApi = {
  getTemplates: (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    substanceId?: string;
    difficulty?: string;
    search?: string;
  }) =>
    api.get<{ templates: ProtocolTemplate[]; pagination: Pagination }>(
      "/protocols/templates",
      params,
    ),

  getTemplate: (id: string) =>
    api.get<{ template: ProtocolTemplate }>(`/protocols/templates/${id}`),

  createTemplate: (
    data: Omit<
      ProtocolTemplate,
      "id" | "useCount" | "createdAt" | "category" | "substance"
    >,
  ) => api.post<{ template: ProtocolTemplate }>("/protocols/templates", data),

  updateTemplate: (
    id: string,
    data: Partial<
      Omit<
        ProtocolTemplate,
        "id" | "useCount" | "createdAt" | "category" | "substance"
      >
    >,
  ) =>
    api.put<{ template: ProtocolTemplate }>(`/protocols/templates/${id}`, data),

  deleteTemplate: (id: string) =>
    api.delete<void>(`/protocols/templates/${id}`),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; role: string };
    }>("/auth/login", { email, password }),

  logout: () => api.post<void>("/auth/logout"),
};
