import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function EmptyState({ icon = 'folder-open-outline', title, message }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={theme.colors.textTertiary} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    minHeight: 200,
  },
  title: {
    ...theme.typography.h4,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  message: {
    ...theme.typography.bodySmall,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});
