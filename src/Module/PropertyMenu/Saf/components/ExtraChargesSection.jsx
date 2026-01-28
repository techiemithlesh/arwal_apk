import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExtraChargesSection = ({
  propertyTypeId,
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
  yesNoOptions,
  isRessessment = false,
  isMutation = false,
}) => {
  const isDisabled = isRessessment || isMutation;
  // console.log('setCompletionDate ', completionDate);
  // const onChangeCompletionDate = (event, selectedDate) => {
  //   setShowDatePicker(false); // close picker
  //   if (event.type === 'set' && selectedDate) {
  //     setCompletionDate(selectedDate);
  //   }
  // };

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
        Mobile Tower
      </Text>
      <Dropdown
        style={{
          height: 45,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: '#fff',
          marginBottom: 12,
          justifyContent: 'center',
        }}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Mobile Tower"
        value={mobileTower}
        onChange={item => setMobileTower(item.value)}
        disable={isDisabled}
      />
      {mobileTower === 'yes' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
            Total Area Covered by Mobile Tower & Supporting Equipments (in Sq.
            Ft.)
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#fff',
              marginBottom: 12,
              fontSize: 16,
              color: '#333',
            }}
            placeholder="Eg. 200 SQMTR"
            value={towerArea}
            onChangeText={setTowerArea}
            editable={!isDisabled}
          />
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
            Date of Installation of Mobile Tower *
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#fff',
              marginBottom: 12,
              justifyContent: 'center',
            }}
            onPress={() => !isDisabled && setShowInstallationDatePicker(true)}
          >
            <Text style={{ color: installationDate ? '#000' : '#999' }}>
              {installationDate
                ? new Date(installationDate).toLocaleDateString('en-GB')
                : 'DD-MM-YYYY'}
            </Text>
          </TouchableOpacity>
          {showInstallationDatePicker && !isDisabled && (
            <DateTimePicker
              value={installationDate ? new Date(installationDate) : new Date()}
              maximumDate={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowInstallationDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setInstallationDate(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}
      <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
        Does Property Have Hoarding Board(s) ? *
      </Text>
      <Dropdown
        style={{
          height: 45,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 12,
          backgroundColor: '#fff',
          marginBottom: 12,
          justifyContent: 'center',
        }}
        data={yesNoOptions}
        labelField="label"
        valueField="value"
        placeholder="Does Property Have Hoarding Board(s) ? *"
        value={hoarding}
        onChange={item => setHoarding(item.value)}
        disable={isDisabled}
      />
      {hoarding === 'yes' && (
        <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
            Total Area of Wall / Roof / Land (in Sq. Ft.) *
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#fff',
              marginBottom: 12,
              fontSize: 16,
              color: '#333',
            }}
            placeholder="Total Area of Wall / Roof / Land (in Sq. Ft.) *"
            value={hoardingArea}
            onChangeText={setHoardingArea}
            placeholderTextColor="#000"
            editable={!isDisabled}
          />
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
            Date of Installation of Hoarding Board(s) *
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#fff',
              marginBottom: 12,
              justifyContent: 'center',
            }}
            onPress={() =>
              !isDisabled && setShowHoardingInstallationDatePicker(true)
            }
          >
            <Text style={{ color: hoardingInstallationDate ? '#000' : '#999' }}>
              {hoardingInstallationDate
                ? new Date(hoardingInstallationDate).toLocaleDateString('en-GB')
                : 'Date of Installation of Hoarding Board(s) *'}
            </Text>
          </TouchableOpacity>
          {showHoardingInstallationDatePicker && !isDisabled && (
            <DateTimePicker
              value={
                hoardingInstallationDate
                  ? new Date(hoardingInstallationDate)
                  : new Date()
              }
              maximumDate={new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowHoardingInstallationDatePicker(false);
                if (event.type === 'set' && selectedDate) {
                  setHoardingInstallationDate(selectedDate.toISOString());
                }
              }}
            />
          )}
        </View>
      )}

      {propertyTypeId != 4 && (
        <>
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
            Is property a Petrol Pump ? *
          </Text>
          <Dropdown
            style={{
              height: 45,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              backgroundColor: '#fff',
              marginBottom: 12,
              justifyContent: 'center',
            }}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Is property a Petrol Pump ? *"
            value={petrolPump}
            onChange={item => setPetrolPump(item.value)}
            disable={isDisabled}
          />
          {petrolPump === 'yes' && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
                Total Area of Petrol Pump (in Sq. Ft.) *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: '#fff',
                  marginBottom: 12,
                  fontSize: 16,
                  color: '#333',
                }}
                placeholder="Total Area of Petrol Pump (in Sq. Ft.) *"
                value={pumpArea}
                onChangeText={setPumpArea}
                placeholderTextColor="#000"
                editable={!isDisabled}
              />
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
                Date of Installation *
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: '#fff',
                  marginBottom: 12,
                  justifyContent: 'center',
                }}
                onPress={() =>
                  !isDisabled && setShowPumpInstallationDatePicker(true)
                }
              >
                <Text style={{ color: pumpInstallationDate ? '#000' : '#999' }}>
                  {pumpInstallationDate
                    ? new Date(pumpInstallationDate).toLocaleDateString('en-GB')
                    : 'Date of Installation *'}
                </Text>
              </TouchableOpacity>
              {showPumpInstallationDatePicker && !isDisabled && (
                <DateTimePicker
                  value={
                    pumpInstallationDate
                      ? new Date(pumpInstallationDate)
                      : new Date()
                  }
                  maximumDate={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPumpInstallationDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setPumpInstallationDate(selectedDate.toISOString());
                    }
                  }}
                />
              )}
            </View>
          )}
          <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
            Rainwater harvesting provision ? *
          </Text>
          <Dropdown
            style={{
              height: 45,
              borderColor: '#ccc',
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 12,
              backgroundColor: '#fff',
              marginBottom: 12,
              justifyContent: 'center',
            }}
            data={yesNoOptions}
            labelField="label"
            valueField="value"
            placeholder="Rainwater harvesting provision ? *"
            value={rainHarvesting}
            onChange={item => setRainHarvesting(item.value)}
            disable={isDisabled}
          />
          {rainHarvesting === 'yes' && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 5 }}>
                Rainwater harvesting Completion Date *
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: '#fff',
                  marginBottom: 12,
                  justifyContent: 'center',
                }}
                onPress={() => !isDisabled && setShowDatePicker(true)}
              >
                {/* <Text style={{ color: completionDate ? '#000' : '#999' }}>
              {completionDate
                ? completionDate.toLocaleDateString('en-GB')
                : 'Completion Date of Petrol Pump *'}
            </Text> */}
                <Text style={{ color: completionDate ? '#000' : '#999' }}>
                  {completionDate
                    ? new Date(completionDate).toLocaleDateString('en-GB')
                    : 'Completion Date of Petrol Pump *'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && !isDisabled && (
                <DateTimePicker
                  value={completionDate ? new Date(completionDate) : new Date()}
                  maximumDate={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (event.type === 'set' && selectedDate) {
                      setCompletionDate(selectedDate.toISOString()); // store as string
                    }
                  }}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default ExtraChargesSection;
