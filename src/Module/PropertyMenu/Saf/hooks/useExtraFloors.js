import { useState } from 'react';

export const useExtraFloors = () => {
  const [addExtraFloor, setAddExtraFloor] = useState(false);
  const [floors, setFloors] = useState([]);

  const addFloor = () => {
    setFloors(prev => [
      ...prev,
      {
        floorName: '',
        constructionType: '',
        occupancyType: '',
        usageType: '',
        builtupArea: '',
        fromDate: null,
        toDate: null,
        showFromPicker: false,
        showToPicker: false,
      },
    ]);
  };

  const removeFloor = () => {
    setFloors(prev => prev.slice(0, -1));
  };

  const updateFloor = (index, field, value) => {
    setFloors(prev =>
      prev.map((floor, i) =>
        i === index ? { ...floor, [field]: value } : floor,
      ),
    );
  };

  return {
    addExtraFloor,
    setAddExtraFloor,
    floors,
    setFloors,
    addFloor,
    removeFloor,
    updateFloor,
  };
};
