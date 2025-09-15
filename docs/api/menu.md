# Menu API

The Menu API provides endpoints for browsing and filtering menu items based on flight information, cabin class, and dietary restrictions.

## 📋 Endpoints

### Get Menu Items

Retrieve menu items for a specific flight with filtering options.

**Endpoint:** `GET /api/menu`

**URL Parameters:**
- `flightNumber` (required): Flight number (e.g., "AA123")
- `date` (required): Flight date in YYYY-MM-DD format
- `cabinClass` (required): Cabin class (economy, premium_economy, business, first)
- `dietaryRestrictions` (optional): Comma-separated dietary restrictions

**Example Request:**
```bash
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy&dietaryRestrictions=vegetarian,gluten-free"
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "menu": [
      {
        "id": "1",
        "name": "Grilled Chicken Breast",
        "description": "Tender grilled chicken breast with herbs and lemon",
        "price": 15.99,
        "category": "main",
        "cabinClass": "economy",
        "allergens": ["none"],
        "dietaryCategories": ["gluten-free"],
        "nutritionalInfo": {
          "calories": 350,
          "protein": 45,
          "carbs": 5,
          "fat": 12
        },
        "available": true,
        "stockQuantity": 50
      }
    ],
    "mealSlots": [
      {
        "id": "breakfast",
        "name": "Breakfast",
        "startTime": "07:00",
        "endTime": "09:00",
        "isLocked": false,
        "isActive": true,
        "crewAssigned": []
      }
    ],
    "flight": {
      "flightNumber": "AA123",
      "date": "2024-01-15",
      "origin": "SFO",
      "destination": "NRT",
      "departureTime": "10:30",
      "arrivalTime": "14:45",
      "aircraftType": "B787",
      "routeId": "AA123-2024-01-15"
    }
  }
}
```

## 🏷️ Data Models

### MenuItem
```typescript
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizer' | 'main' | 'side' | 'dessert' | 'beverage';
  cabinClass: 'economy' | 'premium_economy' | 'business' | 'first';
  allergens: string[];
  dietaryCategories: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  available: boolean;
  stockQuantity: number;
}
```

### MealSlot
```typescript
interface MealSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isLocked: boolean;
  isActive: boolean;
  crewAssigned: string[];
}
```

### Flight
```typescript
interface Flight {
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
```

## 🔍 Filtering Options

### Cabin Classes
- `economy`: Economy class meals
- `premium_economy`: Premium economy class meals
- `business`: Business class meals
- `first`: First class meals

### Dietary Restrictions
- `vegetarian`: Vegetarian meals
- `vegan`: Vegan meals
- `gluten-free`: Gluten-free meals
- `halal`: Halal meals
- `kosher`: Kosher meals
- `dairy-free`: Dairy-free meals
- `nut-free`: Nut-free meals

### Categories
- `appetizer`: Appetizers and starters
- `main`: Main course dishes
- `side`: Side dishes and accompaniments
- `dessert`: Desserts and sweets
- `beverage`: Drinks and beverages

## ⚠️ Error Responses

### Missing Required Parameters
```json
{
  "success": false,
  "error": "Missing required parameters: flightNumber, date, cabinClass"
}
```

### Invalid Cabin Class
```json
{
  "success": false,
  "error": "Invalid cabin class. Must be one of: economy, premium_economy, business, first"
}
```

### Flight Not Found
```json
{
  "success": false,
  "error": "Flight not found"
}
```

### Server Error
```json
{
  "success": false,
  "error": "Failed to retrieve menu"
}
```

## 🔧 Implementation Details

### Filtering Logic
1. **Cabin Class Filtering**: Menu items are filtered by the specified cabin class
2. **Dietary Restrictions**: If provided, items are filtered to include only those matching the dietary restrictions
3. **Availability Check**: Only available items with stock > 0 are returned
4. **Meal Slot Validation**: Active meal slots are included in the response

### Mock Data Structure
The current implementation uses mock data for development. In production, this would be replaced with:
- Database queries to MongoDB
- Real-time inventory checks
- Dynamic pricing based on demand
- Seasonal menu variations

### Performance Considerations
- Database indexing on flight number and date
- Caching of menu data for frequently accessed flights
- Pagination for large menu datasets
- CDN for static menu images

## 🧪 Testing Examples

### Test Economy Class Menu
```bash
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy"
```

### Test Vegetarian Filtering
```bash
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy&dietaryRestrictions=vegetarian"
```

### Test Multiple Dietary Restrictions
```bash
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=economy&dietaryRestrictions=vegetarian,gluten-free"
```

### Test Business Class Menu
```bash
curl "http://localhost:3001/api/menu?flightNumber=AA123&date=2024-01-15&cabinClass=business"
```

## 🔄 Related Endpoints

- [Order API](./order.md) - Create and manage orders
- [Flight API](./flight.md) - Flight information and scheduling
- [User API](./user.md) - User preferences and dietary restrictions

---

*For more information about the API design principles, see [API Design](../architecture/api-design.md).* 