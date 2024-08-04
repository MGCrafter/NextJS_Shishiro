"use client";
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const DropdownMenu: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Holt den aktuellen Pfad
  const [selectedOption, setSelectedOption] = useState('');

  // Erstelle ein Array von Optionen
  const options = ['links', 'header', 'welcome'];

  useEffect(() => {
    // Finde die Option, die im aktuellen Pfad enthalten ist
    const currentOption = options.find(option => pathname.includes(option));
    if (currentOption) {
      setSelectedOption(currentOption);
    }
  }, [pathname, options]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    router.push(`/admin/${value}`);
  };

  return (
    <div className="mb-6">
      <select
        value={selectedOption}
        onChange={handleChange}
        className="bg-white border border-gray-300 rounded py-2 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace(/settings/, ' Settings')}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;
