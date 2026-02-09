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
        return '#ff4444';
      case 'yellow':
        return '#ffaa00';
      case 'green':
        return '#00cc66';
      case 'blue':
        return '#0066cc';
      default:
        return '#ffffff';
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
          <Ionicons name="warning" size={24} color="#0066cc" />
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
                >
                  <Ionicons name="close" size={24} color="#ffffff" />
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 16,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#b0b0b0',
    marginLeft: 32,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#4d4d4d',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  filterPillActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  filterPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#b0b0b0',
  },
  filterPillTextActive: {
    color: '#ffffff',
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
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  cardIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardName: {
    fontSize: 11,
    color: '#e0e0e0',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
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
    padding: 8,
    marginBottom: 16,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
  },
  modalActionSection: {
    backgroundColor: '#1a3a5c',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0066cc33',
  },
  modalActionSectionHigh: {
    backgroundColor: '#4d1a1a',
    borderColor: '#ff444433',
  },
  modalSectionTitleHigh: {
    color: '#ffaaaa',
  },
  modalAction: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
    fontWeight: '500',
  },
  modalActionHigh: {
    color: '#ffaaaa',
  },
  severityBadge: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    marginTop: 8,
  },
  severityText: {
    fontSize: 12,
    color: '#b0b0b0',
    fontWeight: '600',
  },
});
