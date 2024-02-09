// TabContent.jsx
export default function TabContent({ activeTab }) {
    switch (activeTab) {
      case 'posts':
        return <div>Post content</div>;
      case 'recipes':
        return <div>Recipes created by the user</div>;
      case 'saved':
        return <div>Recipes saved by the user</div>;
      default:
        return <div>Choose a category</div>;
    }
  }
  