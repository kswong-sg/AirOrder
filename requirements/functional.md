# Airline In-Flight Ordering App — Requirements Specification

## 1. Overview

A serverless, mobile-responsive ordering system for in-flight meal & side-dish selection—supporting Economy, Premium Economy & Business classes, time-sectioned service, multi-route configurations, ad-hoc in-flight upsells, and a web-only admin console that ties into external catering APIs.

## 2. Epics & User Stories

### Epic A: Passenger Meal Selection

**US-A1:** As a passenger, I can view the available menu (meals + side dishes) for my cabin class and flight route.

- **AC-A1.1:** Menu items filtered by class (Economy/Prem/Econ+/Biz)
- **AC-A1.2:** Menu changes if route crosses service-boundaries (e.g. "SFO→NRT" vs "NRT→SIN")
- **AC-A1.3:** Menu is cached at edge server for offline LAN-only access

**US-A2:** As a passenger, I can pick a main dish + side-dish portion and confirm my order.

- **AC-A2.1:** Cannot order >1 main, ≤2 sides per meal slot
- **AC-A2.2:** Selections validated against remaining inventory

**US-A3:** As a passenger, I can place an additional order mid-flight (if in-flight service window is still open).

- **AC-A3.1:** UI greys out when time-window closes
- **AC-A3.2:** Additional orders appended to same booking reference

### Epic B: Time-Sectioned Service

**US-B1:** As the system, I serve meals per defined time slots (breakfast/lunch/dinner/snack).

- **AC-B1.1:** Admin can define multiple time slots (e.g. "07:00–09:00", "12:00–14:00")
- **AC-B1.2:** Passenger UI only allows orders within active slot

**US-B2:** As the system, I automatically lock ordering after each slot's end time.

- **AC-B2.1:** Lock/unlock events triggered by AWS EventBridge schedule
- **AC-B2.2:** Edge-cached lambdas respect lock state

### Epic C: Multi-Route & Catering Integration

**US-C1:** As an admin, I can configure per-route menu blocks (by flight number + date).

- **AC-C1.1:** Route config includes routeId, mealSlots, menuVersion

**US-C2:** As an admin, I can plan catering & push orders to external catering service via REST API.

- **AC-C2.1:** Admin screen to "Export to Catering" button
- **AC-C2.2:** Web-hook payload must contain passenger name, seat, choices, special requests

### Epic D: Admin Console

**US-D1:** As an admin, I can log in, view all active flights, and their dining allocations.

**US-D2:** As an admin, I can lock/unlock individual meal slots manually.

**US-D3:** As an admin, I can adjust inventory counts in real-time.

**US-D4:** As an admin, I can see order analytics (counts per dish, per class, per route).

### Epic E: Dietary Restrictions & Special Requirements

**US-E1:** As a passenger, I can specify dietary restrictions and allergies during meal selection.

- **AC-E1.1:** Support for common dietary restrictions (vegetarian, vegan, gluten-free, halal, kosher)
- **AC-E1.2:** Allergy warnings displayed prominently for each menu item
- **AC-E1.3:** System prevents ordering items containing declared allergens

**US-E2:** As a passenger, I can add special requests (e.g., "no salt", "extra sauce", "child meal").

- **AC-E2.1:** Special requests are validated against available options
- **AC-E2.2:** Crew receives detailed special request information

**US-E3:** As the system, I can automatically suggest alternative meals for dietary restrictions.

- **AC-E3.1:** AI-powered meal recommendations based on restrictions and preferences
- **AC-E3.2:** Fallback options always available for each dietary category

### Epic F: Advanced Inventory & Supply Chain Management

**US-F1:** As an admin, I can manage real-time inventory across multiple aircraft and routes.

- **AC-F1.1:** Track inventory by aircraft tail number, route, and date
- **AC-F1.2:** Automatic low-stock alerts and reorder notifications
- **AC-F1.3:** Integration with catering supplier APIs for automatic restocking

**US-F2:** As an admin, I can forecast meal demand based on historical data and current bookings.

- **AC-F2.1:** Machine learning models predict meal preferences by route and passenger demographics
- **AC-F2.2:** Seasonal menu optimization based on passenger feedback and consumption data
- **AC-F2.3:** Dynamic pricing for premium meal upgrades based on demand

**US-F3:** As the system, I can handle last-minute passenger changes and meal reallocations.

- **AC-F3.1:** Real-time meal swapping between passengers when inventory is limited
- **AC-F3.2:** Automatic notification to catering for emergency meal requests

### Epic G: Crew Coordination & Service Management

**US-G1:** As cabin crew, I can access passenger meal preferences and special requirements.

