/* eslint-disable no-param-reassign */
import { useState } from 'react';
import { Location } from 'history';

const useLeaveRoute = () => {
  const [lastLocation, setLastLocation] = useState<string | null>(null);

  const handleLocationChange = (nextLocation: Location): boolean => {
    if (!lastLocation) {
      setLastLocation(nextLocation.pathname);

      return false;
    }

    return true;
  };

  return {
    handleLocationChange,
    lastLocation,
  };
};

export default useLeaveRoute;
