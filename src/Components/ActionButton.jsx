import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Constants/Colors';
const ActionButton = ({ name, label, color = "#007AFF", onPress = () => { }, show = true }) => {
    if (!show)
        return null;
    return (
        <View style={styles.buttonWrapper}>
            <TouchableOpacity
                style={[styles.button, ]} 
                onPress={onPress}
            >
                <MaterialIcons
                    name={name}
                    size={10}
                    color={color} 
                />
                <Text style={[styles.label, { color, marginTop: 4 }]}>{label}</Text>
            </TouchableOpacity>
        </View>
    );
};
export default ActionButton;

const styles = StyleSheet.create({
    buttonWrapper: {
        width: '32%', 
        marginHorizontal: '0.66%', 
        marginBottom: 10,
    },
    button: {
        width: '100%',             // Must take the full width of its parent wrapper (32%)
        height: 'auto',            // Auto height based on content
        paddingVertical: 10,       // Vertical padding for internal spacing
        borderRadius: 8,           // Rounded corners
        alignItems: 'center',      // Center content horizontally
        justifyContent: 'center',  // Center content vertically
        borderWidth: 1,
        backgroundColor:"#e8f2f2ff",
        borderColor: '#ddd', 
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    label: {
        fontSize: 11, 
        fontWeight: '600',
        textAlign: 'center',
        paddingHorizontal: 2, 
        flexWrap: 'wrap',
    },
});