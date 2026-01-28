// Format date as YYYY-MM-DD
export const formatDate1 = date => {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Format date as YYYY-MM
export const formatDate = date => {
  if (!date) return 'Select Date';

  try {
    const d = new Date(date);

    // Check if date is valid
    if (isNaN(d.getTime())) return 'Select Date';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Select Date';
  }
};

// Get label from dropdown options by value
export const getLabelFromOptions = (options, value) => {
  const found = options?.find(item => item.value === value);
  return found?.label || value || 'N/A';
};

// Get label by value from options array
export const getLabelByValue = (options, value) => {
  const found = options.find(option => option.value === value);
  return found ? found.label : '';
};

// Get preview value based on verification status
export const getPreviewValue = (
  original,
  dropdownValue,
  verification,
  options,
  inputValue = null,
) => {
  if (verification === 'Correct') return original;
  if (inputValue) return inputValue;
  if (dropdownValue instanceof Date) {
    return formatDate(dropdownValue);
  }
  return getLabelFromOptions(options, dropdownValue);
};

// Get verified ID based on verification status
export const getVerifiedId = (verification, originalValue, dropdownValue) => {
  if (verification === 'Correct' || !dropdownValue) {
    return originalValue;
  }
  return dropdownValue;
};
