import { useState } from 'react';

export const useVerification = () => {
  // Percentage verification
  const [percentageVerification, setPercentageVerification] = useState(null);
  const [percentageValue, setPercentageValue] = useState('');

  // Ward verification
  const [wardVerification, setWardVerification] = useState(null);
  const [wardDropdown, setWardDropdown] = useState('');

  // New Ward verification
  const [newWardVerification, setNewWardVerification] = useState(null);
  const [newWardDropdown, setNewWardDropdown] = useState('');

  // Zone verification
  const [zoneVerification, setZoneVerification] = useState(null);
  const [zoneDropdown, setZoneDropdown] = useState('');

  // Property verification
  const [propertyVerification, setPropertyVerification] = useState(null);
  const [propertyDropdown, setPropertyDropdown] = useState('');

  return {
    percentageVerification,
    setPercentageVerification,
    percentageValue,
    setPercentageValue,
    wardVerification,
    setWardVerification,
    wardDropdown,
    setWardDropdown,
    newWardVerification,
    setNewWardVerification,
    newWardDropdown,
    setNewWardDropdown,
    zoneVerification,
    setZoneVerification,
    zoneDropdown,
    setZoneDropdown,
    propertyVerification,
    setPropertyVerification,
    propertyDropdown,
    setPropertyDropdown,
  };
};
