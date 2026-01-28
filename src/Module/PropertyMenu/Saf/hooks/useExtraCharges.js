import { useState, useEffect } from 'react';

export const useExtraCharges = (data) => {
  // Mobile Tower
  const [mobileTower, setMobileTower] = useState('no');
  const [towerArea, setTowerArea] = useState('');
  const [installationDate, setInstallationDate] = useState(null);
  const [showInstallationDatePicker, setShowInstallationDatePicker] = useState(false);

  // Hoarding
  const [hoarding, setHoarding] = useState('no');
  const [hoardingArea, setHoardingArea] = useState('');
  const [hoardingInstallationDate, setHoardingInstallationDate] = useState(null);
  const [showHoardingInstallationDatePicker, setShowHoardingInstallationDatePicker] = useState(false);

  // Petrol Pump
  const [petrolPump, setPetrolPump] = useState('no');
  const [pumpArea, setPumpArea] = useState('');
  const [pumpInstallationDate, setPumpInstallationDate] = useState(null);
  const [showPumpInstallationDatePicker, setShowPumpInstallationDatePicker] = useState(false);

  // Rainwater Harvesting
  const [rainHarvesting, setRainHarvesting] = useState('no');
  const [completionDate, setCompletionDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (data) {
      // Mobile Tower
      setMobileTower(data.isMobileTower ? 'yes' : 'no');
      setTowerArea(data.towerArea || '');
      setInstallationDate(
        data.towerInstallationDate
          ? new Date(data.towerInstallationDate)
          : null,
      );

      // Hoarding
      setHoarding(data.isHoardingBoard ? 'yes' : 'no');
      setHoardingArea(data.hoardingArea || '');
      setHoardingInstallationDate(
        data.hoardingInstallationDate
          ? new Date(data.hoardingInstallationDate)
          : null,
      );

      // Petrol Pump
      setPetrolPump(data.isPetrolPump ? 'yes' : 'no');
      setPumpArea(data.underGroundArea || '');
      setPumpInstallationDate(
        data.petrolPumpCompletionDate
          ? new Date(data.petrolPumpCompletionDate)
          : null,
      );

      // Rainwater Harvesting
      setRainHarvesting(data.isWaterHarvesting ? 'yes' : 'no');
      setCompletionDate(
        data.waterHarvestingDate ? new Date(data.waterHarvestingDate) : null,
      );
    }
  }, [data]);

  return {
    mobileTower,
    setMobileTower,
    towerArea,
    setTowerArea,
    installationDate,
    setInstallationDate,
    showInstallationDatePicker,
    setShowInstallationDatePicker,
    hoarding,
    setHoarding,
    hoardingArea,
    setHoardingArea,
    hoardingInstallationDate,
    setHoardingInstallationDate,
    showHoardingInstallationDatePicker,
    setShowHoardingInstallationDatePicker,
    petrolPump,
    setPetrolPump,
    pumpArea,
    setPumpArea,
    pumpInstallationDate,
    setPumpInstallationDate,
    showPumpInstallationDatePicker,
    setShowPumpInstallationDatePicker,
    rainHarvesting,
    setRainHarvesting,
    completionDate,
    setCompletionDate,
    showDatePicker,
    setShowDatePicker,
  };
};
