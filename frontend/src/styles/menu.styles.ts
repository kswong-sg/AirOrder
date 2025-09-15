import styled from 'styled-components';
import { motion } from 'framer-motion';

// All styled-components from menu.tsx moved here

export const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

export const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
`;

export const FiltersSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FilterLabel = styled.label`
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

export const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

export const FilterCheckbox = styled.input`
  margin-right: 0.5rem;
  transform: scale(1.2);
`;

export const MealSlotsSection = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MealSlotCard = styled(motion.div)<{ active: boolean; $locked: boolean }>`
  background: ${props => props.$locked ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.95)'};
  border: 2px solid ${props => props.active ? '#667eea' : 'transparent'};
  border-radius: 12px;
  padding: 1rem;
  min-width: 200px;
  cursor: ${props => props.$locked ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$locked ? 0.6 : 1};
  transition: all 0.2s ease;
  &:hover {
    transform: ${props => props.$locked ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.$locked ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.1)'};
  }
`;

export const MealSlotTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const MealSlotTime = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

export const MealSlotStatus = styled.span<{ $locked: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.$locked ? '#28a745' : '#dc3545'};
  font-weight: bold;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  background-color: ${props => props.$locked ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
`;

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const MenuCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const MenuImage = styled.div<{ $imageUrl:string }>`
  background-image: url(${props => props.$imageUrl});
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
`;

export const MenuOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
`;

export const MenuContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 1rem;
  color: white;
`;

export const MenuTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: white;
`;

export const MenuDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.8rem;
  line-height: 1.4;
`;

export const MenuPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

export const Price = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffd700;
`;

export const StockStatus = styled.span<{ $inStock: boolean }>`
  font-size: 0.8rem;
  color: ${props => props.$inStock ? '#28a745' : '#dc3545'};
  font-weight: bold;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  background-color: ${props => props.$inStock ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
`;

export const DietaryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
`;

export const DietaryTag = styled.span<{ $type: string }>`
  font-size: 0.8rem;
  color: #555;
  background-color: #f0f0f0;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-weight: bold;
  background: ${props => {
    switch (props.$type) {
      case 'vegetarian': return '#9ae6b4';
      case 'vegan': return '#68d391';
      case 'gluten-free': return '#f6ad55';
      case 'halal': return '#63b3ed';
      case 'kosher': return '#b794f4';
      default: return '#e2e8f0';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'vegetarian': return '#22543d';
      case 'vegan': return '#22543d';
      case 'gluten-free': return '#744210';
      case 'halal': return '#1a365d';
      case 'kosher': return '#553c9a';
      default: return '#4a5568';
    }
  }};
`;

export const AllergenWarning = styled.div`
  background-color: #fff3cd;
  color: #856404;
  padding: 0.8rem;
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #ffeeba;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const MenuActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

export const ActionButton = styled.button`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #667eea;
    color: white;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    color: #666;
  }
`;

export const CartSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const CartButton = styled(motion.button)`
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4CAF50;
  color: white;

  &:hover {
    background-color: #388E3C;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    color: #666;
  }
`;

export const CartBadge = styled.span`
  background-color: #ffd700;
  color: #333;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 25px;
`;

export const LoadingSpinner = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #f5c6cb;
  font-size: 0.9rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`; 