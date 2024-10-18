import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomRadioButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: object;
  isEnabled: boolean; 
}

//"a radio button that i made because they dont have a library for it" -Jason
const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({ label, selected, onPress, style, isEnabled }) => { //React.FC is a way to make a custom components
  return (
    <TouchableOpacity 
      style={[styles.radioButton, style]} 
      onPress={isEnabled ? onPress : () => {}}
      disabled={!isEnabled} 
    >
      <Text style={styles.radioText}>{label}</Text>
      <View style={styles.radioBg}>
      
        {isEnabled && selected && <View style={styles.radio}></View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    justifyContent: "space-between",
  },
  radioBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5081FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5081FF',
  },
  radioText: {
    fontSize: 18,
    color: '#4E4E4E',
    marginRight: 10,
  },
});

export default CustomRadioButton;