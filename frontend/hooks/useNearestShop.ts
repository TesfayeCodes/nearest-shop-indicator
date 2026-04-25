// Custom hook for logic to find nearest shop
import { useState } from 'react';

export function useNearestShop() {
  const [shop, setShop] = useState(null);
  // TODO: Add logic using location/map API.
  return { shop, setShop };
}