- **AC-G1.1:** Mobile crew app with passenger list and meal details
- **AC-G1.2:** Real-time updates when passengers change seats or add special requests
- **AC-G1.3:** Integration with seat management system for accurate meal delivery

**US-G2:** As cabin crew, I can report meal service completion and collect feedback.

- **AC-G2.1:** Crew can mark meals as delivered and note any issues
- **AC-G2.2:** Passenger satisfaction surveys integrated with meal service tracking
- **AC-G2.3:** Real-time reporting of meal quality issues to catering

**US-G3:** As the system, I can optimize meal service timing based on flight conditions.

- **AC-G3.1:** Automatic adjustment of service windows based on turbulence forecasts
- **AC-G3.2:** Integration with flight deck systems for optimal meal timing

### Epic H: Revenue Optimization & Upselling

**US-H1:** As a passenger, I can upgrade to premium meal options during flight.

- **AC-H1.1:** Dynamic pricing based on remaining inventory and flight duration
- **AC-H1.2:** Personalized upgrade suggestions based on passenger history and preferences

**US-H2:** As the system, I can offer targeted promotions and meal bundles.

- **AC-H2.1:** Route-specific meal packages (e.g., "Taste of Japan" for NRT flights)
- **AC-H2.2:** Time-based promotions (e.g., breakfast discounts for early orders)
- **AC-H2.3:** Loyalty program integration for premium meal discounts

**US-H3:** As an admin, I can analyze revenue performance and optimize pricing strategies.

- **AC-H3.1:** Detailed analytics on meal upgrade conversion rates and revenue impact
- **AC-H3.2:** A/B testing framework for menu layouts and pricing strategies

### Epic I: Quality Assurance & Food Safety

**US-I1:** As the system, I can track meal preparation and delivery times for food safety.

- **AC-I1.1:** Temperature monitoring integration for hot meal service
- **AC-I1.2:** Automatic alerts for meals approaching safety time limits
- **AC-I1.3:** Digital HACCP compliance tracking for catering operations

**US-I2:** As an admin, I can manage food safety certifications and supplier compliance.

- **AC-I2.1:** Supplier audit tracking and certification management
- **AC-I2.2:** Automatic compliance reporting for regulatory requirements

**US-I3:** As the system, I can handle food safety incidents and passenger complaints.

- **AC-I3.1:** Incident reporting system with automatic escalation procedures
- **AC-I3.2:** Integration with airline's customer service system for complaint resolution

### Epic J: Multi-Language & Cultural Adaptation

**US-J1:** As a passenger, I can access the menu in my preferred language.

- **AC-J1.1:** Support for major languages (English, Spanish, French, German, Japanese, Chinese, Arabic)
- **AC-J1.2:** Cultural adaptation of menu descriptions and dietary information

**US-J2:** As the system, I can adapt meal offerings based on cultural preferences.

- **AC-J2.1:** Route-specific cultural meal adaptations (e.g., halal options for Middle Eastern routes)
- **AC-J2.2:** Seasonal cultural celebrations reflected in menu offerings

### Epic K: Sustainability & Waste Management

**US-K1:** As the system, I can track and minimize food waste through smart ordering.

- **AC-K1.1:** Predictive ordering based on historical consumption patterns
- **AC-K1.2:** Real-time waste tracking and reporting for sustainability initiatives

**US-K2:** As an admin, I can implement sustainable packaging and meal options.

- **AC-K2.1:** Eco-friendly meal packaging tracking and reporting
- **AC-K2.2:** Plant-based meal promotion and sustainability metrics

### Epic L: Emergency & Contingency Planning

**US-L1:** As the system, I can handle emergency meal situations (diversions, delays, equipment failures).

- **AC-L1.1:** Emergency meal protocols for extended flights and diversions
- **AC-L1.2:** Integration with airline's operational systems for real-time flight updates

**US-L2:** As an admin, I can implement contingency meal plans for various scenarios.

- **AC-L2.1:** Pre-approved emergency meal options for different flight durations
- **AC-L2.2:** Automatic notification systems for catering during irregular operations

## 3. Functional Requirements

### User Roles

- **Passenger:** browse & order, specify dietary requirements, add special requests
- **Cabin Crew:** access passenger meal details, report service completion, handle special requests
- **Admin:** CRUD menus/routes/slots, manage locks, view analytics, push to external API, manage inventory
- **Catering Manager:** oversee supply chain, quality control, supplier management

### Data Model (DynamoDB)

PK/SK design for Menu, Order, Route, Slot, AdminAction, DietaryProfile, Inventory, CrewAssignment.

#### Tables:

