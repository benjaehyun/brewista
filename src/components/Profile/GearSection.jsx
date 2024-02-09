// GearSection.jsx
export default function GearSection({ gear }) {
    // Placeholder for gear data. Assume `gear` prop is passed down or fetched here.
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gear.map((item) => (
          <div key={item.id} className="p-4 bg-white shadow rounded">
            <h3 className="text-md font-semibold">{item.name}</h3>
            {/* Additional gear details can be added here */}
          </div>
        ))}
      </div>
    );
  }
  