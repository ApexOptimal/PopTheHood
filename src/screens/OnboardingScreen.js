import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import VehicleFormModal from '../components/VehicleFormModal';
import InventoryFormModal from '../components/InventoryFormModal';

// Quick add item presets for suggestion tags
const quickAddItems = {
  'Motor Oil': { name: 'Motor Oil 5W-30', category: 'Fluids', unit: 'quarts' },
  'Oil Filters': { name: 'Engine Oil Filter', category: 'Filters', unit: 'units' },
  'Brake Pads': { name: 'Brake Pads', category: 'Parts', unit: 'sets' },
  'Spark Plugs': { name: 'Spark Plugs', category: 'Parts', unit: 'units' },
  'Tools': { name: '', category: 'Tools', unit: 'units' },
};

// Animation duration (25% slower than default 300ms = 375ms)
const ANIMATION_DURATION = 375;

export default function OnboardingScreen({ 
  vehicles, 
  inventory = [],
  onAddVehicle, 
  onAddInventoryItem,
  onSkip, 
  onComplete 
}) {
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 = vehicles, 2 = inventory
  const [prefilledItem, setPrefilledItem] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  
  // Animate success message when vehicles/inventory count changes
  useEffect(() => {
    if (vehicles.length > 0 && currentStep === 1) {
      Animated.timing(successAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [vehicles.length, currentStep]);
  
  useEffect(() => {
    if (inventory.length > 0 && currentStep === 2) {
      Animated.timing(successAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start();
    }
  }, [inventory.length, currentStep]);

  const handleQuickAdd = (itemKey) => {
    const preset = quickAddItems[itemKey];
    setPrefilledItem(preset);
    setShowInventoryForm(true);
  };

  const handleContinueToInventory = () => {
    // Animate out, then change step, then animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -30,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(2);
      successAnim.setValue(0);
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleBackToVehicles = () => {
    // Animate out, then change step, then animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 30,
        duration: ANIMATION_DURATION / 2,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentStep(1);
      successAnim.setValue(0);
      slideAnim.setValue(-30);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Step 1: Add Vehicles
  if (currentStep === 1) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }],
            width: '100%',
            alignItems: 'center',
          }}>
            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDot} />
              <View style={styles.progressLine} />
              <View style={[styles.progressDot, styles.progressDotInactive]} />
            </View>
            <Text style={styles.progressText}>Step 1 of 2</Text>

            <View style={styles.header}>
              <Ionicons name="car" size={80} color="#0066cc" />
              <Text style={styles.title}>
                {vehicles.length > 0 ? 'Add Another Vehicle' : 'Welcome to Pop the Hood'}
              </Text>
              <Text style={styles.subtitle}>
                {vehicles.length > 0 
                  ? 'Expand your garage with more vehicles to track'
                  : "Let's get started by adding your first vehicle"}
              </Text>
            </View>

          <View style={styles.steps}>
            <View style={[styles.step, styles.stepActive]}>
              <View style={[styles.stepNumber, styles.stepNumberActive]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, styles.stepTitleActive]}>Add Your Vehicles</Text>
                <Text style={styles.stepDescription}>
                  Track maintenance for all your vehicles in one place
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Stock Your Garage</Text>
                <Text style={styles.stepDescription}>
                  Add oils, filters, parts, and tools to your inventory
                </Text>
              </View>
            </View>
          </View>

          {vehicles.length > 0 && (
            <Animated.View style={[styles.success, { opacity: successAnim }]}>
              <Ionicons name="checkmark-circle" size={20} color="#4dff4d" />
              <Text style={styles.successText}>
                Great! You've added {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}.
              </Text>
            </Animated.View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowVehicleForm(true)}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {vehicles.length === 0 ? 'Add Your First Vehicle' : 'Add Another Vehicle'}
              </Text>
            </TouchableOpacity>
            
            {vehicles.length > 0 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleContinueToInventory}
              >
                <Text style={styles.secondaryButtonText}>Continue to Inventory</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipText}>
              {vehicles.length > 0 ? 'Return to app' : 'Skip for now'}
            </Text>
          </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {showVehicleForm && (
          <VehicleFormModal
            onSubmit={(vehicle) => {
              onAddVehicle(vehicle);
              setShowVehicleForm(false);
            }}
            onCancel={() => setShowVehicleForm(false)}
          />
        )}
      </SafeAreaView>
    );
  }

  // Step 2: Add Inventory
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={{ 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }],
          width: '100%',
          alignItems: 'center',
        }}>
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotCompleted]}>
              <Ionicons name="checkmark" size={12} color="#fff" />
            </View>
            <View style={[styles.progressLine, styles.progressLineCompleted]} />
            <View style={styles.progressDot} />
          </View>
          <Text style={styles.progressText}>Step 2 of 2</Text>

          <View style={styles.header}>
            <Ionicons name="cube" size={80} color="#00aa66" />
            <Text style={styles.title}>Stock Your Garage</Text>
            <Text style={styles.subtitle}>
              Add your oils, filters, parts, and tools to keep track of what you have on hand
            </Text>
          </View>

        <View style={styles.steps}>
          <View style={[styles.step, styles.stepCompleted]}>
            <View style={[styles.stepNumber, styles.stepNumberCompleted]}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, styles.stepTitleCompleted]}>
                Vehicles Added ({vehicles.length})
              </Text>
              <Text style={styles.stepDescription}>
                {vehicles.slice(0, 2).map(v => `${v.year} ${v.make} ${v.model}`).join(', ')}
                {vehicles.length > 2 && ` +${vehicles.length - 2} more`}
              </Text>
            </View>
          </View>

          <View style={[styles.step, styles.stepActive]}>
            <View style={[styles.stepNumber, styles.stepNumberActive]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, styles.stepTitleActive]}>Stock Your Garage</Text>
              <Text style={styles.stepDescription}>
                Track your parts inventory and get low-stock alerts
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Add Suggestions */}
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Common Items:</Text>
          <View style={styles.suggestionTags}>
            <TouchableOpacity style={styles.suggestionTag} onPress={() => handleQuickAdd('Motor Oil')}>
              <Ionicons name="water" size={12} color="#0066cc" />
              <Text style={styles.suggestionTagText}>Motor Oil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionTag} onPress={() => handleQuickAdd('Oil Filters')}>
              <Ionicons name="funnel" size={12} color="#0066cc" />
              <Text style={styles.suggestionTagText}>Oil Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionTag} onPress={() => handleQuickAdd('Brake Pads')}>
              <Ionicons name="disc" size={12} color="#0066cc" />
              <Text style={styles.suggestionTagText}>Brake Pads</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionTag} onPress={() => handleQuickAdd('Spark Plugs')}>
              <Ionicons name="flash" size={12} color="#0066cc" />
              <Text style={styles.suggestionTagText}>Spark Plugs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.suggestionTag} onPress={() => handleQuickAdd('Tools')}>
              <Ionicons name="build" size={12} color="#0066cc" />
              <Text style={styles.suggestionTagText}>Tools</Text>
            </TouchableOpacity>
          </View>
        </View>

        {inventory.length > 0 && (
          <Animated.View style={[styles.success, { opacity: successAnim }]}>
            <Ionicons name="checkmark-circle" size={20} color="#4dff4d" />
            <Text style={styles.successText}>
              Added {inventory.length} item{inventory.length !== 1 ? 's' : ''} to your inventory.
            </Text>
          </Animated.View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.primaryButtonGreen]}
            onPress={() => setShowInventoryForm(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>
              {inventory.length === 0 ? 'Add Your First Item' : 'Add Another Item'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onComplete}
          >
            <Text style={styles.secondaryButtonText}>
              {inventory.length > 0 ? 'Finish Setup' : 'Skip & Finish'}
            </Text>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleBackToVehicles}>
          <Ionicons name="arrow-back" size={16} color="#666" />
          <Text style={styles.skipText}>Back to vehicles</Text>
        </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {showInventoryForm && (
        <InventoryFormModal
          vehicles={vehicles}
          existingInventory={inventory}
          initialData={prefilledItem}
          onSubmit={(item) => {
            onAddInventoryItem(item);
            setShowInventoryForm(false);
            setPrefilledItem(null);
          }}
          onCancel={() => {
            setShowInventoryForm(false);
            setPrefilledItem(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 32,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotInactive: {
    backgroundColor: '#4d4d4d',
  },
  progressDotCompleted: {
    backgroundColor: '#00aa66',
  },
  progressLine: {
    width: 60,
    height: 3,
    backgroundColor: '#4d4d4d',
    marginHorizontal: 8,
  },
  progressLineCompleted: {
    backgroundColor: '#00aa66',
  },
  progressText: {
    fontSize: 12,
    color: '#808080',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  steps: {
    width: '100%',
    marginBottom: 24,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
    opacity: 0.6,
  },
  stepActive: {
    opacity: 1,
  },
  stepCompleted: {
    opacity: 0.8,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberActive: {
    backgroundColor: '#0066cc',
  },
  stepNumberCompleted: {
    backgroundColor: '#00aa66',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#808080',
    marginBottom: 4,
  },
  stepTitleActive: {
    color: '#ffffff',
  },
  stepTitleCompleted: {
    color: '#00aa66',
  },
  stepDescription: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  suggestionsContainer: {
    width: '100%',
    backgroundColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#b0b0b0',
    marginBottom: 8,
  },
  suggestionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#0066cc33',
  },
  suggestionTagText: {
    fontSize: 12,
    color: '#ffffff',
  },
  success: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a4d1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    gap: 8,
  },
  successText: {
    color: '#4dff4d',
    fontSize: 16,
    flex: 1,
  },
  actions: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonGreen: {
    backgroundColor: '#00aa66',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3d3d3d',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  skipText: {
    color: '#666',
    fontSize: 14,
  },
});