- **MenuItems:** `(id, class, name, sideOptions, nutritionalInfo, allergens[], dietaryCategories[])`
- **Orders:** `(bookingRef, passengerId, seat, items[], timestamp, dietaryRestrictions[], specialRequests[])`
- **Routes:** `(flightNo, date, origin, dest, slotDefinitions[], culturalAdaptations[])`
- **Slots:** `(slotId, startTime, endTime, isLocked, crewAssigned[])`
- **DietaryProfiles:** `(passengerId, restrictions[], allergies[], preferences[])`
- **Inventory:** `(aircraftId, routeId, date, itemId, quantity, expiryDate, supplierInfo)`
- **CrewAssignments:** `(flightNo, date, crewId, role, assignedMealService[])`

### APIs (HTTP-API)

- `GET /menu?flightNo=&date=&class=&dietaryRestrictions=` → returns filtered menu+slots
- `POST /order` → `{ bookingRef, passengerId, items[], dietaryRestrictions[], specialRequests[] }`
- `GET /order/{bookingRef}` → past + pending orders
- `GET|PUT /admin/routes`
- `POST /admin/slots/{slotId}/lock`
- `POST /admin/export` → triggers catering API call
- `GET /crew/passengers/{flightNo}` → passenger meal details for crew
- `POST /crew/service-complete` → report meal service completion
- `GET /inventory/forecast` → demand forecasting data
- `POST /admin/emergency-meal` → emergency meal protocols

### Edge Connectivity

- Lambda@Edge function on CloudFront viewer request
- Caches `/menu` & `/order` endpoints on in-flight LAN (no internet)
- Falls back to real-time API via measured sat-link if available

### Error Handling & Validation

- Joi validations on all inputs with dietary restriction validation
- 4xx for bad requests, 5xx for server errors
- Dead-letter queue for failed catering exports
- Food safety compliance validation

## 4. Non-Functional Requirements

### Scalability
DynamoDB on-demand + Lambda concurrency auto-scaling

### Security
- IAM least-privilege with role-based access control
- JWT-based passenger, crew & admin auth (separate issuers)
- CORS locked to inflight-lan domain + airline public portal
- HTTPS everywhere with food safety data encryption

### Performance
- <200 ms API p99 response time (cached at Edge)
- Menu data TTL = 1 hour at Edge cache
- Real-time inventory updates with <5 second latency

### Reliability
- ≥99.9% uptime (multi-AZ)
- EventBridge retries for slot locking
- Food safety compliance monitoring with automatic alerts

### Maintainability
- Clean repo: separate `backend/` & `frontend/`
- Serverless Framework for infra as code
- ESLint + Prettier + CI checks
- Comprehensive logging for food safety and quality assurance

## 5. Tech Stack

### Backend
Node.js 18, AWS Lambda, API Gateway (HTTP API), DynamoDB, EventBridge, SSM, Secrets Manager, Lambda@Edge, AWS IoT (for temperature monitoring)

### Frontend
React 18 (CRA), React-Router, Axios, Formik + Yup, Day.js, Styled-Components, i18next (internationalization)

### Admin UI
Same React codebase with role-gated routes

### Crew Mobile App
React Native with offline capabilities

### CI/CD
GitHub Actions (lint → test → sls deploy)

### Monitoring
CloudWatch + X-Ray + Food Safety Compliance Dashboard

## 6. Advanced Features

### Machine Learning Integration
- Predictive meal demand forecasting using historical data
- Personalized meal recommendations based on passenger preferences
- Dynamic pricing optimization for premium meal upgrades

### IoT Integration
- Temperature monitoring for hot meal service
- Real-time equipment status monitoring
- Automated food safety compliance tracking

### Blockchain Integration (Optional)
- Supply chain transparency for premium meal ingredients
- Immutable audit trail for food safety compliance
- Loyalty program integration with meal preferences

## 7. Compliance & Regulatory Requirements

### Food Safety Standards
- HACCP compliance tracking and reporting
- Temperature monitoring and alerting systems
- Supplier audit trail and certification management

### Aviation Regulations
- EASA/FAA compliance for in-flight catering operations
- Emergency meal protocols for extended flights

### Cultural & Religious Compliance
- Halal and kosher meal certification tracking
- Cultural meal adaptation for international routes

### Data Protection
- GDPR compliance for passenger dietary information
- Secure handling of medical dietary requirements

## 8. Success Metrics

### Operational Efficiency
- Reduced meal waste by 30% through predictive ordering
- Improved meal service completion time by 25%
- Enhanced passenger satisfaction scores for meal service

### Revenue Optimization
- 15% increase in premium meal upgrade conversion
- 20% improvement in meal-related ancillary revenue

### Quality Assurance
- 99.5% food safety compliance rate
- <1% meal-related passenger complaints

### Sustainability
- 25% reduction in food waste through smart inventory management
- Implementation of eco-friendly packaging tracking