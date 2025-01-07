# Brewista: Coffee Brewing Companion

##Live App Link
🔗 [brewista](https://brewista-9c2f976eb426.herokuapp.com/)

## Project Overview

Brewista is a sophisticated coffee brewing companion application that changes the home brewing experience through precise calculations, interactive guidance, and community features. It combines technical precision with an intuitive user interface to help coffee enthusiasts achieve consistent, high-quality results while being able to track and share them.

## Key Features

### Dynamic Recipe Scaling 
- Real-time recipe adjustments with scaling algorithms
- Support for both ratio-based and explicit measurements
- Precision to 0.1g for coffee and water measurements

### Interactive Brewing Process
- Step-by-step guided brewing with real-time timers
- Visual timeline with GSAP-powered animations
- Smart time scaling for different brew sizes
- Equipment-specific brewing instructions

### Mobile-First Design
- Intuitive touch interfaces for brewing controls
- Responsive bottom sheets for step details
- Spring-based animations for smooth interactions
- Device-optimized viewing experience

### Community Features
- Recipe sharing and discovery
- Personal recipe collections
- Equipment tracking and recommendations
- Brewing journals and tasting notes

## Technical Highlights

### Advanced State Management
- Custom React hooks for complex brewing state
- Context-based authentication and user preferences
- Optimistic UI updates for seamless interaction
- Efficient data flow patterns for real-time calculations

### Animation System
- GSAP-powered timeline animations
- React Spring for interactive transitions
- Optimized performance on mobile devices
- Smooth visual feedback for user actions

### Complex Calculations
- Non-linear time scaling for different brewing methods
- Real-time recipe parameter adjustments
- Preservation of critical ratios during scaling
- Separate handling of bloom phases

### Performance Optimization
- Debounced calculations for real-time updates
- Efficient component memoization strategies
- Lazy loading and code splitting
- Optimized mobile rendering

## Technology Stack

### Frontend
- React 18 with Hooks
- TailwindCSS
- React Context API
- GSAP and React Spring for animations
- Lodash and FontAwesome utilities

### Backend
- Node.js with Express
- MongoDB database
- JWT authentication

## Technical Details

### Recipe Engine
- Developed scaling algorithms for precise measurements
- Implemented real-time calculation updates with debouncing
- Built flexible support for multiple recipe types

### Interactive Timeline System
- Custom timeline visualization with GSAP animations
- Dynamic step management with drag-and-drop reordering
- Responsive design adapting to recipe complexity
- Optimized performance for mobile devices

### Mobile Experience
- Implemented touch-friendly brewing controls
- Created custom bottom sheets for step details
- Optimized animations for mobile performance
- Built responsive layouts for all screen sizes

## Future Development

- Smart device integration
- Advanced recipe recommendations
- Support for more brewing types beyong pour-overs
- Enhanced analytics and insights
- Offline mode support

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/brewista.git

# Install dependencies
cd brewista
npm install

# Start development server
npm run dev
```

## Environment Setup
Create a `.env` file with the following variables:
```
DATABASE_URL=your_mongodb_url
SECRET=your_secret
NODE_ENV=development or production
```



---

Developed by Benjamin Lee
