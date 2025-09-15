import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import {
  ApiResponse,
  MenuResponse,
  Order,
  OrderFormData,
  User,
  Flight,
  DietaryProfile,
  AnalyticsData,
  ApiError,
} from '@/types';

class ApiService {
  private api: AxiosInstance;
  private retryCount = 0;
  private maxRetries = 3;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error('[ApiService] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        this.retryCount = 0;
        return response;
      },
      async (error) => {
        console.error('[ApiService] Response error:', error);
        
        if (this.shouldRetry(error) && this.retryCount < this.maxRetries) {
          this.retryCount++;
          console.log(`[ApiService] Retrying request (${this.retryCount}/${this.maxRetries})`);
          return this.api.request(error.config);
        }

        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private shouldRetry(error: any): boolean {
    return (
      error.response?.status >= 500 ||
      error.code === 'ECONNABORTED' ||
      error.code === 'NETWORK_ERROR'
    );
  }

  private handleError(error: any): void {
    const message = this.getErrorMessage(error);
    toast.error(message);
    
    // Log error for debugging
    console.error('[ApiService] API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      method: error.config?.method,
    });
  }

  private getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.response?.status === 401) {
      return 'Authentication required. Please log in again.';
    }
    
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.response?.status === 404) {
      return 'The requested resource was not found.';
    }
    
    if (error.response?.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please check your connection and try again.';
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private async makeRequest<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.api.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Menu API
  async getMenu(
    flightNumber: string,
    date: string,
    cabinClass: string,
    dietaryRestrictions?: string[]
  ): Promise<MenuResponse> {
    const params = new URLSearchParams({
      flightNumber,
      date,
      cabinClass,
      ...(dietaryRestrictions && { dietaryRestrictions: dietaryRestrictions.join(',') }),
    });

    const response = await this.makeRequest<MenuResponse>({
      method: 'GET',
      url: `/menu?${params.toString()}`,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch menu');
    }

    return response.data;
  }

  // Order API
  async createOrder(orderData: OrderFormData): Promise<Order> {
    const response = await this.makeRequest<Order>({
      method: 'POST',
      url: '/order',
      data: orderData,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create order');
    }

    return response.data;
  }

  async getOrder(bookingRef: string): Promise<Order[]> {
    const response = await this.makeRequest<Order[]>({
      method: 'GET',
      url: `/order/${bookingRef}`,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch order');
    }

    return response.data;
  }

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    const response = await this.makeRequest<Order>({
      method: 'PUT',
      url: `/order/${orderId}`,
      data: updates,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update order');
    }

    return response.data;
  }

  async cancelOrder(orderId: string): Promise<void> {
    const response = await this.makeRequest<void>({
      method: 'DELETE',
      url: `/order/${orderId}`,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel order');
    }
  }

  // User API
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.makeRequest<{ user: User; token: string }>({
      method: 'POST',
      url: '/auth/login',
      data: { email, password },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Login failed');
    }

    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest<void>({
        method: 'POST',
        url: '/auth/logout',
      });
    } catch (error) {
      console.error('[ApiService] Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.makeRequest<User>({
      method: 'GET',
      url: '/auth/me',
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to get user info');
    }

    return response.data;
  }

  // Dietary Profile API
  async getDietaryProfile(passengerId: string): Promise<DietaryProfile> {
    const response = await this.makeRequest<DietaryProfile>({
      method: 'GET',
      url: `/dietary-profile/${passengerId}`,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch dietary profile');
    }

    return response.data;
  }

  async updateDietaryProfile(
    passengerId: string,
    profile: Partial<DietaryProfile>
  ): Promise<DietaryProfile> {
    const response = await this.makeRequest<DietaryProfile>({
      method: 'PUT',
      url: `/dietary-profile/${passengerId}`,
      data: profile,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update dietary profile');
    }

    return response.data;
  }

  // Flight API
  async getFlight(flightNumber: string, date: string): Promise<Flight> {
    const response = await this.makeRequest<Flight>({
      method: 'GET',
      url: `/flight/${flightNumber}/${date}`,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch flight info');
    }

    return response.data;
  }

  // Admin API
  async getAnalytics(dateRange: { start: string; end: string }): Promise<AnalyticsData> {
    const response = await this.makeRequest<AnalyticsData>({
      method: 'GET',
      url: '/admin/analytics',
      params: dateRange,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch analytics');
    }

    return response.data;
  }

  async lockMealSlot(slotId: string): Promise<void> {
    const response = await this.makeRequest<void>({
      method: 'POST',
      url: `/admin/slots/${slotId}/lock`,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to lock meal slot');
    }
  }

  async unlockMealSlot(slotId: string): Promise<void> {
    const response = await this.makeRequest<void>({
      method: 'POST',
      url: `/admin/slots/${slotId}/unlock`,
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to unlock meal slot');
    }
  }

  async exportToCatering(flightNumber: string, date: string): Promise<void> {
    const response = await this.makeRequest<void>({
      method: 'POST',
      url: '/admin/export',
      data: { flightNumber, date },
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to export to catering');
    }
  }

  // Crew API
  async getPassengerMeals(flightNumber: string): Promise<Order[]> {
    const response = await this.makeRequest<Order[]>({
      method: 'GET',
      url: `/crew/passengers/${flightNumber}`,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch passenger meals');
    }

    return response.data;
  }

  async reportServiceComplete(orderId: string, notes?: string): Promise<void> {
    const response = await this.makeRequest<void>({
      method: 'POST',
      url: '/crew/service-complete',
      data: { orderId, notes },
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to report service completion');
    }
  }

  // Emergency API
  async requestEmergencyMeal(
    flightNumber: string,
    reason: string,
    mealType: string,
    quantity: number
  ): Promise<void> {
    const response = await this.makeRequest<void>({
      method: 'POST',
      url: '/admin/emergency-meal',
      data: { flightNumber, reason, mealType, quantity },
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to request emergency meal');
    }
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.makeRequest<{ status: string; timestamp: string }>({
      method: 'GET',
      url: '/health',
    });

    if (!response.success || !response.data) {
      throw new Error('Health check failed');
    }

    return response.data;
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 