# Amor Skincare - Project TODO

## Database & Backend
- [x] Products table with categories, brands, images, prices
- [x] Orders table with customer info, items, status
- [x] Products CRUD procedures (public read, admin write)
- [x] Orders procedures (create, list, update status)
- [x] AI chat procedure with LLM integration
- [x] Admin procedures (protected, owner-only)
- [x] Owner notification on new order

## Frontend Pages
- [x] Home page with animated hero section (logo, tagline, CTA)
- [x] Product catalog page with category filters
- [x] Product detail page with add-to-cart
- [x] Shopping cart page with quantity controls and subtotal
- [x] Checkout / order form page (name, phone, address, payment method)
- [x] Order confirmation page
- [x] Store info section (locations, WhatsApp, hours)
- [x] Admin panel (protected, order management)

## UI Components
- [x] Animated logo entrance
- [x] Floating AI chat widget
- [x] Cart badge counter with animation
- [x] Fade-in on scroll animations
- [x] Product card hover effects
- [x] Navigation with cart icon
- [x] Footer with store info

## Style & Polish
- [x] Premium pink/rose gold color scheme
- [x] Google Fonts (Playfair Display + Inter)
- [x] Smooth CSS transitions and micro-interactions
- [x] Responsive mobile-first design
- [x] Loading skeletons for products

## Tests
- [x] Auth logout test
- [x] Auth me test
- [x] Orders create validation tests
- [x] Admin access control test

## New Features (Round 2)
- [x] Add "Самовывоз" (pickup) delivery option in checkout with store location selector
- [x] Send WhatsApp message to manager (+7 777 477 9779) on new order with full order details
- [x] Show delivery method in admin panel order details
- [x] Update order schema to store delivery method (delivery/pickup) and pickup location

## Redesign (Round 3)
- [x] Upload and use real Amor Skincare logo from Instagram
- [x] Animated dark hero with skincare background image and floating emojis
- [x] Modern premium product cards with hover lift and wishlist button
- [x] Simplified payment options: Kaspi / Наличные
- [x] Auto-open WhatsApp with prefilled order text for manager
- [x] In-app owner notification on new order
- [x] Updated AI chat widget with real logo and brand colors
- [x] Dark premium footer with real logo and social links
- [x] Brand marquee animation section
- [x] Scroll-triggered fade-in animations on all sections
- [x] Updated Navbar with real logo and WhatsApp quick link
- [x] All 7 tests passing

## Full Admin Panel (Round 4)
- [x] Admin: dashboard stats (total orders, revenue, products count)
- [x] Admin: product list with search and edit/delete actions
- [x] Admin: add product form (name, price, description, brand, category, skin type, image upload)
- [x] Admin: edit existing product
- [x] Admin: delete product with confirmation
- [x] Admin: add/edit/delete categories
- [x] Admin: image upload from computer/phone to S3 storage
- [x] Admin: view and manage orders with status updates
- [x] Backend: product create/update/delete procedures (admin-only)
- [x] Backend: category create/update/delete procedures (admin-only)
- [x] Backend: file upload endpoint for product images

## Delete Orders Feature (Round 5)
- [x] Backend: add delete order procedure (admin-only)
- [x] Admin UI: add delete button for each order with confirmation dialog
- [x] Admin UI: update stats after order deletion
- [x] Test delete order functionality

## Video Background Fix (Round 6)
- [x] Upload hero video to S3 storage
- [x] Update Home.tsx to use S3 URL instead of deleted local file

## Hide Manus Branding (Round 7)
- [x] Add CSS to hide "Made with Manus" badge and related elements
- [x] Make badge tiny and almost invisible (2px, 5% opacity)

## Loyalty System (Round 8)
- [x] Database: create loyalty_customers table (phone, name, birthDate, bonusBalance, discountPercent)
- [x] Database: create loyalty_transactions table (customerId, type, amount, description, date)
- [x] Backend: customer registration procedure (phone, name, birthDate optional)
- [x] Backend: customer login procedure (phone verification)
- [x] Backend: get customer profile procedure
- [x] Backend: get customer transaction history procedure
- [x] Backend: admin procedures for loyalty (add/edit/delete customer, manage discounts)
- [x] Frontend: registration page (/register) with phone, name, birthDate
- [x] Frontend: login page (/login) with phone input and error handling
- [x] Frontend: personal account dashboard (/account) with profile, bonuses, discounts, history
- [x] Frontend: admin loyalty management panel (customer search, discount editing, transaction history)
- [x] Tests: loyalty system compilation and structure
