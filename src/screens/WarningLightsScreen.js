import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { warningLights, filterWarningLights } from '../data/warningLights';
import { theme } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 3; // 3 columns with padding
const ANIMATION_DURATION = 300;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function WarningLightsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLight, setSelectedLight] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredLights = filterWarningLights(selectedFilter);

  const openModal = (light) => {
    setSelectedLight(light);
    setModalVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedLight(null);
    });
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'red':
        return theme.colors.danger;
      case 'yellow':
        return theme.colors.warningLight;
      case 'green':
        return '#00cc66';
      case 'blue':
        return theme.colors.primary;
      default:
        return theme.colors.textPrimary;
    }
  };

  // Get icon component - uses MaterialCommunityIcons, falls back to Ionicons if needed
  const renderIcon = (iconName, size, color) => {
    // Icon fallback map for icons that don't exist in MaterialCommunityIcons
    // These will use Ionicons as fallback
    const iconFallbacks = {
      'oil-level': 'water-outline', // Ionicons - may need custom image
      'car-brake-abs': 'car-outline', // Ionicons - may need custom image  
      'car-traction-control': 'car-sport-outline', // Ionicons - may need custom image
      'car-shift-pattern': 'car-outline', // Ionicons - may need custom image
      'car-sport': 'car-sport-outline', // Ionicons - may need custom image
      'airbag': 'shield-outline', // Ionicons - may need custom image
      'seatbelt': 'lock-closed-outline', // Ionicons - may need custom image
    };

    const fallbackIcon = iconFallbacks[iconName];
    
    if (fallbackIcon) {
      // Use Ionicons fallback
      return <Ionicons name={fallbackIcon} size={size} color={color} />;
    }
    
    // Use MaterialCommunityIcons (most icons should work)
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  };

  const renderLightCard = ({ item, index }) => {
    const iconColor = getIconColor(item.color);
    
    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => openModal(item)}
          activeOpacity={0.7}
          accessibilityLabel={item.name}
          accessibilityRole="button"
        >
          <View style={styles.cardIconContainer}>
            {renderIcon(item.iconName, 48, iconColor)}
          </View>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderFilterPill = (filter, label) => {
    const isActive = selectedFilter === filter;
    return (
      <TouchableOpacity
        style={[styles.filterPill, isActive && styles.filterPillActive]}
        onPress={() => setSelectedFilter(filter)}
        activeOpacity={0.7}
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="warning" size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Warning Lights</Text>
        </View>
        <Text style={styles.headerSubtitle}>Dashboard Symbols Reference</Text>
      </View>

      {/* Filter Pills */}
      <View style={styles.filterContainer}>
        {renderFilterPill('all', 'All')}
        {renderFilterPill('red', 'Red/Danger')}
        {renderFilterPill('yellow', 'Yellow/Warning')}
      </View>

      {/* Grid View */}
      <FlatList
        data={filteredLights}
        renderItem={renderLightCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: slideAnim }],
                opacity: fadeAnim,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.modalScrollContent}
            >
            {selectedLight && (
              <>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>

                {/* Large Icon */}
                <View style={styles.modalIconContainer}>
                  {renderIcon(selectedLight.iconName, 80, getIconColor(selectedLight.color))}
                </View>

                {/* Name */}
                <Text style={styles.modalName}>{selectedLight.name}</Text>

                {/* What it means */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>What it means</Text>
                  <Text style={styles.modalDescription}>{selectedLight.description}</Text>
                </View>

                {/* What to do - Highlighted */}
                <View
                  style={[
                    styles.modalSection,
                    styles.modalActionSection,
                    selectedLight.severity === 'high' && styles.modalActionSectionHigh,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalSectionTitle,
                      selectedLight.severity === 'high' && styles.modalSectionTitleHigh,
                    ]}
                  >
                    What to do
                  </Text>
                  <Text
                    style={[
                      styles.modalAction,
                      selectedLight.severity === 'high' && styles.modalActionHigh,
                    ]}
                  >
                    {selectedLight.action}
                  </Text>
                </View>

                {/* Severity Badge */}
                <View style={styles.severityBadge}>
                  <Text style={styles.severityText}>
                    Severity: {selectedLight.severity.toUpperCase()}
                  </Text>
                </View>
              </>
            )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    ...theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 32,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterPillText: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterPillTextActive: {
    color: theme.colors.textPrimary,
  },
  gridContainer: {
    padding: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 16,
    marginRight: 8,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalScrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: theme.spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalName: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  modalActionSection: {
    backgroundColor: theme.colors.primaryDark,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary + '33',
  },
  modalActionSectionHigh: {
    backgroundColor: '#4d1a1a',
    borderColor: theme.colors.danger + '33',
  },
  modalSectionTitleHigh: {
    color: '#ffaaaa',
  },
  modalAction: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    fontWeight: '500',
  },
  modalActionHigh: {
    color: '#ffaaaa',
  },
  severityBadge: {
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    marginTop: 8,
  },
  severityText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
