import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

const AppTooltip = ({ visible, text, onClose }) => {
  return (
    <Tooltip
      isVisible={visible}
      content={<Text style={styles.tooltipText}>{text}</Text>}
      placement="top"
      onClose={onClose}
    >
      {/* Invisible anchor */}
      <Text />
    </Tooltip>
  );
};

export default AppTooltip;
const styles = StyleSheet.create({
  tooltipText: {
    fontSize: 13,
    color: '#000',
  },
});
