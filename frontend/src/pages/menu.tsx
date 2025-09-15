import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, QueryClient, QueryClientProvider } from 'react-query';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaExclamationTriangle, 
  FaShoppingCart,
  FaHeart,
  FaInfoCircle,
  FaBell
} from 'react-icons/fa';
import Layout from '@/components/Layout';
import apiService from '@/services/api';
import { MenuItem, MenuFilters, OrderFormData } from '@/types';

// Import all styled components from the styles directory
import {
  MenuContainer, Header, Title, Subtitle, FiltersSection, FilterGrid, FilterGroup, FilterLabel, FilterSelect,
  FilterCheckbox, MealSlotsSection, MealSlotCard, MealSlotTitle, MealSlotTime, MealSlotStatus, MenuGrid,
  MenuCard, MenuImage, MenuOverlay, MenuContent, MenuTitle, MenuDescription, MenuPrice, Price, StockStatus,
  DietaryTags, DietaryTag, AllergenWarning, MenuActions, ActionButton, CartSection, CartButton, CartBadge,
  LoadingSpinner, ErrorMessage
} from '../styles/menu.styles';

const Menu: React.FC = () => {
  const [filters, setFilters] = useState<MenuFilters>({
    cabinClass: 'economy',
    dietaryRestrictions: [],
    priceRange: [0, 100],
    category: 'all',
  });

  const [selectedMealSlot, setSelectedMealSlot] = useState<string>('');
  const [cart, setCart] = useState<OrderFormData>({
    items: [],
    dietaryRestrictions: [],
    specialRequests: '', 
    seat: '',
  });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
      },
    },
  });

  // Mock flight data - in real app this would come from context or props
  const flightNumber = 'AA123';
  const date = '2024-01-15';

  const { data: menuData, isLoading, error } = useQuery(
    ['menu', flightNumber, date, filters.cabinClass, filters.dietaryRestrictions],
    () => apiService.getMenu(flightNumber, date, filters.cabinClass, filters.dietaryRestrictions),
    {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const orderMutation = useMutation(
    (orderData: OrderFormData) => apiService.createOrder(orderData),
    {
      onSuccess: () => {
        toast.success('Order placed successfully!');
        setCart({ items: [], dietaryRestrictions: [], specialRequests: '', seat: '' });
        queryClient.invalidateQueries(['orders']);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to place order');
      },
    }
  );

  const handleAddToCart = (item: MenuItem) => {
    try {
      const existingItem = cart.items.find(cartItem => cartItem.menuItemId === item.id);
      
      if (existingItem) {
        setCart(prev => ({
          ...prev,
          items: prev.items.map(cartItem =>
            cartItem.menuItemId === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        }));
      } else {
        setCart(prev => ({
          ...prev,
          items: [...prev.items, {
            menuItemId: item.id,
            quantity: 1,
            price: item.price,
          }],
        }));
      }
      
      toast.success(`${item.name} added to cart`);
    } catch (error) {
      console.error('[Menu] Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const handlePlaceOrder = async () => {
    try {
      if (cart.items.length === 0) {
        toast.error('Please add items to your cart');
        return;
      }

      if (!selectedMealSlot) {
        toast.error('Please select a meal slot');
        return;
      }

      await orderMutation.mutateAsync({
        ...cart,
        mealSlot: selectedMealSlot, // Only if you add mealSlot to OrderFormData
      });
    } catch (error) {
      console.error('[Menu] Error placing order:', error);
    }
  };

  const handleFilterChange = (key: keyof MenuFilters, value: any) => {
    try {
      setFilters(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('[Menu] Error updating filters:', error);
    }
  };

  const getFilteredMenu = () => {
    if (!menuData?.menu) return [];

    return menuData.menu.filter(item => {
      // Category filter
      if (filters.category !== 'all' && item.category !== filters.category) {
        return false;
      }

      // Price filter
      if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
        return false;
      }

      // Dietary restrictions filter
      if (filters.dietaryRestrictions.length > 0) {
        const hasMatchingDietary = filters.dietaryRestrictions.some(restriction =>
          item.dietaryCategories.includes(restriction)
        );
        if (!hasMatchingDietary) return false;
      }

      return true;
    });
  };

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (isLoading) {
    return (
      <Layout title="Menu - Airline Ordering">
        <LoadingSpinner>Loading menu...</LoadingSpinner>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Menu - Airline Ordering">
        <ErrorMessage>
          Failed to load menu. Please try again later.
        </ErrorMessage>
      </Layout>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
    <Layout title="Menu - Airline Ordering">
      <MenuContainer>
        <Header>
          <Title>In-Flight Menu</Title>
          <Subtitle>Select your meal for today's flight</Subtitle>
        </Header>

        <FiltersSection>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Cabin Class</FilterLabel>
              <FilterSelect
                value={filters.cabinClass}
                onChange={(e) => handleFilterChange('cabinClass', e.target.value)}
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Category</FilterLabel>
              <FilterSelect
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="main">Main Dishes</option>
                <option value="side">Side Dishes</option>
                <option value="dessert">Desserts</option>
                <option value="beverage">Beverages</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Dietary Restrictions</FilterLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher'].map(restriction => (
                  <FilterCheckbox key={restriction}>
                    <input
                      type="checkbox"
                      checked={filters.dietaryRestrictions.includes(restriction)}
                      onChange={(e) => {
                        const newRestrictions = e.target.checked
                          ? [...filters.dietaryRestrictions, restriction]
                          : filters.dietaryRestrictions.filter(r => r !== restriction);
                        handleFilterChange('dietaryRestrictions', newRestrictions);
                      }}
                    />
                    {restriction.charAt(0).toUpperCase() + restriction.slice(1)}
                  </FilterCheckbox>
                ))}
              </div>
            </FilterGroup>
          </FilterGrid>
        </FiltersSection>

        {menuData?.mealSlots && (
          <MealSlotsSection>
            {menuData.mealSlots.map((slot) => (
              <MealSlotCard
                key={slot.id}
                active={selectedMealSlot === slot.id}
                $locked={slot.isLocked}
                onClick={() => !slot.isLocked && setSelectedMealSlot(slot.id)}
                whileHover={{ scale: slot.isLocked ? 1 : 1.02 }}
                whileTap={{ scale: slot.isLocked ? 1 : 0.98 }}
              >
                <MealSlotTitle>{slot.name}</MealSlotTitle>
                <MealSlotTime>
                  {slot.startTime} - {slot.endTime}
                </MealSlotTime>
                <MealSlotStatus $locked={slot.isLocked}>
                  {slot.isLocked ? 'Locked' : slot.isActive ? 'Active' : 'Upcoming'}
                </MealSlotStatus>
              </MealSlotCard>
            ))}
          </MealSlotsSection>
        )}

        <MenuGrid>
          <AnimatePresence>
            {getFilteredMenu().map((item) => (
              <MenuCard
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MenuImage $imageUrl={item.imageUrl ?? ""}>
                  <MenuOverlay>
                    <FaInfoCircle size={24} color="white" />
                  </MenuOverlay>
                </MenuImage>

                <MenuContent>
                  <MenuTitle>{item.name}</MenuTitle>
                  <MenuDescription>{item.description}</MenuDescription>

                  <DietaryTags>
                    {item.dietaryCategories.map(category => (
                      <DietaryTag key={category} $type={category}>
                        {category}
                      </DietaryTag>
                    ))}
                  </DietaryTags>

                  {item.allergens.length > 0 && (
                    <AllergenWarning>
                      <FaExclamationTriangle />
                      Contains: {item.allergens.join(', ')}
                    </AllergenWarning>
                  )}

                  <MenuPrice>
                    <Price>${item.price.toFixed(2)}</Price>
                    <StockStatus $inStock={item.available}>
                      {item.available ? 'In Stock' : 'Out of Stock'}
                    </StockStatus>
                  </MenuPrice>

                  <MenuActions>
                    <ActionButton
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </ActionButton>
                    <ActionButton>
                      <FaHeart />
                      Favorite
                    </ActionButton>
                  </MenuActions>
                </MenuContent>
              </MenuCard>
            ))}
          </AnimatePresence>
        </MenuGrid>

        <CartSection>
          <CartButton
            onClick={handlePlaceOrder}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShoppingCart />
            {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
          </CartButton>
        </CartSection>
      </MenuContainer>
    </Layout>
    </QueryClientProvider>
  );
};

export default Menu; 