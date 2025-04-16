# Brewista: Coffee Brewing Companion

### Note: Application is under active development, please refer to production branch for most recent stable version (deployed version). 
### Recent Updates: Refactoring front to back implementation of recipes to include recipe versions 
- All changes to recipes are now tracked as versions with major and minor versions
- Each recipe has a version history and the version can be easily switched on the recipe details page
- Adjusted wake lock api implementation to reinitialize lock when focus changes if the user changes window focus 
- Wake Lock API now supported on PWA version on IOS 14+
- Refactored database queries to use MongoDB Aggregation Pipelines to reduce API responses by ~85% for previous actions that required compounding queries following Recipe Version feature addition. 


## Links

🔗 Live deployment: [brewista](https://brewista-9c2f976eb426.herokuapp.com/)
<br>
🔗 Read more about the project's challenges, implementation details, and more! [Project Details](https://www.benjaelee.com/projects/brewista/)

## Project Overview

Brewista is a sophisticated coffee brewing companion application that changes the home brewing experience through precise calculations, interactive guidance, and community features. It combines brewing precision with an intuitive user interface to help coffee enthusiasts achieve consistent, high-quality results while being able to track and share them.


## Key Features

### Advanced Recipe Management
- Versioning system with main versions and branches
- Visual version history with branching visualization
- Change tracking between recipe iterations
- Support for copying and forking public recipes
- Personal recipe collections with bookmarking functionality

### Dynamic Recipe Scaling 
- Real-time recipe adjustments with scaling algorithms
- Support for both ratio-based and explicit measurements
- Precision to 0.1g for coffee and water measurements
- Intelligent scaling of bloom phases and brewing times

### Interactive Brewing Process
- Step-by-step guided brewing with real-time timers
- Visual timeline with GSAP-powered animations
- Smart time scaling for different brew sizes
- Equipment-specific brewing instructions

### Equipment & Bean Management
- Comprehensive coffee gear tracking with categorization
- Typeahead search for quick equipment selection
- Coffee bean database with roaster, origin, and processing details
- Personalized gear collections for streamlined recipe creation
- Intelligent validation and suggestion system

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
    - This issue should be resolved on ios version 14+! If issues persist, please try to upgrade software version for browser, operating system, or try a different browser. 
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

- Share Recipes via post or link sharing 
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

# Start the React frontend development server
npm start

# In a new terminal, start the backend server
node server.js
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
