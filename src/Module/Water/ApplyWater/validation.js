export const scrollToInput = (inputRef, scrollViewRef, offset = -100) => {
  if (!inputRef?.current || !scrollViewRef?.current) return;

  // For View wrapped dropdowns, get the actual view ref
  const targetRef = inputRef.current;
  
  // Use measure and scrollTo combination which works more reliably
  if (targetRef && typeof targetRef.measure === 'function') {
    targetRef.measure((x, y, width, height, pageX, pageY) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: Math.max(0, pageY + offset),
          animated: true
        });
        
        // Focus after scrolling
        setTimeout(() => {
          if (inputRef.current) {
            if (typeof inputRef.current.focus === 'function') {
              inputRef.current.focus();
            } else if (typeof inputRef.current.open === 'function') {
              inputRef.current.open();
            }
          }
        }, 300);
      }
    });
  } else {
    // Fallback for elements without measure
    console.log('Using fallback focus without scroll');
    if (inputRef.current) {
      if (typeof inputRef.current.focus === 'function') {
        inputRef.current.focus();
      } else if (typeof inputRef.current.open === 'function') {
        inputRef.current.open();
      }
    }
  }
};
const getAge = (dob) => {
  const diff = Date.now() - new Date(dob).getTime();
  return new Date(diff).getUTCFullYear() - 1970;
};


export const handleValidation = ({
  holdingNo,
holdingNoRef,
  totalArea,
  landmark,
  pin,
  address,
  applicants,
  typeOfConnection,
  connectionThrough,
  propertyType,
  ownerType,
  wardNo,
  // wardNo2,
  totalAreaRef,
  landmarRef,
  pincodeRef,
  addressRef,
  applicantRefs,
  typeOfConnectionRef,
  connectionThroughRef,
  propertyTypeRef,
  ownerTypeRef,
  wardNoRef,
  // wardNo2Ref,
  scrollViewRef,
  scrollToInput,

  setError,
}) => {
  // Clear previous errors
  setError({});
  
  // Sequential validation - stop at first error
  // Check Type of Connection
  if (!typeOfConnection) {
    setError({ typeOfConnection: 'Type of connection is required' });
    scrollToInput(typeOfConnectionRef, scrollViewRef);
    return false;
  }

  // Check Connection Through
  if (!connectionThrough) {
    setError({ connectionThrough: 'Connection through is required' });
    scrollToInput(connectionThroughRef, scrollViewRef);
    return false;
  }

if (connectionThrough === 1 && !holdingNo) {
  setError({ holdingNo: 'Holding number is required when Connection Through is 2' });
  scrollToInput(holdingNoRef, scrollViewRef);
  return false;
}


  // Check Property Type
  if (!propertyType) {
    setError({ propertyType: 'Property type is required' });
    scrollToInput(propertyTypeRef, scrollViewRef);
    return false;
  }

  // Check Owner Type
  if (!ownerType) {
    setError({ ownerType: 'Owner type is required' });
    scrollToInput(ownerTypeRef, scrollViewRef);
    return false;
  }

  // Check Ward No
  if (!wardNo) {
    setError({ wardNo: 'Ward number is required' });
    scrollToInput(wardNoRef, scrollViewRef);
    return false;
  }

  // Check New Ward No
  // if (!wardNo2) {
  //   setError({ wardNo2: 'New ward number is required' });
  //   scrollToInput(wardNo2Ref, scrollViewRef);
  //   return false;
  // }

  // Check Total Area
  if (!totalArea || totalArea.trim() === '') {
    setError({ totalArea: 'Total area is required' });
    scrollToInput(totalAreaRef, scrollViewRef);
    return false;
  }
  if (isNaN(totalArea) || parseFloat(totalArea) <= 0) {
    setError({ totalArea: 'Enter a valid area in sq. ft' });
    scrollToInput(totalAreaRef, scrollViewRef);
    return false;
  }

  // Check Landmark
  if (!landmark || landmark.trim() === '') {
    setError({ landmark: 'Landmark is required' });
    scrollToInput(landmarRef, scrollViewRef);
    return false;
  }

  // Check PIN
  if (!pin || pin.trim() === '') {
    setError({ pin: 'PIN code is required' });
    scrollToInput(pincodeRef, scrollViewRef);
    return false;
  }
  if (!/^\d{6}$/.test(pin)) {
    setError({ pin: 'Enter a valid 6-digit PIN code' });
    scrollToInput(pincodeRef, scrollViewRef);
    return false;
  }

  // Check Address
  if (!address || address.trim() === '') {
    setError({ address: 'Address is required' });
    scrollToInput(addressRef, scrollViewRef);
    return false;
  }

  // Validate applicants one by one
  for (let index = 0; index < applicants.length; index++) {
    const applicant = applicants[index];
    
    // Check Owner Name
    if (!applicant.ownerName || applicant.ownerName.trim() === '') {
      setError({ [`ownerName-${index}`]: 'Owner name is required' });
      if (applicantRefs.current[index * 2]) {
        scrollToInput({ current: applicantRefs.current[index * 2] }, scrollViewRef);
      }
      return false;
    }

    // Check Mobile Number
    if (!applicant.mobileNo || applicant.mobileNo.trim() === '') {
      setError({ [`mobileNo-${index}`]: 'Mobile number is required' });
      if (applicantRefs.current[index * 2 + 1]) {
        scrollToInput({ current: applicantRefs.current[index * 2 + 1] }, scrollViewRef);
      }
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(applicant.mobileNo)) {
      setError({ [`mobileNo-${index}`]: 'Enter a valid 10-digit mobile number' });
      if (applicantRefs.current[index * 2 + 1]) {
        scrollToInput({ current: applicantRefs.current[index * 2 + 1] }, scrollViewRef);
      }
      return false;
    }

     if (!applicant.ownerName || applicant.ownerName.trim() === '') {
      setError({ [`ownerName-${index}`]: 'Owner name is required' });
      if (applicantRefs.current[index * 2]) {
        scrollToInput({ current: applicantRefs.current[index * 2] }, scrollViewRef);
      }
      return false;
    }
if (!applicant.dob || applicant.dob.trim() === '') {
  setError({ [`dob-${index}`]: 'DOB is required' });
  scrollToInput({ current: applicantRefs.current[index * 3 + 2] }, scrollViewRef);
  return false;
}

if (getAge(applicant.dob) < 18) {
  setError({ [`dob-${index}`]: 'Applicant must be 18+ years old' });
  scrollToInput({ current: applicantRefs.current[index * 3 + 2] }, scrollViewRef);
  return false;
}
    // Check Email if provided
    if (applicant.email && applicant.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(applicant.email)) {
        setError({ [`email-${index}`]: 'Enter a valid email address' });
        // Email doesn't have a ref in current setup, just show error
        return false;
      }
    }
  }
  return true;
};
