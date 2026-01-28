import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import Colors from '../Module/Constants/Colors';

const FormField = forwardRef(
  (
    {
      type = 'input', // 'input', 'dropdown', 'date', 'button', 'multiselect'
      label,
      placeholder,
      value,
      onChange,
      options = [],
      buttonLabel,
      onPressButton,
      onSubmitEditing,
      onFocus,
      returnKeyType = 'next',
      blurOnSubmit = false,
      error,
      editable = true,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);

    // Expose focus method for all component types
    useImperativeHandle(ref, () => ({
      focus: () => {
        console.log('FormField focus called:', {
          type,
          hasInputRef: !!inputRef.current,
          hasOnFocus: !!onFocus,
        });
        if (type === 'input' && inputRef.current) {
          console.log('Focusing TextInput via inputRef');
          inputRef.current.focus();
        } else if (onFocus) {
          console.log('Calling onFocus callback');
          onFocus();
        } else {
          console.log('No focus method available for type:', type);
        }
      },
    }));

    const renderInput = () => (
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={e => {
          console.log('TextInput onSubmitEditing called');
          if (onSubmitEditing) onSubmitEditing(e);
        }}
        onFocus={onFocus}
        returnKeyType={returnKeyType}
        blurOnSubmit={blurOnSubmit}
        editable={editable}
      />
    );

    const renderDropdown = () => (
      <Dropdown
        style={styles.input}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => {
          onChange(item.value);
          // Trigger onSubmitEditing after selection to move to next field
          if (onSubmitEditing) {
            setTimeout(() => onSubmitEditing(), 100);
          }
        }}
        onFocus={onFocus}
      />
    );

    const renderDate = () => (
      <>
        <Pressable
          onPress={() => {
            setOpen(true);
            if (onFocus) onFocus();
          }}
          style={styles.input}
        >
          <Text>{value ? new Date(value).toDateString() : placeholder}</Text>
        </Pressable>
        <DatePicker
          modal
          open={open}
          date={value || new Date()}
          mode="date"
          onConfirm={date => {
            setOpen(false);
            onChange(date);
            // Trigger onSubmitEditing after date selection to move to next field
            if (onSubmitEditing) {
              setTimeout(() => onSubmitEditing(), 100);
            }
          }}
          onCancel={() => setOpen(false)}
        />
      </>
    );

    const renderButton = () => (
      <Pressable onPress={onPressButton} style={styles.button}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    );

    const renderMultiSelect = () => (
      <MultiSelect
        style={styles.input}
        data={options}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={items => {
          onChange(items);
          // Trigger onSubmitEditing after selection to move to next field
          if (onSubmitEditing) {
            setTimeout(() => onSubmitEditing(), 100);
          }
        }}
        onFocus={onFocus}
        selectedTextStyle={styles.selectedTextStyle}
        selectedStyle={styles.selectedStyle}
        renderSelectedItem={(item, unSelect) => (
          <Pressable
            onPress={() => unSelect && unSelect(item)}
            style={styles.selectedItem}
          >
            <Text style={styles.selectedItemText}>{item.label}</Text>
            <Text style={styles.selectedItemRemove}>×</Text>
          </Pressable>
        )}
      />
    );

    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        {type === 'input' && renderInput()}
        {type === 'dropdown' && renderDropdown()}
        {type === 'multiselect' && renderMultiSelect()}
        {type === 'date' && renderDate()}
        {type === 'button' && renderButton()}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 22,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedItemText: {
    color: 'white',
    fontSize: 14,
    marginRight: 8,
  },
  selectedItemRemove: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
