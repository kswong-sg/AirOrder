// Core Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'passenger' | 'crew' | 'admin' | 'catering_manager';
  dietaryRestrictions?: string[];
  allergies?: string[];
  preferences?: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'side' | 'dessert' | 'beverage';
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  allergens: string[];
  dietaryCategories: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  imageUrl?: string;
  available: boolean;
  stockQuantity: number;
}

export interface Order {
  id: string;
  bookingRef: string;
  passengerId: string;
  seat: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  timestamp: string;
  dietaryRestrictions?: string[];
  specialRequests?: string[];
  mealSlot: string;
  flightNumber: string;
  flightDate: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  specialInstructions?: string;
  price: number;
}

export interface Flight {
  flightNumber: string;
  date: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  aircraftType: string;
  mealSlots: MealSlot[];
  routeId: string;
}

export interface MealSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  isActive: boolean;
  crewAssigned: string[];
}

export interface Route {
  id: string;
  flightNumber: string;
  date: string;
  origin: string;
  destination: string;
  slotDefinitions: MealSlot[];
  culturalAdaptations: string[];
  menuVersion: string;
}

export interface DietaryProfile {
  passengerId: string;
  restrictions: string[];
  allergies: string[];
  preferences: string[];
  medicalNotes?: string;
}

export interface Inventory {
  aircraftId: string;
  routeId: string;
  date: string;
  itemId: string;
  quantity: number;
  expiryDate: string;
  supplierInfo: {
    name: string;
    contact: string;
    certification: string;
  };
}

export interface CrewAssignment {
  flightNumber: string;
  date: string;
  crewId: string;
  role: string;
  assignedMealService: string[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MenuResponse {
  menu: MenuItem[];
  mealSlots: MealSlot[];
  flight: Flight;
}

export interface OrderResponse {
  order: Order;
  estimatedDeliveryTime: string;
}

// Form Types
export interface OrderFormData {
  items: OrderItem[];
  dietaryRestrictions: string[];
  specialRequests: string;
  seat: string;
  mealSlot?: string;
}

export interface DietaryFormData {
  restrictions: string[];
  allergies: string[];
  preferences: string[];
  medicalNotes?: string;
}

// State Types
export interface AppState {
  user: User | null;
  currentFlight: Flight | null;
  currentOrder: Order | null;
  menu: MenuItem[];
  mealSlots: MealSlot[];
  loading: boolean;
  error: string | null;
}

// Filter Types
export interface MenuFilters {
  cabinClass: string;
  dietaryRestrictions: string[];
  priceRange: [number, number];
  category: string;
}

// Analytics Types
export interface AnalyticsData {
  totalOrders: number;
  revenue: number;
  popularItems: Array<{
    item: MenuItem;
    count: number;
  }>;
  dietaryStats: {
    [key: string]: number;
  };
  timeSlotStats: {
    [key: string]: number;
  };
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'digital_wallet';
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  clientSecret: string;
}

// Food Safety Types
export interface FoodSafetyRecord {
  id: string;
  itemId: string;
  temperature: number;
  timestamp: string;
  location: string;
  status: 'safe' | 'warning' | 'critical';
}

export interface HACCPRecord {
  id: string;
  flightNumber: string;
  date: string;
  checks: Array<{
    type: string;
    status: 'pass' | 'fail';
    timestamp: string;
    notes?: string;
  }>;
}

// Emergency Types
export interface EmergencyMeal {
  id: string;
  flightNumber: string;
  reason: 'diversion' | 'delay' | 'equipment_failure';
  mealType: string;
  quantity: number;
  status: 'requested' | 'approved' | 'delivered';
  timestamp: string;
}

// Localization Types
export interface LocalizationConfig {
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'order_update' | 'inventory_update' | 'crew_alert' | 'emergency';
  payload: any;
  timestamp: string;
}

// Cache Types
export interface CacheConfig {
  menuTTL: number;
  orderTTL: number;
  userTTL: number;
  maxSize: number;
}

// Feature Flags
export interface FeatureFlags {
  dietaryRestrictions: boolean;
  realTimeInventory: boolean;
  crewApp: boolean;
  emergencyMeals: boolean;
  sustainabilityTracking: boolean;
  multiLanguage: boolean;
  dynamicPricing: boolean;
  foodSafetyMonitoring: boolean;
} 