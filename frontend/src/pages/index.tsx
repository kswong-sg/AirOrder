import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FaPlane, 
  FaCalendarAlt, 
  FaSearch,
  FaClock,
  FaStar,
  FaHeart
} from 'react-icons/fa';
import Layout from '@/components/Layout';
import apiService from '@/services/api';
import { Flight, User } from '@/types';
import {
  HomeContainer, HeroSection, HeroTitle, HeroSubtitle, FlightSearchSection, SearchForm, FormGroup, Label, Input, SearchButton,
  FeaturesSection, FeatureCard, FeatureIcon, FeatureTitle, FeatureDescription, RecentFlightsSection, SectionTitle, FlightCard,
  FlightHeader, FlightNumber, FlightStatus, FlightRoute, RouteInfo, Airport, AirportCode, AirportName, RouteArrow, FlightDetails,
  DetailItem
} from '../styles/index.styles';

const Home: React.FC = () => {
  const router = useRouter();
  const [searchForm, setSearchForm] = useState({
    flightNumber: '',
    date: '',
    origin: '',
    destination: '',
  });
  const [recentFlights, setRecentFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadRecentFlights();
  }, []);

  const loadRecentFlights = async () => {
    try {
      // Mock recent flights data
      const mockFlights: Flight[] = [
        {
          flightNumber: 'AA123',
          date: '2024-01-15',
          origin: 'SFO',
          destination: 'NRT',
          departureTime: '10:30',
          arrivalTime: '14:45',
          aircraftType: 'B787',
          mealSlots: [],
          routeId: 'SFO-NRT-001',
        },
        {
          flightNumber: 'UA456',
          date: '2024-01-16',
          origin: 'LAX',
          destination: 'LHR',
          departureTime: '18:00',
          arrivalTime: '12:30',
          aircraftType: 'A350',
          mealSlots: [],
          routeId: 'LAX-LHR-002',
        },
        {
          flightNumber: 'DL789',
          date: '2024-01-17',
          origin: 'JFK',
          destination: 'CDG',
          departureTime: '20:15',
          arrivalTime: '10:45',
          aircraftType: 'B777',
          mealSlots: [],
          routeId: 'JFK-CDG-003',
        },
      ];
      setRecentFlights(mockFlights);
    } catch (error) {
      console.error('[Home] Error loading recent flights:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!searchForm.flightNumber || !searchForm.date) {
        toast.error('Please enter flight number and date');
        return;
      }

      // Navigate to menu page with search parameters
      router.push({
        pathname: '/menu',
        query: {
          flightNumber: searchForm.flightNumber,
          date: searchForm.date,
        },
      });
    } catch (error) {
      console.error('[Home] Error searching flight:', error);
      toast.error('Failed to search flight');
    } finally {
      setLoading(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    try {
      router.push({
        pathname: '/menu',
        query: {
          flightNumber: flight.flightNumber,
          date: flight.date,
        },
      });
    } catch (error) {
      console.error('[Home] Error selecting flight:', error);
      toast.error('Failed to select flight');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    try {
      setSearchForm(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('[Home] Error updating form:', error);
    }
  };

  const features = [
    {
      icon: <FaPlane />,
      title: 'In-Flight Ordering',
      description: 'Order your meals and beverages directly from your seat with our easy-to-use interface.',
    },
    {
      icon: <FaHeart />,
      title: 'Dietary Preferences',
      description: 'Specify your dietary restrictions and allergies for personalized meal recommendations.',
    },
    {
      icon: <FaClock />,
      title: 'Real-Time Updates',
      description: 'Track your order status and receive real-time updates on meal service timing.',
    },
    {
      icon: <FaStar />,
      title: 'Premium Options',
      description: 'Upgrade to premium meal options and enjoy gourmet dining at 30,000 feet.',
    },
  ];

  return (
    <Layout title="Airline In-Flight Ordering" showNavigation={false}>
      <HomeContainer>
        <HeroSection>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <HeroTitle>Welcome to In-Flight Dining</HeroTitle>
              <HeroSubtitle>
                Experience premium meal service with our advanced ordering system.
                Order your favorite meals and beverages directly from your seat.
              </HeroSubtitle>
            </motion.div>
          </AnimatePresence>
        </HeroSection>

        <FlightSearchSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SectionTitle>Find Your Flight</SectionTitle>
            <SearchForm onSubmit={handleSearch}>
              <FormGroup>
                <Label>Flight Number</Label>
                <Input
                  type="text"
                  placeholder="e.g., AA123"
                  value={searchForm.flightNumber}
                  onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={searchForm.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Origin</Label>
                <Input
                  type="text"
                  placeholder="e.g., SFO"
                  value={searchForm.origin}
                  onChange={(e) => handleInputChange('origin', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Destination</Label>
                <Input
                  type="text"
                  placeholder="e.g., NRT"
                  value={searchForm.destination}
                  onChange={(e) => handleInputChange('destination', e.target.value)}
                />
              </FormGroup>

              <SearchButton
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  'Searching...'
                ) : (
                  <>
                    <FaSearch />
                    Search Flight
                  </>
                )}
              </SearchButton>
            </SearchForm>
          </motion.div>
        </FlightSearchSection>

        <FeaturesSection>
          <AnimatePresence>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <FeatureCard>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </FeaturesSection>

        <RecentFlightsSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SectionTitle>Recent Flights</SectionTitle>
            {recentFlights.map((flight, index) => (
              <FlightCard
                key={flight.flightNumber}
                onClick={() => handleFlightSelect(flight)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
              >
                <FlightHeader>
                  <FlightNumber>{flight.flightNumber}</FlightNumber>
                  <FlightStatus status="upcoming">Upcoming</FlightStatus>
                </FlightHeader>

                <FlightRoute>
                  <RouteInfo>
                    <Airport>
                      <AirportCode>{flight.origin}</AirportCode>
                      <AirportName>San Francisco</AirportName>
                    </Airport>
                    <RouteArrow>→</RouteArrow>
                    <Airport>
                      <AirportCode>{flight.destination}</AirportCode>
                      <AirportName>Tokyo</AirportName>
                    </Airport>
                  </RouteInfo>
                </FlightRoute>

                <FlightDetails>
                  <DetailItem>
                    <FaCalendarAlt />
                    {flight.date}
                  </DetailItem>
                  <DetailItem>
                    <FaClock />
                    {flight.departureTime} - {flight.arrivalTime}
                  </DetailItem>
                  <DetailItem>
                    <FaPlane />
                    {flight.aircraftType}
                  </DetailItem>
                </FlightDetails>
              </FlightCard>
            ))}
          </motion.div>
        </RecentFlightsSection>
      </HomeContainer>
    </Layout>
  );
};

export default Home; 