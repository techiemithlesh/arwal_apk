import { useState } from 'react';

export const useFloorManagement = () => {
  const [floorVerifications, setFloorVerifications] = useState({});
  const [floorDropdownValues, setFloorDropdownValues] = useState({});
  const [floorInputValues, setFloorInputValues] = useState({});

  // Helper function to update floor-specific state
  const updateFloorState = (
    floorId,
    field,
    value,
    stateType = 'verification',
  ) => {
    if (stateType === 'verification') {
      setFloorVerifications(prev => ({
        ...prev,
        [`${floorId}_${field}`]: value,
      }));
    } else if (stateType === 'dropdown') {
      setFloorDropdownValues(prev => ({
        ...prev,
        [`${floorId}_${field}`]: value,
      }));
    } else if (stateType === 'input') {
      setFloorInputValues(prev => ({
        ...prev,
        [`${floorId}_${field}`]: value,
      }));
    }
  };

  const getFloorState = (floorId, field, stateType = 'verification') => {
    if (stateType === 'verification') {
      return floorVerifications[`${floorId}_${field}`] || null;
    } else if (stateType === 'dropdown') {
      return floorDropdownValues[`${floorId}_${field}`] || '';
    } else if (stateType === 'input') {
      return floorInputValues[`${floorId}_${field}`] || '';
    }
  };

  return {
    floorVerifications,
    floorDropdownValues,
    floorInputValues,
    updateFloorState,
    getFloorState,
  };
};
