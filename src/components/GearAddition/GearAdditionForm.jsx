import React, { useState, useEffect } from 'react';

import debounce from 'lodash.debounce';

export default function GearAdditionForm () {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [models, setModels] = useState([]);
  const [inputBrand, setInputBrand] = useState('');

  // Fetch brands as the component mounts or input changes
  // useEffect(() => {
  //   const fetchBrands = async () => {
  //     try {
  //       const response = await axios.get(`/api/gear/brands?q=${inputBrand}`);
  //       setBrands(response.data);
  //     } catch (error) {
  //       console.error('Error fetching brands', error);
  //     }
  //   };
  //   fetchBrands();
  // }, [inputBrand]);

  // // Debounce brand input changes
  // const handleBrandChange = debounce((value) => {
  //   setInputBrand(value);
  // }, 300);

  // // Fetch models when a brand is selected
  // useEffect(() => {
  //   if (!selectedBrand) return;

  //   const fetchModels = async () => {
  //     try {
  //       const response = await axios.get(`/api/gear/models?brand=${selectedBrand}`);
  //       setModels(response.data);
  //     } catch (error) {
  //       console.error('Error fetching models for brand', error);
  //     }
  //   };
  //   fetchModels();
  // }, [selectedBrand]);

  return (
    // <div>
    //   <input
    //     type="text"
    //     placeholder="Type or select a brand"
    //     onChange={(e) => handleBrandChange(e.target.value)}
    //   />
    //   <select onChange={(e) => setSelectedBrand(e.target.value)}>
    //     {brands.map((brand, index) => (
    //       <option key={index} value={brand}>{brand}</option>
    //     ))}
    //   </select>
    //   {/* Similar structure for model and modification inputs */}
    // </div>
    <h1>gear addition form</h1>
  );
};
