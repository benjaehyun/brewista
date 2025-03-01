# Brewista: Coffee Brewing Companion

## Live App Link

🔗 [brewista](https://brewista-9c2f976eb426.herokuapp.com/)

## Project Overview

Brewista is a sophisticated coffee brewing companion application that changes the home brewing experience through precise calculations, interactive guidance, and community features. It combines brewing precision with an intuitive user interface to help coffee enthusiasts achieve consistent, high-quality results while being able to track and share them.

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
- Reliable timer operation with device sleep prevention

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

### Complex Calculations
- Non-linear time scaling for different brewing methods
- Real-time recipe parameter adjustments using debounced updates
- Preservation of critical ratios during scaling
- Separate handling of bloom phases
- Built flexible support for multiple recipe types

### Interactive Timeline System
- Custom timeline visualization with GSAP animations
- Dynamic step management with drag-and-drop reordering
- React Spring for interactive transitions
- Responsive design adapting to recipe complexity

### Mobile Experience
- Implemented touch-friendly brewing controls
- Created custom bottom sheets for step details
- Optimized animations for mobile performance
- Built responsive layouts for all screen sizes

### Timer Reliability
- Wake Lock API implementation for preventing device sleep (except for a known issue on ios devices)
    - Issue: ios does not honor the wake lock api when PWA's are added to the home screen. 
- Cross-platform sleep prevention strategies

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
- Screen Wake Lock API 

### Backend
- Node.js with Express
- MongoDB database
- JWT authentication

## Currently
- Working on update to recipe storage and handling to track changes to recipes and display versioning history with the ability to brew with past versions. 


## Future Development

- Advanced recipe recommendations
- Support for more brewing types beyond pour-overs
- Enhanced analytics and insights
- Offline mode support

## Installation

```bash
# Clone the repository
git clone https://github.com/benjaehyun/brewista.git

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
