import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  backgroundColor?: string;
  children: ReactNode;
};

export default function Container({
  backgroundColor,
  children,
}: Props): JSX.Element {
  return (
    <View
      style={{
        ...styles.container,
        ...(backgroundColor && { backgroundColor }),
      }}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 0,
  },
});
