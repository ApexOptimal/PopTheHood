import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
  Pressable,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
  Animated,
  Dimensions,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const ANIMATION_DURATION = 375; // 25% slower than default 300ms
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import { extractVINFromImage } from '../utils/visionAI';
import { decodeVIN, cleanVIN, isValidVIN } from '../utils/vinDecoder';
import { fetchRecalls, formatRecall, getRecallSummaryMessage } from '../utils/recalls';
import { identifyItemFromImage } from '../utils/visionAI';
import { copyToPermanentStorage } from '../utils/fileStorage';
import { resizeForVehicle } from '../utils/imageResize';
import {
  vehicleMakes,
  vehicleModels,
  vehicleData,
  getAvailableYears,
  getAvailableTrims,
  getTrimDetails,
  defaultServiceIntervals,
  defaultFluids,
  defaultTorqueSpecs,
  defaultTires,
  defaultHardware,
  defaultLighting,
  defaultPartsSKUs,
  vehicleSpecificSpecs
} from '../data/vehicleData';
import { importVehicleSpecs } from '../utils/vehicleSpecsImport';
import logger from '../utils/logger';

export default function VehicleFormModal({ initialData, isEditing, onSubmit, onCancel }) {
  const scrollViewRef = React.useRef(null);
  const [showServiceIntervalInfo, setShowServiceIntervalInfo] = useState(false);
  
  // Animation state
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Slide in on mount
  useEffect(() => {
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
  }, []);
  
  const handleAnimatedClose = (callback) => {
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
      if (callback) callback();
    });
  };
  
  const [formData, setFormData] = useState({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || '',
    trim: initialData?.trim || '',
    licensePlate: initialData?.licensePlate || '',
    nickname: initialData?.nickname || '',
    vin: initialData?.vin || '',
    color: initialData?.color || '',
    mileage: initialData?.mileage || '',
    notes: initialData?.notes || '',
    serviceIntervals: {
      oilChange: initialData?.serviceIntervals?.oilChange ? String(initialData.serviceIntervals.oilChange) : '',
      tireRotation: initialData?.serviceIntervals?.tireRotation ? String(initialData.serviceIntervals.tireRotation) : '',
      brakeInspection: initialData?.serviceIntervals?.brakeInspection ? String(initialData.serviceIntervals.brakeInspection) : '',
      airFilter: initialData?.serviceIntervals?.airFilter ? String(initialData.serviceIntervals.airFilter) : '',
      cabinFilter: initialData?.serviceIntervals?.cabinFilter ? String(initialData.serviceIntervals.cabinFilter) : '',
      sparkPlugs: initialData?.serviceIntervals?.sparkPlugs ? String(initialData.serviceIntervals.sparkPlugs) : '',
      transmission: initialData?.serviceIntervals?.transmission ? String(initialData.serviceIntervals.transmission) : '',
      coolant: initialData?.serviceIntervals?.coolant ? String(initialData.serviceIntervals.coolant) : '',
      brakeFluid: initialData?.serviceIntervals?.brakeFluid ? String(initialData.serviceIntervals.brakeFluid) : ''
    },
    recommendedFluids: {
      engineOil: initialData?.recommendedFluids?.engineOil || '',
      engineOilCapacity: initialData?.recommendedFluids?.engineOilCapacity || '',
      transmissionFluid: initialData?.recommendedFluids?.transmissionFluid || '',
      coolant: initialData?.recommendedFluids?.coolant || '',
      brakeFluid: initialData?.recommendedFluids?.brakeFluid || '',
      powerSteering: initialData?.recommendedFluids?.powerSteering || '',
      differential: initialData?.recommendedFluids?.differential || ''
    },
    torqueValues: initialData?.torqueValues || {
      suspension: {},
      engine: {}
    },
    tires: {
      tireSizeFront: initialData?.tires?.tireSizeFront || '',
      tireSizeRear: initialData?.tires?.tireSizeRear || '',
      tirePressureFront: initialData?.tires?.tirePressureFront || '',
      tirePressureRear: initialData?.tires?.tirePressureRear || '',
      wheelBoltPattern: initialData?.tires?.wheelBoltPattern || '',
      lugNutTorque: initialData?.tires?.lugNutTorque || ''
    },
    hardware: {
      batteryGroupSize: initialData?.hardware?.batteryGroupSize || '',
      wiperBladeDriver: initialData?.hardware?.wiperBladeDriver || '',
      wiperBladePassenger: initialData?.hardware?.wiperBladePassenger || '',
      wiperBladeRear: initialData?.hardware?.wiperBladeRear || ''
    },
    lighting: {
      headlightLow: initialData?.lighting?.headlightLow || '',
      headlightHigh: initialData?.lighting?.headlightHigh || '',
      fogLight: initialData?.lighting?.fogLight || '',
      brakeLight: initialData?.lighting?.brakeLight || '',
      turnSignal: initialData?.lighting?.turnSignal || '',
      interiorLight: initialData?.lighting?.interiorLight || '',
      trunkLight: initialData?.lighting?.trunkLight || ''
    },
    partsSKUs: {
      brakePads: initialData?.partsSKUs?.brakePads || '',
      brakeRotors: initialData?.partsSKUs?.brakeRotors || '',
      wheelHubs: initialData?.partsSKUs?.wheelHubs || '',
      wheelBearings: initialData?.partsSKUs?.wheelBearings || '',
      airFilter: initialData?.partsSKUs?.airFilter || '',
      cabinFilter: initialData?.partsSKUs?.cabinFilter || '',
      oilFilter: initialData?.partsSKUs?.oilFilter || '',
      fuelFilter: initialData?.partsSKUs?.fuelFilter || '',
      transmissionFilter: initialData?.partsSKUs?.transmissionFilter || ''
    },
    buildSheet: initialData?.buildSheet || {
      engine: '',
      intake: '',
      exhaust: '',
      fueling: '',
      ecu: '',
      suspension: '',
      body: ''
    }
  });

  const [availableYears, setAvailableYears] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableTrims, setAvailableTrims] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showBuildSheet, setShowBuildSheet] = useState(false);
  const [pickerModal, setPickerModal] = useState({ visible: false, type: null, data: [] });
  const [vehicleImages, setVehicleImages] = useState(() => {
    if (initialData?.images && initialData.images.length > 0) {
      return initialData.images.map(img => img.data).filter(Boolean).slice(0, 3);
    }
    if (initialData?.vehicleImage) return [initialData.vehicleImage];
    return [];
  });
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinSuccessBanner, setVinSuccessBanner] = useState(null);
  const vinBannerTimer = useRef(null);
  const [recalls, setRecalls] = useState([]);
  const [loadingRecalls, setLoadingRecalls] = useState(false);
  
  // Animation for VIN decoding
  const carAnimation = useRef(new Animated.Value(0)).current;
  const carOpacity = useRef(new Animated.Value(0)).current;
  const [completedRecalls, setCompletedRecalls] = useState(initialData?.completedRecalls || []);
  const [recallsExpanded, setRecallsExpanded] = useState(false);

  // Generate list of all years (1900 to current year + 1)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 1; year >= 1900; year--) {
      years.push(year);
    }
    setAvailableYears(years);
  }, []);

  // Update available models when make changes
  useEffect(() => {
    if (formData.make) {
      // Get models from detailed data first, fallback to legacy list
      const detailedModels = vehicleData[formData.make] ? Object.keys(vehicleData[formData.make]) : [];
      const legacyModels = vehicleModels[formData.make] || [];
      // Combine and deduplicate
      let allModels = [...new Set([...detailedModels, ...legacyModels])].sort();
      
      // If year is selected, filter models that were available in that year
      if (formData.year) {
        const selectedYear = parseInt(formData.year);
        allModels = allModels.filter(model => {
          const years = getAvailableYears(formData.make, model);
          return years.includes(selectedYear);
        });
      }
      
      setAvailableModels(allModels);
      // Reset model if it's not available for the new make/year combination
      if (formData.model && !allModels.includes(formData.model)) {
        setFormData(prev => ({ ...prev, model: '', trim: '' }));
      }
    } else {
      setAvailableModels([]);
    }
  }, [formData.make, formData.year]);

  // When year changes, validate against make/model if both are selected
  useEffect(() => {
    if (formData.make && formData.model && formData.year) {
      const years = getAvailableYears(formData.make, formData.model);
      const selectedYear = parseInt(formData.year);
      if (!years.includes(selectedYear)) {
        // Year is not valid for this make/model, reset model and trim
        setFormData(prev => ({ ...prev, model: '', trim: '' }));
      }
    }
  }, [formData.year]);

  // Update available trims when make/model/year changes
  useEffect(() => {
    if (formData.make && formData.model) {
      const trims = getAvailableTrims(formData.make, formData.model, formData.year ? parseInt(formData.year) : null);
      setAvailableTrims(trims);
      // Reset trim only if it's not in the list (case-insensitive) so we don't clear valid trims from VIN import
      const trimMatches = formData.trim && trims.some(t => (t || '').trim().toLowerCase() === (formData.trim || '').trim().toLowerCase());
      if (formData.trim && !trimMatches) {
        setFormData(prev => ({ ...prev, trim: '' }));
      }
    } else {
      setAvailableTrims([]);
    }
  }, [formData.make, formData.model, formData.year]);

  // Auto-populate service intervals and fluids when make/model/year/trim is selected (only for new vehicles)
  useEffect(() => {
    // Only auto-populate for new vehicles (not when editing)
    if (isEditing) return;
    
    // Need make, model, and year to be filled
    if (!formData.make || !formData.model || !formData.year) return;
    
    // Get trim details to determine if turbo or high-performance
    const trimDetails = formData.trim ? getTrimDetails(formData.make, formData.model, formData.trim) : null;
    const isTurbo = trimDetails?.turbo || false;
    
    // Check if this is a high-performance trim
    const isPerformance = formData.trim && (
      formData.trim.includes('GT350') || formData.trim.includes('GT500') || 
      formData.trim.includes('Hellcat') || formData.trim.includes('Demon') ||
      formData.trim.includes('M3') || formData.trim.includes('M4') || formData.trim.includes('M5') || formData.trim.includes('M8') ||
      formData.trim.includes('AMG') || formData.trim.includes('RS') ||
      formData.trim.includes('Type R') || formData.trim.includes('STI') ||
      formData.trim.includes('Evolution') || formData.trim.includes('ZL1') ||
      formData.trim.includes('Scat Pack') || formData.trim.includes('1LE') ||
      formData.trim.includes('GT3') || formData.trim.includes('GT2') || formData.trim.includes('Turbo S')
    );
    
    // Use performance-specific intervals for high-performance vehicles
    let makeIntervals = defaultServiceIntervals[formData.make] || defaultServiceIntervals.default;
    if (isPerformance && defaultServiceIntervals.performance) {
      makeIntervals = {
        ...makeIntervals,
        ...defaultServiceIntervals.performance
      };
    } else if (isTurbo && defaultServiceIntervals.turbo) {
      // Merge turbo intervals with make-specific
      makeIntervals = {
        ...makeIntervals,
        oilChange: defaultServiceIntervals.turbo.oilChange,
        sparkPlugs: defaultServiceIntervals.turbo.sparkPlugs
      };
    }
    
    // First, check for vehicle-specific specs (highest priority)
    // This ensures WRX gets 5W-30, not the Subaru default 0W-20
    let makeFluids = defaultFluids[formData.make] || defaultFluids.default;
    let hasVehicleSpecificFluids = false;
    
    // Check for vehicle-specific specs first (e.g., WRX, STI, Forester XT)
    if (formData.make && formData.model && formData.year && vehicleSpecificSpecs[formData.make] && vehicleSpecificSpecs[formData.make][formData.model]) {
      const modelSpecs = vehicleSpecificSpecs[formData.make][formData.model];
      const year = parseInt(formData.year);
      
      // Check each year range to find a match
      for (const key in modelSpecs) {
        const rangeStr = String(key);
        let yearMatches = false;
        
        if (!rangeStr.includes('-')) {
          yearMatches = parseInt(rangeStr) === year;
        } else {
          const [start, end] = rangeStr.split('-').map(y => parseInt(y.trim()));
          if (!isNaN(start) && !isNaN(end)) {
            yearMatches = year >= start && year <= end;
          }
        }
        
        if (yearMatches) {
          const yearSpecs = modelSpecs[key];
          
          // Check for trim-specific first, then base specs
          if (formData.trim && yearSpecs.trims && yearSpecs.trims[formData.trim] && yearSpecs.trims[formData.trim].recommendedFluids) {
            makeFluids = { ...makeFluids, ...yearSpecs.trims[formData.trim].recommendedFluids };
            hasVehicleSpecificFluids = true;
          } else if (yearSpecs.recommendedFluids) {
            makeFluids = { ...makeFluids, ...yearSpecs.recommendedFluids };
            hasVehicleSpecificFluids = true;
          }
          break; // Found match, stop searching
        }
      }
    }
    
    // Only apply turbo/supercharged defaults if we didn't find vehicle-specific specs
    if (!hasVehicleSpecificFluids) {
      const isSupercharged = formData.trim && (
        formData.trim.includes('GT500') || formData.trim.includes('Hellcat') || 
        formData.trim.includes('Demon') || formData.trim.includes('ZL1') ||
        formData.trim.includes('ZR1') || formData.trim.includes('TRX')
      );
      
      if (isSupercharged && defaultFluids.supercharged) {
        makeFluids = {
          ...makeFluids,
          engineOil: defaultFluids.supercharged.engineOil,
          engineOilCapacity: defaultFluids.supercharged.engineOilCapacity,
          brakeFluid: defaultFluids.supercharged.brakeFluid,
          differential: defaultFluids.supercharged.differential
        };
      } else if (isTurbo && defaultFluids.turbo && !makeFluids.engineOil.includes('Turbo Rated')) {
        // Only apply turbo default if vehicle-specific didn't already set it
        makeFluids = {
          ...makeFluids,
          engineOil: defaultFluids.turbo.engineOil
        };
      }
    }
    
    // Check if intervals/fluids are empty (first time selection)
    const intervalsEmpty = !formData.serviceIntervals.oilChange && 
                          !formData.serviceIntervals.tireRotation &&
                          !formData.serviceIntervals.brakeInspection &&
                          !formData.serviceIntervals.airFilter;
    
    const fluidsEmpty = !formData.recommendedFluids.engineOil && 
                        !formData.recommendedFluids.transmissionFluid &&
                        !formData.recommendedFluids.coolant;
    
    // Check if torque values are empty
    const torqueEmpty = !formData.torqueValues?.suspension?.wheelLugNuts &&
                        !formData.torqueValues?.engine?.sparkPlugs;
    
    // Check if tire values are empty
    const tiresEmpty = !formData.tires?.tireSizeFront && !formData.tires?.wheelBoltPattern;
    
    // Check if hardware values are empty
    const hardwareEmpty = !formData.hardware?.batteryGroupSize && !formData.hardware?.wiperBladeDriver;
    
    // Check if lighting values are empty
    const lightingEmpty = !formData.lighting?.headlightLow && !formData.lighting?.headlightHigh;
    
    // Check if parts SKUs are empty
    const partsSKUsEmpty = !formData.partsSKUs?.brakePads && !formData.partsSKUs?.oilFilter;
    
    // Get base specs (make-level defaults)
    let makeTorque = defaultTorqueSpecs[formData.make] || defaultTorqueSpecs.default;
    let makeTires = defaultTires[formData.make] || defaultTires.default;
    let makeHardware = defaultHardware[formData.make] || defaultHardware.default;
    let makeLighting = defaultLighting[formData.make] || defaultLighting.default;
    let makePartsSKUs = defaultPartsSKUs[formData.make] || defaultPartsSKUs.default;
    
    // Check for vehicle-specific specs (highest priority - includes trim-level specs)
    // Priority order: Trim-specific > Year-range base > Make default
    // This ensures:
    // - WRX Limited gets 245/40R18 tires (trim-specific), not base 235/45R17
    // - WRX gets 5W-30 oil (year-range specific), not Subaru default 0W-20
    // - All specs are accurate down to the trim level
    if (formData.make && formData.model && formData.year && vehicleSpecificSpecs[formData.make] && vehicleSpecificSpecs[formData.make][formData.model]) {
      const modelSpecs = vehicleSpecificSpecs[formData.make][formData.model];
      const year = parseInt(formData.year);
      
      // Check each year range to find a match
      for (const key in modelSpecs) {
        const rangeStr = String(key);
        let yearMatches = false;
        
        if (!rangeStr.includes('-')) {
          yearMatches = parseInt(rangeStr) === year;
        } else {
          const [start, end] = rangeStr.split('-').map(y => parseInt(y.trim()));
          if (!isNaN(start) && !isNaN(end)) {
            yearMatches = year >= start && year <= end;
          }
        }
        
        if (yearMatches) {
          const yearSpecs = modelSpecs[key];
          
          // Check for trim-specific first (most specific), then base specs for year range
          if (formData.trim && yearSpecs.trims && yearSpecs.trims[formData.trim]) {
            const trimSpecs = yearSpecs.trims[formData.trim];
            
            // Merge trim-specific specs with base year specs (trim overrides base)
            if (trimSpecs.tires) {
              makeTires = { ...makeTires, ...yearSpecs.tires, ...trimSpecs.tires };
            } else if (yearSpecs.tires) {
              makeTires = { ...makeTires, ...yearSpecs.tires };
            }
            
            if (trimSpecs.hardware) {
              makeHardware = { ...makeHardware, ...yearSpecs.hardware, ...trimSpecs.hardware };
            } else if (yearSpecs.hardware) {
              makeHardware = { ...makeHardware, ...yearSpecs.hardware };
            }
            
            if (trimSpecs.lighting) {
              makeLighting = { ...makeLighting, ...yearSpecs.lighting, ...trimSpecs.lighting };
            } else if (yearSpecs.lighting) {
              makeLighting = { ...makeLighting, ...yearSpecs.lighting };
            }
            
            if (trimSpecs.torqueValues) {
              makeTorque = { 
                suspension: { ...makeTorque.suspension, ...yearSpecs.torqueValues?.suspension, ...trimSpecs.torqueValues?.suspension },
                engine: { ...makeTorque.engine, ...yearSpecs.torqueValues?.engine, ...trimSpecs.torqueValues?.engine }
              };
            } else if (yearSpecs.torqueValues) {
              makeTorque = {
                suspension: { ...makeTorque.suspension, ...yearSpecs.torqueValues.suspension },
                engine: { ...makeTorque.engine, ...yearSpecs.torqueValues.engine }
              };
            }
            
            if (trimSpecs.partsSKUs) {
              makePartsSKUs = { ...makePartsSKUs, ...yearSpecs.partsSKUs, ...trimSpecs.partsSKUs };
            } else if (yearSpecs.partsSKUs) {
              makePartsSKUs = { ...makePartsSKUs, ...yearSpecs.partsSKUs };
            }
          } else {
            // No trim-specific specs, use base specs for year range
            if (yearSpecs.tires) {
              makeTires = { ...makeTires, ...yearSpecs.tires };
            }
            if (yearSpecs.hardware) {
              makeHardware = { ...makeHardware, ...yearSpecs.hardware };
            }
            if (yearSpecs.lighting) {
              makeLighting = { ...makeLighting, ...yearSpecs.lighting };
            }
            if (yearSpecs.torqueValues) {
              makeTorque = {
                suspension: { ...makeTorque.suspension, ...yearSpecs.torqueValues.suspension },
                engine: { ...makeTorque.engine, ...yearSpecs.torqueValues.engine }
              };
            }
            if (yearSpecs.partsSKUs) {
              makePartsSKUs = { ...makePartsSKUs, ...yearSpecs.partsSKUs };
            }
          }
          break; // Found match, stop searching
        }
      }
    }
    
    // Only auto-populate if fields are empty (don't overwrite user edits)
    if (intervalsEmpty || fluidsEmpty || torqueEmpty || tiresEmpty || hardwareEmpty || lightingEmpty || partsSKUsEmpty) {
      setFormData(prev => ({
        ...prev,
        serviceIntervals: intervalsEmpty ? {
          oilChange: makeIntervals.oilChange.toString(),
          tireRotation: makeIntervals.tireRotation.toString(),
          brakeInspection: makeIntervals.brakeInspection.toString(),
          airFilter: makeIntervals.airFilter.toString(),
          cabinFilter: makeIntervals.cabinFilter.toString(),
          sparkPlugs: makeIntervals.sparkPlugs.toString(),
          transmission: makeIntervals.transmission.toString(),
          coolant: makeIntervals.coolant.toString(),
          brakeFluid: makeIntervals.brakeFluid.toString()
        } : prev.serviceIntervals,
        recommendedFluids: fluidsEmpty ? {
          engineOil: makeFluids.engineOil,
          engineOilCapacity: makeFluids.engineOilCapacity,
          transmissionFluid: makeFluids.transmissionFluid,
          coolant: makeFluids.coolant,
          brakeFluid: makeFluids.brakeFluid,
          powerSteering: makeFluids.powerSteering,
          differential: makeFluids.differential
        } : prev.recommendedFluids,
        torqueValues: torqueEmpty ? {
          suspension: makeTorque.suspension,
          engine: makeTorque.engine
        } : prev.torqueValues,
        tires: tiresEmpty ? {
          tireSizeFront: makeTires.tireSizeFront,
          tireSizeRear: makeTires.tireSizeRear,
          tirePressureFront: makeTires.tirePressureFront,
          tirePressureRear: makeTires.tirePressureRear,
          wheelBoltPattern: makeTires.wheelBoltPattern,
          lugNutTorque: makeTires.lugNutTorque
        } : prev.tires,
        hardware: hardwareEmpty ? {
          batteryGroupSize: makeHardware.batteryGroupSize,
          wiperBladeDriver: makeHardware.wiperBladeDriver,
          wiperBladePassenger: makeHardware.wiperBladePassenger,
          wiperBladeRear: makeHardware.wiperBladeRear
        } : prev.hardware,
        lighting: lightingEmpty ? {
          headlightLow: makeLighting.headlightLow,
          headlightHigh: makeLighting.headlightHigh,
          fogLight: makeLighting.fogLight,
          brakeLight: makeLighting.brakeLight,
          turnSignal: makeLighting.turnSignal,
          interiorLight: makeLighting.interiorLight,
          trunkLight: makeLighting.trunkLight
        } : prev.lighting,
        partsSKUs: partsSKUsEmpty ? {
          brakePads: makePartsSKUs.brakePads,
          brakeRotors: makePartsSKUs.brakeRotors,
          wheelHubs: makePartsSKUs.wheelHubs,
          wheelBearings: makePartsSKUs.wheelBearings,
          airFilter: makePartsSKUs.airFilter,
          cabinFilter: makePartsSKUs.cabinFilter,
          oilFilter: makePartsSKUs.oilFilter,
          fuelFilter: makePartsSKUs.fuelFilter,
          transmissionFilter: makePartsSKUs.transmissionFilter
        } : prev.partsSKUs
      }));
    }
  }, [formData.make, formData.model, formData.year, formData.trim, isEditing]);

  const handleSubmit = () => {
    if (!formData.make || !formData.model || !formData.year) {
      Alert.alert('Error', 'Please fill in at least Make, Model, and Year');
      return;
    }

    // Convert service intervals to numbers
    const serviceIntervals = {
      oilChange: formData.serviceIntervals.oilChange ? parseInt(formData.serviceIntervals.oilChange) : undefined,
      tireRotation: formData.serviceIntervals.tireRotation ? parseInt(formData.serviceIntervals.tireRotation) : undefined,
      brakeInspection: formData.serviceIntervals.brakeInspection ? parseInt(formData.serviceIntervals.brakeInspection) : undefined,
      airFilter: formData.serviceIntervals.airFilter ? parseInt(formData.serviceIntervals.airFilter) : undefined,
      cabinFilter: formData.serviceIntervals.cabinFilter ? parseInt(formData.serviceIntervals.cabinFilter) : undefined,
      sparkPlugs: formData.serviceIntervals.sparkPlugs ? parseInt(formData.serviceIntervals.sparkPlugs) : undefined,
      transmission: formData.serviceIntervals.transmission ? parseInt(formData.serviceIntervals.transmission) : undefined,
      coolant: formData.serviceIntervals.coolant ? parseInt(formData.serviceIntervals.coolant) : undefined,
      brakeFluid: formData.serviceIntervals.brakeFluid ? parseInt(formData.serviceIntervals.brakeFluid) : undefined
    };

    // Remove undefined values
    Object.keys(serviceIntervals).forEach(key => {
      if (serviceIntervals[key] === undefined) {
        delete serviceIntervals[key];
      }
    });

    // Remove empty fluid values
    const recommendedFluids = { ...formData.recommendedFluids };
    Object.keys(recommendedFluids).forEach(key => {
      if (!recommendedFluids[key]) {
        delete recommendedFluids[key];
      }
    });

    // Clean up empty tire values
    const tires = { ...formData.tires };
    Object.keys(tires).forEach(key => {
      if (!tires[key]) {
        delete tires[key];
      }
    });

    // Clean up empty hardware values
    const hardware = { ...formData.hardware };
    Object.keys(hardware).forEach(key => {
      if (!hardware[key]) {
        delete hardware[key];
      }
    });

    // Clean up empty lighting values
    const lighting = { ...formData.lighting };
    Object.keys(lighting).forEach(key => {
      if (!lighting[key]) {
        delete lighting[key];
      }
    });

    // Clean up empty parts SKU values
    const partsSKUs = { ...formData.partsSKUs };
    Object.keys(partsSKUs).forEach(key => {
      if (!partsSKUs[key]) {
        delete partsSKUs[key];
      }
    });

    // Clean up empty modifications (buildSheet) values
    const buildSheet = { ...formData.buildSheet };
    Object.keys(buildSheet).forEach(key => {
      if (!buildSheet[key]) {
        delete buildSheet[key];
      }
    });

    onSubmit({
      ...formData,
      serviceIntervals: Object.keys(serviceIntervals).length > 0 ? serviceIntervals : undefined,
      recommendedFluids: Object.keys(recommendedFluids).length > 0 ? recommendedFluids : undefined,
      torqueValues: formData.torqueValues,
      tires: Object.keys(tires).length > 0 ? tires : undefined,
      hardware: Object.keys(hardware).length > 0 ? hardware : undefined,
      lighting: Object.keys(lighting).length > 0 ? lighting : undefined,
      partsSKUs: Object.keys(partsSKUs).length > 0 ? partsSKUs : undefined,
      buildSheet: Object.keys(buildSheet).length > 0 ? buildSheet : undefined,
      images: vehicleImages.length > 0 ? vehicleImages.map((uri, i) => ({ id: `img_${i}`, data: uri })) : undefined,
      vehicleImage: vehicleImages[0] || undefined,
      completedRecalls: completedRecalls.length > 0 ? completedRecalls : undefined
    });
  };

  const handleMakeChange = (make) => {
    setFormData({
      ...formData,
      make: make,
      model: '',
      trim: '',
      serviceIntervals: {
        oilChange: '',
        tireRotation: '',
        brakeInspection: '',
        airFilter: '',
        cabinFilter: '',
        sparkPlugs: '',
        transmission: '',
        coolant: '',
        brakeFluid: ''
      },
      recommendedFluids: {
        engineOil: '',
        engineOilCapacity: '',
        transmissionFluid: '',
        coolant: '',
        brakeFluid: '',
        powerSteering: '',
        differential: ''
      },
      torqueValues: {
        suspension: {},
        engine: {}
      },
      tires: {
        tireSizeFront: '',
        tireSizeRear: '',
        tirePressureFront: '',
        tirePressureRear: '',
        wheelBoltPattern: '',
        lugNutTorque: ''
      },
      hardware: {
        batteryGroupSize: '',
        wiperBladeDriver: '',
        wiperBladePassenger: '',
        wiperBladeRear: ''
      },
      lighting: {
        headlightLow: '',
        headlightHigh: '',
        fogLight: '',
        brakeLight: '',
        turnSignal: '',
        interiorLight: '',
        trunkLight: ''
      },
      partsSKUs: {
        brakePads: '',
        brakeRotors: '',
        wheelHubs: '',
        wheelBearings: '',
        airFilter: '',
        cabinFilter: '',
        oilFilter: '',
        fuelFilter: '',
        transmissionFilter: ''
      }
    });
    setPickerModal({ visible: false, type: null, data: [] });
  };

  const openPicker = (type, data) => {
    setPickerModal({ visible: true, type, data });
  };

  const closePicker = () => {
    const closedType = pickerModal.type;
    setPickerModal({ visible: false, type: null, data: [] });
    // After closing Year/Make/Model picker, scroll form to top so next field (e.g. Model) is visible
    if (closedType === 'year' || closedType === 'make' || closedType === 'model') {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 150);
    }
  };

  const handlePickerSelect = (value) => {
    if (pickerModal.type === 'year') {
      setFormData({
        ...formData,
        year: String(value),
        model: '',
        trim: ''
      });
    } else if (pickerModal.type === 'make') {
      handleMakeChange(value);
      closePicker();
      return;
    } else if (pickerModal.type === 'model') {
      setFormData({
        ...formData,
        model: value || '',
        trim: ''
      });
    } else if (pickerModal.type === 'trim') {
      setFormData({ ...formData, trim: value || '' });
    }
    closePicker();
  };

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    if (vehicleImages.length >= 3) {
      Alert.alert('Photo Limit', 'You can add up to 3 photos per vehicle. Remove a photo first to add a new one.');
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const permanentUri = await resizeForVehicle(result.assets[0].uri);
        setVehicleImages(prev => [...prev, permanentUri].slice(0, 3));
      }
    } catch (error) {
      logger.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    if (vehicleImages.length >= 3) {
      Alert.alert('Photo Limit', 'You can add up to 3 photos per vehicle. Remove a photo first to add a new one.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const permanentUri = await resizeForVehicle(result.assets[0].uri);
        setVehicleImages(prev => [...prev, permanentUri].slice(0, 3));
      }
    } catch (error) {
      logger.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleRemoveImage = (index) => {
    setVehicleImages(prev => prev.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Vehicle Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: handleTakePhoto },
        { text: 'Photo Library', onPress: handlePickImage },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleScanVIN = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      // Show option to use camera or photo library
      Alert.alert(
        'Scan VIN',
        'Take a photo of the VIN from the door jam or paperwork',
        [
          {
            text: 'Camera',
            onPress: async () => {
              try {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
                  allowsEditing: false,
                  quality: 0.8,
                  base64: false,
                });

                if (result.canceled || !result.assets || result.assets.length === 0) {
                  return;
                }

                await processVINImage(result.assets[0].uri);
              } catch (error) {
                logger.error('Camera error:', error);
                Alert.alert('Error', 'Failed to take photo. Please try again.');
              }
            }
          },
          {
            text: 'Photo Library',
            onPress: async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaType?.Images ?? 'images',
                  allowsEditing: false,
                  quality: 0.8,
                  base64: false,
                });

                if (result.canceled || !result.assets || result.assets.length === 0) {
                  return;
                }

                await processVINImage(result.assets[0].uri);
              } catch (error) {
                logger.error('Photo library error:', error);
                Alert.alert('Error', 'Failed to select photo. Please try again.');
              }
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } catch (error) {
      logger.error('Error in handleScanVIN:', error);
      Alert.alert('Error', 'Failed to scan VIN. Please try again.');
    }
  };

  const processVINImage = async (imageUri) => {
    try {
      // Extract VIN using AI
      const extractedVIN = await extractVINFromImage(imageUri);
      
      if (extractedVIN && extractedVIN.length === 17) {
        // Automatically decode VIN and fill in vehicle details (no alert, just process)
        await handleVINChange(extractedVIN, false);
      } else {
        // Only show error if VIN couldn't be extracted at all
        if (__DEV__) console.warn('VIN not found in image');
        // Don't show alert - user can try again or enter manually
      }
    } catch (error) {
      logger.error('Error processing VIN image:', error);
      // Don't show alert - user can try again or enter manually
    }
  };

  // Helper function to normalize and match make/model names
  const normalizeName = (name) => {
    if (!name) return '';
    return name.trim().toUpperCase().replace(/[-\s]+/g, '');
  };

  const findMatchingMake = (make) => {
    if (!make) return null;
    const normalized = normalizeName(make);
    return vehicleMakes.find(m => normalizeName(m) === normalized);
  };

  const findMatchingModel = (model, make) => {
    if (!model || !make) return null;
    const makeData = vehicleData[make];
    if (!makeData) return null;
    
    const normalizedModel = normalizeName(model);
    // Try exact match first
    if (makeData[model]) return model;
    
    // Try normalized match
    const match = Object.keys(makeData).find(m => normalizeName(m) === normalizedModel);
    return match || null;
  };

  // Helper function to split model and trim if they're combined (e.g., "WRX Limited")
  const splitModelAndTrim = (modelString, make, existingTrim) => {
    if (__DEV__) console.log('splitModelAndTrim called:', { modelString, make, existingTrim });
    
    // Only skip splitting if we have a valid existing trim
    // If existingTrim is empty/null/undefined, we should still try to split
    if (!modelString) {
      return { model: null, trim: existingTrim || null };
    }
    
    if (existingTrim && existingTrim.trim().length > 0) {
      // If trim is already set and valid, don't try to split
      if (__DEV__) console.log('Skipping split - trim already exists:', existingTrim);
      return { model: modelString, trim: existingTrim };
    }

    // Common trim names that might be combined with model
    const commonTrims = [
      'Limited', 'Premium', 'Base', 'Sport', 'Touring', 'LE', 'SE', 'XLE', 'XSE',
      'LX', 'EX', 'EX-L', 'Touring', 'Elite', 'Platinum', 'Titanium', 'ST', 'STI',
      'GT', 'GTI', 'R', 'S', 'SR', 'SR5', 'TRD', 'Off-Road', 'Pro', 'Hybrid',
      'Wilderness', 'Onyx', 'XT', 'Type R', 'Type S', 'AMG', 'M Sport', 'M',
      'S Line', 'S-Line', 'R-Line', 'Black Edition', 'Edition One'
    ];

    // Check if model string contains any trim name
    for (const trim of commonTrims) {
      const trimRegex = new RegExp(`\\b${trim}\\b`, 'i');
      if (trimRegex.test(modelString)) {
        // Try to extract the model part (everything before the trim)
        const parts = modelString.split(new RegExp(`\\b${trim}\\b`, 'i'));
        const extractedModel = parts[0].trim();
        const extractedTrim = trim;

        // Verify that the extracted model exists in our database
        if (make) {
          const makeData = vehicleData[make];
          if (makeData && (makeData[extractedModel] || findMatchingModel(extractedModel, make))) {
            return { model: extractedModel, trim: extractedTrim };
          }
        }

        // Even if not in database, split it if it makes sense (e.g., "WRX Limited" -> "WRX" + "Limited")
        if (extractedModel.length > 0 && extractedModel !== modelString) {
          return { model: extractedModel, trim: extractedTrim };
        }
      }
    }

    // If no trim found, return model as-is
    return { model: modelString, trim: null };
  };

  // Aliases for trim names (e.g. title/notes may say "LTD" for "Limited")
  const TRIM_ALIASES = { 'LTD': 'Limited', 'LIM': 'Limited' };

  // When alias (e.g. "LTD") is found in text, pick the best available trim that contains "Limited".
  // For 2010 Forester, list has "X Limited", "XT Limited" but not "Limited" - so we must match one of those.
  const resolveLimitedTrimFromAlias = (text, availableTrims) => {
    const limitedTrims = availableTrims.filter(t => (t || '').toLowerCase().includes('limited'));
    if (limitedTrims.length === 0) return null;
    const textLower = (text || '').toLowerCase();
    // Prefer "XT Limited" when text contains "XT" (e.g. "2.5XT LTD", "Forester 2.5XT LTD")
    if (/\bxt\b/i.test(textLower)) {
      const xtLimited = limitedTrims.find(t => t.toLowerCase().startsWith('xt'));
      if (xtLimited) return xtLimited;
    }
    // Prefer "X Limited" when text contains "X" but not "XT" (word boundary)
    if (/\bx\b/i.test(textLower) && !/\bxt\b/i.test(textLower)) {
      const xLimited = limitedTrims.find(t => (t || '').toLowerCase().startsWith('x ') && !(t || '').toLowerCase().startsWith('xt'));
      if (xLimited) return xLimited;
    }
    // Otherwise first trim that equals "Limited", or first in list (longest first)
    const sorted = [...limitedTrims].sort((a, b) => (b?.length ?? 0) - (a?.length ?? 0));
    return sorted[0] || null;
  };

  // Match a trim string (from NHTSA or notes) to our available trims list (case-insensitive).
  // NHTSA often returns long strings like "WRX Limited+Moonroof+..." or "2.5XT LTD" (Forester).
  const matchTrimToAvailable = (trimString, availableTrims) => {
    if (!trimString || !availableTrims || availableTrims.length === 0) return trimString || null;
    const normalized = (trimString || '').trim();
    const trimLower = normalized.toLowerCase();
    // Exact match first
    const exactMatch = availableTrims.find(t => (t || '').trim().toLowerCase() === trimLower);
    if (exactMatch) return exactMatch;
    // Check aliases (e.g. "LTD" -> a trim containing "Limited") - works for Forester "X Limited"/"XT Limited" too
    for (const [alias] of Object.entries(TRIM_ALIASES)) {
      const aliasRegex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (aliasRegex.test(trimLower)) {
        const resolved = resolveLimitedTrimFromAlias(trimString, availableTrims);
        if (resolved) return resolved;
      }
    }
    // NHTSA returns long trim strings - find the first trim from our list that appears as a whole word
    const sorted = [...availableTrims].sort((a, b) => (b?.length ?? 0) - (a?.length ?? 0));
    for (const trim of sorted) {
      if (!trim) continue;
      const wordBoundary = new RegExp(`\\b${trim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundary.test(trimLower)) return trim;
    }
    return trimString;
  };

  // Infer trim from notes when it's mentioned (e.g. "limited model" or "LTD") but not set in make/model/trim
  const inferTrimFromNotes = (notes, availableTrims) => {
    if (!notes || !availableTrims || availableTrims.length === 0) return null;
    const notesLower = notes.toLowerCase();
    // Check aliases (e.g. "LTD" in notes -> a trim containing "Limited", e.g. "XT Limited" for Forester)
    for (const [alias] of Object.entries(TRIM_ALIASES)) {
      const aliasRegex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (aliasRegex.test(notesLower)) {
        const resolved = resolveLimitedTrimFromAlias(notes, availableTrims);
        if (resolved) return resolved;
      }
    }
    // Sort by length descending so we match longer trim names first (e.g. "Type R" before "R")
    const sorted = [...availableTrims].sort((a, b) => b.length - a.length);
    for (const trim of sorted) {
      const wordBoundary = new RegExp(`\\b${trim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (wordBoundary.test(notesLower)) return trim;
    }
    return null;
  };

  const handleVINChange = async (vin, showAlert = false) => {
    // Clean the VIN
    const cleanedVIN = cleanVIN(vin);
    setFormData({ ...formData, vin: cleanedVIN });

    // Only decode if VIN is complete (17 characters) and valid
    if (isValidVIN(cleanedVIN)) {
      setVinDecoding(true);
      
      // Start car animation
      carOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(carOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(carAnimation, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(carAnimation, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
      
      try {
        const decodedData = await decodeVIN(cleanedVIN);
        
        // Update form data with decoded information - ALWAYS fill fields even if not in library
        const updates = {};
        
        // Update year if found (check if it's a valid year, but still set it even if not in availableYears)
        if (decodedData.year) {
          const yearInt = parseInt(decodedData.year);
          // Still set it even if not in availableYears - user might have a vehicle from a different year
          updates.year = decodedData.year;
        }
        
        // Find matching make (case-insensitive, handles hyphens/spaces)
        // But always use the decoded make, matching or not
        const matchedMake = findMatchingMake(decodedData.make);
        if (decodedData.make) {
          // Use matched make if available (for better compatibility), otherwise use decoded make
          updates.make = matchedMake || decodedData.make;
        }
        
        // Split model and trim if they're combined (e.g., "WRX Limited")
        const targetMake = matchedMake || decodedData.make || formData.make;
        let finalModel = decodedData.model;
        let finalTrim = decodedData.trim;
        
        if (__DEV__) console.log('Processing model/trim:', { decodedModel: decodedData.model, decodedTrim: decodedData.trim, targetMake });
        
        if (decodedData.model) {
          if (targetMake) {
            // Try to split model/trim combination
            const split = splitModelAndTrim(decodedData.model, targetMake, decodedData.trim);
            if (__DEV__) console.log('Split result:', split);
            finalModel = split.model;
            finalTrim = split.trim || decodedData.trim; // Use split trim if found, otherwise use decoded trim
            
            // Try to find matching model first for compatibility
            const matchedModel = findMatchingModel(finalModel, targetMake);
            updates.model = matchedModel || finalModel;
            if (__DEV__) console.log('Model set:', updates.model);
          } else {
            // No make, but still set the model
            updates.model = decodedData.model;
            if (__DEV__) console.log('Model set (no make):', updates.model);
          }
        }
        
        // Always set trim if decoded or extracted from model
        if (finalTrim) {
          updates.trim = finalTrim;
          if (__DEV__) console.log('Trim set:', updates.trim);
        } else {
          if (__DEV__) console.log('No trim to set from decoded data');
          // Try one more time - maybe trim is in a different format from NHTSA
          // Check if decodedData has any trim-like information
          if (decodedData.trim && decodedData.trim.trim().length > 0) {
            updates.trim = decodedData.trim.trim();
            if (__DEV__) console.log('Trim set from decodedData.trim:', updates.trim);
          }
        }

        // Normalize trim to match our available trims list (case-insensitive) so the dropdown selects correctly
        const yearForTrims = updates.year || decodedData.year || formData.year;
        const makeForTrims = updates.make || decodedData.make || formData.make;
        const modelForTrims = updates.model || decodedData.model || formData.model;
        const availableTrimsForMatch = (makeForTrims && modelForTrims)
          ? getAvailableTrims(makeForTrims, modelForTrims, yearForTrims ? parseInt(yearForTrims) : null)
          : [];
        if (updates.trim && availableTrimsForMatch.length > 0) {
          updates.trim = matchTrimToAvailable(updates.trim, availableTrimsForMatch);
          if (__DEV__) console.log('Trim normalized to list:', updates.trim);
        }
        // If trim still empty, try to infer from notes (e.g. title scan put "limited" in notes)
        if (!updates.trim && availableTrimsForMatch.length > 0 && (formData.notes || '').trim()) {
          const inferredTrim = inferTrimFromNotes(formData.notes, availableTrimsForMatch);
          if (inferredTrim) {
            updates.trim = inferredTrim;
            if (__DEV__) console.log('Trim inferred from notes:', updates.trim);
          }
        }
        
        // Build vehicle identification string for success banner
        const makeName = updates.make || decodedData.make || 'Unknown';
        const modelName = updates.model || decodedData.model || 'Unknown Model';
        const trimName = updates.trim || decodedData.trim || null;
        if (decodedData.year && makeName && modelName) {
          let bannerText = `Found: ${decodedData.year} ${makeName} ${modelName}`;
          if (trimName) bannerText += ` ${trimName}`;
          if (vinBannerTimer.current) clearTimeout(vinBannerTimer.current);
          setVinSuccessBanner(bannerText);
          vinBannerTimer.current = setTimeout(() => setVinSuccessBanner(null), 6000);
        }
        
        // Log updates before applying
        if (__DEV__) console.log('Applying updates:', updates);
        
        // Set available trims now so the trim picker has options on the same render as the form update
        // (otherwise the trim row shows "No trim data available" until the useEffect runs)
        if (availableTrimsForMatch.length > 0) {
          setAvailableTrims(availableTrimsForMatch);
        }
        
        // Apply updates
        setFormData(prev => {
          const newData = {
            ...prev,
            ...updates,
            // Reset dependent fields if parent changed (but preserve if we're setting them in updates)
            // Only reset if we're NOT setting new values
            ...(updates.make && prev.make !== updates.make ? 
              (!updates.model ? { model: '' } : {}) : {}),
            ...(updates.make && prev.make !== updates.make ? 
              (!updates.trim ? { trim: '' } : {}) : {}),
            ...(updates.model && prev.model !== updates.model ? 
              (!updates.trim ? { trim: '' } : {}) : {}),
          };
          if (__DEV__) console.log('Form data updated:', { year: newData.year, make: newData.make, model: newData.model, trim: newData.trim });
          return newData;
        });
        
        // Fetch recalls after successful VIN decode
        // Use the ORIGINAL decoded model (not the split one) for recalls API
        // The NHTSA recalls API may need the exact model as returned by their VIN decoder
        if (updates.year && (updates.make || decodedData.make) && decodedData.model) {
          const recallYear = updates.year || decodedData.year;
          const recallMake = updates.make || decodedData.make;
          // Use original decoded model for recalls - don't use the split model
          const recallModel = decodedData.model;
          
          if (__DEV__) console.log('Fetching recalls with original model from API:', { recallYear, recallMake, recallModel });
          
          // Fetch recalls asynchronously (don't block the form update)
          fetchRecallsForVehicle(recallYear, recallMake, recallModel);
        }
        
        // Don't show alert - just auto-fill the form silently
        // if (showAlert) {
        //   const successMessage = vehicleIdentifiedText || `VIN scanned: ${cleanedVIN}`;
        //   Alert.alert('VIN Scanned', successMessage, [{ text: 'OK' }]);
        // }
      } catch (error) {
        logger.error('Error decoding VIN:', error);
        // Don't show alert - user can enter details manually
        // if (showAlert) {
        //   Alert.alert(
        //     'VIN Decode Failed',
        //     error.message || 'Could not decode VIN. Please fill in vehicle details manually.',
        //     [{ text: 'OK' }]
        //   );
        // }
      } finally {
        // Stop animation
        Animated.parallel([
          Animated.timing(carOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(carAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          carAnimation.setValue(0);
        });
        setVinDecoding(false);
      }
    } else if (cleanedVIN.length === 17 && !isValidVIN(cleanedVIN)) {
      // Invalid format (contains I, O, or Q)
      if (showAlert) {
        Alert.alert(
          'Invalid VIN',
          'VIN contains invalid characters. VINs cannot contain I, O, or Q.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  // Fetch recalls for vehicle
  const fetchRecallsForVehicle = async (year, make, model) => {
    if (!year || !make || !model) return;
    
    setLoadingRecalls(true);
    try {
      // Log what we're sending to the API
      if (__DEV__) console.log('Fetching recalls with:', { year, make, model });
      
      const recallsData = await fetchRecalls(year, make, model);
      const formattedRecalls = recallsData.map(recall => formatRecall(recall));
      
      // Log full recall data for debugging
      if (__DEV__) console.log(`Loaded ${formattedRecalls.length} recalls for ${year} ${make} ${model}`);
      
      setRecalls(formattedRecalls);
    } catch (error) {
      logger.error('Error fetching recalls:', error);
      setRecalls([]);
    } finally {
      setLoadingRecalls(false);
    }
  };

  // Scroll to top when modal opens
  useEffect(() => {
    // Scroll to top for both adding and editing
    const scrollToTop = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }
    };
    
    // Multiple attempts to ensure it scrolls (React Native timing can be tricky)
    setTimeout(scrollToTop, 100);
    setTimeout(scrollToTop, 300);
    setTimeout(scrollToTop, 500);
  }, []);

  // Track last fetched vehicle combination to avoid duplicate fetches
  const lastFetchedVehicle = React.useRef(null);

  // Load recalls if vehicle info is available (both when adding and editing)
  useEffect(() => {
    if (formData.year && formData.make && formData.model && !loadingRecalls) {
      const vehicleKey = `${formData.year}-${formData.make}-${formData.model}`;
      
      // Only fetch if we haven't already fetched for this exact vehicle combination
      if (lastFetchedVehicle.current !== vehicleKey) {
        lastFetchedVehicle.current = vehicleKey;
        fetchRecallsForVehicle(formData.year, formData.make, formData.model);
      }
    }
  }, [formData.year, formData.make, formData.model]);

  return (
    <Modal
      visible={true}
      animationType="none"
      transparent={true}
      onRequestClose={() => handleAnimatedClose(onCancel)}
    >
      <Animated.View style={{ flex: 1, width: '100%', opacity: fadeAnim }}>
        <Animated.View style={{ flex: 1, width: '100%', transform: [{ translateY: slideAnim }] }}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Vehicle' : 'Add Vehicle'}
            </Text>
            <TouchableOpacity
              onPress={() => handleAnimatedClose(onCancel)}
              accessibilityLabel="Close"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.content}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              {/* VIN Scan Button at Top */}
              {!isEditing && (
                <View style={styles.vinScanTopContainer}>
                  <TouchableOpacity
                    style={styles.vinScanTopButton}
                    onPress={handleScanVIN}
                    disabled={vinDecoding}
                    accessibilityLabel="Scan VIN with camera to auto-fill"
                    accessibilityRole="button"
                  >
                    {vinDecoding ? (
                      <>
                        <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                        <Text style={styles.vinScanTopButtonText}>Decoding VIN...</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="qr-code-outline" size={24} color={theme.colors.textPrimary} />
                        <Text style={styles.vinScanTopButtonText}>Scan VIN to Auto-Fill</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  {vinSuccessBanner ? (
                    <View style={styles.vinSuccessBanner}>
                      <Ionicons name="checkmark-circle" size={18} color={theme.colors.successBright} />
                      <Text style={styles.vinSuccessBannerText}>{vinSuccessBanner}</Text>
                      <TouchableOpacity onPress={() => setVinSuccessBanner(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close" size={16} color={theme.colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              )}
            {/* Year - First */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Year *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker('year', availableYears.map(year => ({
                  label: String(year),
                  value: String(year)
                })))}
                accessibilityLabel="Year"
                accessibilityRole="button"
                accessibilityHint="Opens year picker"
              >
                <Text style={[styles.pickerButtonText, !formData.year && styles.pickerButtonPlaceholder]}>
                  {formData.year || 'Select Year...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Make - Second */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Make *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => openPicker('make', vehicleMakes.map(make => ({
                  label: make,
                  value: make
                })))}
                accessibilityLabel="Make"
                accessibilityRole="button"
                accessibilityHint="Opens make picker"
              >
                <Text style={[styles.pickerButtonText, !formData.make && styles.pickerButtonPlaceholder]}>
                  {formData.make || 'Select Make...'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Model - Third */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Model *</Text>
              {formData.make ? (
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => openPicker('model', availableModels.map(model => ({
                    label: model,
                    value: model
                  })))}
                  accessibilityLabel="Model"
                  accessibilityRole="button"
                  accessibilityHint="Opens model picker"
                >
                  <Text style={[styles.pickerButtonText, !formData.model && styles.pickerButtonPlaceholder]}>
                    {formData.model || 'Select Model...'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ) : (
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>Select Make first</Text>
                </View>
              )}
            </View>

            {/* Trim - Fourth */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Trim Level</Text>
              {formData.make && formData.model && availableTrims.length > 0 ? (
                <TouchableOpacity
                  style={styles.pickerButton}
                  accessibilityLabel="Trim Level"
                  accessibilityRole="button"
                  accessibilityHint="Opens trim picker"
                  onPress={() => openPicker('trim', availableTrims.map(trim => {
                    const trimDetails = getTrimDetails(formData.make, formData.model, trim);
                    const label = trimDetails ? `${trim} (${trimDetails.engine})` : trim;
                    return {
                      label: label,
                      value: trim
                    };
                  }))}
                >
                  <Text style={[styles.pickerButtonText, !formData.trim && styles.pickerButtonPlaceholder]}>
                    {formData.trim || 'Select Trim (Optional)...'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ) : formData.make && formData.model ? (
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>No trim data available</Text>
                </View>
              ) : (
                <View style={[styles.input, styles.disabledInput]}>
                  <Text style={styles.disabledText}>Select Make & Model first</Text>
                </View>
              )}
            </View>

            {/* Current Mileage - Moved after Trim */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Mileage</Text>
              <TextInput
                style={styles.input}
                value={formData.mileage}
                onChangeText={(text) => setFormData({ ...formData, mileage: text })}
                placeholder="Current odometer reading"
                placeholderTextColor="#666"
                keyboardType="numeric"
                accessibilityLabel="Current Mileage"
              />
            </View>

            {/* License Plate */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>License Plate</Text>
              <TextInput
                style={styles.input}
                value={formData.licensePlate}
                onChangeText={(text) => setFormData({ ...formData, licensePlate: text })}
                placeholder="e.g., ABC-1234"
                placeholderTextColor="#666"
                accessibilityLabel="License Plate"
              />
            </View>

            {/* Nickname */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nickname</Text>
              <Text style={styles.labelHint}>Quick label like Daily Driver or Track Car</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.nicknameChipsScroll}
                contentContainerStyle={styles.nicknameChipsContent}
              >
                {[
                  'Daily Driver',
                  'Track Car',
                  'Utility Vehicle',
                  'Kid Hauler',
                  'Weekend Toy',
                  'Project Car',
                  'Work Truck',
                  'Commuter',
                ].map((suggestion) => {
                  const isSelected = (formData.nickname || '').trim() === suggestion;
                  return (
                    <TouchableOpacity
                      key={suggestion}
                      style={[styles.nicknameChip, isSelected && styles.nicknameChipSelected]}
                      onPress={() => setFormData({ ...formData, nickname: isSelected ? '' : suggestion })}
                      activeOpacity={0.7}
                      accessibilityLabel={`Select nickname ${suggestion}`}
                      accessibilityRole="button"
                    >
                      <Text style={[styles.nicknameChipText, isSelected && styles.nicknameChipTextSelected]}>
                        {suggestion}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TextInput
                style={[styles.input, styles.nicknameCustomInput]}
                value={formData.nickname}
                onChangeText={(text) => setFormData({ ...formData, nickname: text })}
                placeholder="Or type a custom nickname"
                placeholderTextColor="#666"
                accessibilityLabel="Nickname"
              />
            </View>

            {/* VIN */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>VIN</Text>
              <View style={styles.vinContainer}>
                <TextInput
                  style={[styles.input, styles.vinInput]}
                  value={formData.vin}
                  onChangeText={(text) => handleVINChange(text, false)}
                  placeholder="Vehicle Identification Number"
                  placeholderTextColor="#666"
                  maxLength={17}
                  autoCapitalize="characters"
                  accessibilityLabel="Vehicle Identification Number"
                />
                <TouchableOpacity
                  style={styles.vinScanButton}
                  onPress={handleScanVIN}
                  disabled={vinDecoding}
                  accessibilityLabel="Scan VIN with camera"
                  accessibilityRole="button"
                >
                  {vinDecoding ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <>
                      <Ionicons name="camera" size={20} color={theme.colors.primary} />
                      <Text style={styles.vinScanButtonText}>Scan</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              {vinDecoding && (
                <Animated.View 
                  style={[
                    styles.vinDecodingContainer,
                    {
                      opacity: carOpacity,
                    }
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.carAnimationContainer,
                      {
                        transform: [
                          {
                            translateX: carAnimation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [-20, 20],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Ionicons name="car" size={32} color={theme.colors.primary} />
                  </Animated.View>
                  <Text style={styles.decodingText}>Decoding VIN...</Text>
                  <Text style={styles.decodingSubtext}>Please wait while we fetch vehicle details</Text>
                </Animated.View>
              )}
            </View>

            {/* Color */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={styles.input}
                value={formData.color}
                onChangeText={(text) => setFormData({ ...formData, color: text })}
                placeholder="e.g., Blue"
                placeholderTextColor="#666"
                accessibilityLabel="Color"
              />
            </View>

            {/* Vehicle Images */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Vehicle Photos ({vehicleImages.length}/3)</Text>
              {vehicleImages.length > 0 && (
                <View style={styles.vehicleImagesGrid}>
                  {vehicleImages.map((uri, index) => (
                    <View key={`vimg_${index}`} style={styles.vehicleImageItem}>
                      <Image source={{ uri }} style={styles.vehicleImagePreview} />
                      <TouchableOpacity
                        style={styles.vehicleImageRemoveButton}
                        onPress={() => handleRemoveImage(index)}
                        accessibilityLabel={`Remove photo ${index + 1}`}
                        accessibilityRole="button"
                      >
                        <Ionicons name="close-circle" size={24} color={theme.colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
              {vehicleImages.length < 3 && (
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={showImageOptions}
                  accessibilityLabel={vehicleImages.length === 0 ? 'Add vehicle photo' : 'Add another vehicle photo'}
                  accessibilityRole="button"
                >
                  <Ionicons name="camera" size={20} color={theme.colors.primary} />
                  <Text style={styles.imageButtonText}>
                    {vehicleImages.length === 0 ? 'Add Photo' : 'Add Another Photo'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Recalls Section */}
            {formData.year && formData.make && formData.model && (
              <View style={styles.formGroup}>
                <TouchableOpacity
                  style={styles.recallsHeader}
                  onPress={() => setRecallsExpanded(!recallsExpanded)}
                  accessibilityLabel={recallsExpanded ? 'Collapse recalls' : 'Expand vehicle recalls'}
                  accessibilityRole="button"
                >
                  <View style={styles.recallsHeaderLeft}>
                    <Ionicons name="warning" size={20} color="#ff8800" />
                    <Text style={styles.recallsTitle} numberOfLines={1}>Vehicle Recalls</Text>
                    {recalls.length > 0 && (
                      <Text style={styles.recallsCount} numberOfLines={1} ellipsizeMode="tail">
                        ({recalls.length - completedRecalls.length} active{completedRecalls.length > 0 ? `, ${completedRecalls.length} done` : ''})
                      </Text>
                    )}
                  </View>
                  <Ionicons 
                    name={recallsExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={theme.colors.textSecondary} 
                  />
                </TouchableOpacity>
                {recallsExpanded && (
                  <>
                    {loadingRecalls ? (
                      <View style={styles.recallsLoading}>
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                        <Text style={styles.recallsLoadingText}>Checking for recalls...</Text>
                      </View>
                    ) : recalls.length > 0 ? (
                      <View style={styles.recallsContainer}>
                        <View style={styles.recallsWarning}>
                          <Text style={styles.recallsWarningText}>
                            {getRecallSummaryMessage(recalls.length)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.recallsLink}
                          accessibilityLabel="View recalls on NHTSA website"
                          accessibilityRole="button"
                          onPress={async () => {
                            const url = `https://www.nhtsa.gov/recalls?make=${encodeURIComponent(formData.make)}&model=${encodeURIComponent(formData.model)}&modelYear=${encodeURIComponent(formData.year)}`;
                            try {
                              const canOpen = await Linking.canOpenURL(url);
                              if (canOpen) {
                                await Linking.openURL(url);
                              } else {
                                Alert.alert('Error', 'Unable to open browser. Please visit nhtsa.gov/recalls manually.');
                              }
                            } catch (error) {
                              logger.error('Error opening URL:', error);
                              Alert.alert('Error', 'Unable to open browser. Please visit nhtsa.gov/recalls manually.');
                            }
                          }}
                        >
                          <Text style={styles.recallsLinkText}>View on NHTSA Recalls Site →</Text>
                        </TouchableOpacity>
                        
                        {/* Check All Recalls */}
                        {recalls.length > 0 && (
                          <TouchableOpacity
                            style={styles.checkAllRecallsContainer}
                            onPress={() => {
                              const allCompleted = recalls.every(recall => 
                                completedRecalls.includes(recall.campaignNumber)
                              );
                              if (allCompleted) {
                                // Uncheck all
                                setCompletedRecalls([]);
                              } else {
                                // Check all
                                const allCampaignNumbers = recalls.map(recall => recall.campaignNumber);
                                setCompletedRecalls(allCampaignNumbers);
                              }
                            }}
                            accessibilityLabel={recalls.every(recall => completedRecalls.includes(recall.campaignNumber)) ? 'Uncheck all recalls' : 'Check all recalls'}
                            accessibilityRole="button"
                          >
                            <Ionicons
                              name={
                                recalls.every(recall => completedRecalls.includes(recall.campaignNumber))
                                  ? "checkbox"
                                  : "checkbox-outline"
                              }
                              size={20}
                              color={
                                recalls.every(recall => completedRecalls.includes(recall.campaignNumber))
                                  ? "#00aa00"
                                  : "#b0b0b0"
                              }
                            />
                            <Text style={styles.checkAllRecallsText}>
                              {recalls.every(recall => completedRecalls.includes(recall.campaignNumber))
                                ? "Uncheck All Recalls"
                                : "Check All Recalls"}
                            </Text>
                          </TouchableOpacity>
                        )}
                        
                        <View style={styles.recallsList}>
                          {recalls.map((recall, index) => {
                            const isCompleted = completedRecalls.includes(recall.campaignNumber);
                            return (
                              <View 
                                key={recall.campaignNumber || index} 
                                style={[
                                  styles.recallItem,
                                  isCompleted && styles.recallItemCompleted
                                ]}
                              >
                                <View style={styles.recallItemHeader}>
                                  <TouchableOpacity
                                    style={styles.recallCheckbox}
                                    onPress={() => {
                                      const newCompleted = isCompleted
                                        ? completedRecalls.filter(id => id !== recall.campaignNumber)
                                        : [...completedRecalls, recall.campaignNumber];
                                      setCompletedRecalls(newCompleted);
                                    }}
                                    accessibilityLabel={isCompleted ? `Mark recall ${recall.campaignNumber} as incomplete` : `Mark recall ${recall.campaignNumber} as completed`}
                                    accessibilityRole="checkbox"
                                  >
                                    <Ionicons
                                      name={isCompleted ? "checkbox" : "checkbox-outline"}
                                      size={24}
                                      color={isCompleted ? "#00aa00" : "#b0b0b0"}
                                    />
                                  </TouchableOpacity>
                                  <View style={styles.recallItemContent}>
                                    <Text style={[
                                      styles.recallItemTitle,
                                      isCompleted && styles.recallItemTitleCompleted
                                    ]}>
                                      Campaign #{recall.campaignNumber}
                                    </Text>
                                    <Text style={[
                                      styles.recallItemComponent,
                                      isCompleted && styles.recallItemComponentCompleted
                                    ]}>
                                      {recall.component}
                                    </Text>
                                    {recall.summary && (
                                      <Text 
                                        style={[
                                          styles.recallItemSummary,
                                          isCompleted && styles.recallItemSummaryCompleted
                                        ]} 
                                        numberOfLines={recallsExpanded ? undefined : 2}
                                      >
                                        {recall.summary}
                                      </Text>
                                    )}
                                    {recall.dateReportedFormatted && (
                                      <Text style={[
                                        styles.recallItemDate,
                                        isCompleted && styles.recallItemDateCompleted
                                      ]}>
                                        Reported: {recall.dateReportedFormatted}
                                      </Text>
                                    )}
                                    {isCompleted && (
                                      <Text style={styles.recallCompletedLabel}>
                                        ✓ Marked as completed
                                      </Text>
                                    )}
                                  </View>
                                </View>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    ) : (
                      <View style={styles.recallsNoRecalls}>
                        <Text style={styles.recallsNoRecallsText}>
                          No known recalls for this vehicle model.
                        </Text>
                      </View>
                    )}
                  </>
                )}
                {!recallsExpanded && recalls.length > 0 && (
                  <View style={styles.recallsCollapsedSummary}>
                    <Text style={styles.recallsCollapsedText}>
                      {recalls.length - completedRecalls.length} active recall{recalls.length - completedRecalls.length !== 1 ? 's' : ''}
                      {completedRecalls.length > 0 && `, ${completedRecalls.length} completed`}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Additional notes about this vehicle"
                accessibilityLabel="Notes"
                placeholderTextColor="#666"
                multiline
                scrollEnabled={true}
                textAlignVertical="top"
                onFocus={() => {
                  setTimeout(() => {
                    if (scrollViewRef.current) {
                      scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                  }, 500);
                }}
                onContentSizeChange={() => {
                  setTimeout(() => {
                    if (scrollViewRef.current) {
                      scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                  }, 100);
                }}
              />
            </View>

            {/* Modifications section toggle */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowBuildSheet(!showBuildSheet)}
              accessibilityLabel={showBuildSheet ? 'Hide Modifications' : 'Show Modifications'}
              accessibilityRole="button"
            >
              <Text style={styles.advancedToggleText}>
                {showBuildSheet ? 'Hide' : 'Show'} Modifications
              </Text>
              <Ionicons
                name={showBuildSheet ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {/* Modifications content */}
            {showBuildSheet && (
              <>
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Modifications</Text>
                  <Text style={styles.sectionDescription}>
                    Document modifications and aftermarket parts
                  </Text>
                </View>

                {/* Engine */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Engine</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.engine}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, engine: text }
                    })}
                    placeholder="Engine swap, internals, turbo, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>

                {/* Intake */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Intake</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.intake}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, intake: text }
                    })}
                    placeholder="Air intake, filters, intercoolers, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>

                {/* Exhaust */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Exhaust</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.exhaust}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, exhaust: text }
                    })}
                    placeholder="Headers, downpipes, cat-back, mufflers, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>

                {/* Fueling */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Fueling</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.fueling}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, fueling: text }
                    })}
                    placeholder="Fuel pump, injectors, fuel lines, regulators, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>

                {/* ECU */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>ECU / Tuning</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.ecu}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, ecu: text }
                    })}
                    placeholder="ECU tune, piggyback, standalone, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>

                {/* Suspension */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Suspension</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.suspension}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, suspension: text }
                    })}
                    placeholder="Coilovers, springs, sway bars, struts, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>

                {/* Body */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Body</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.buildSheet.body}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      buildSheet: { ...formData.buildSheet, body: text }
                    })}
                    placeholder="Aero, body kit, hood, fenders, etc."
                    placeholderTextColor="#666"
                    multiline
                    scrollEnabled={true}
                    textAlignVertical="top"
                  />
                </View>
              </>
            )}

            {/* Advanced Section Toggle */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
              accessibilityLabel={showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
              accessibilityRole="button"
            >
              <Text style={styles.advancedToggleText}>
                {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
              </Text>
              <Ionicons
                name={showAdvanced ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={theme.colors.primary}
              />
            </TouchableOpacity>

            {/* Service Intervals */}
            {showAdvanced && (
              <>
                {/* Import Specs Button - Only show when editing */}
                {isEditing && (
                <View style={styles.sectionDivider}>
                    <TouchableOpacity
                      style={styles.importSpecsButton}
                      onPress={() => {
                        Alert.alert(
                          'Import Specs from Database',
                          'This will overwrite all current service intervals, fluids, torque values, tires, hardware, lighting, and parts SKUs with the database values for this vehicle.\n\nAny custom values you have set will be lost. Continue?',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel'
                            },
                            {
                              text: 'Import',
                              style: 'destructive',
                              onPress: () => {
                                if (!formData.make || !formData.model || !formData.year) {
                                  Alert.alert('Error', 'Please fill in Make, Model, and Year before importing specs.');
                                  return;
                                }
                                
                                // Create a temporary vehicle object with current form data
                                const tempVehicle = {
                                  make: formData.make,
                                  model: formData.model,
                                  year: parseInt(formData.year),
                                  trim: formData.trim || '',
                                  serviceIntervals: {},
                                  recommendedFluids: {},
                                  torqueValues: {},
                                  tires: {},
                                  hardware: {},
                                  lighting: {},
                                  partsSKUs: {}
                                };
                                
                                // Import specs
                                const importedVehicle = importVehicleSpecs(tempVehicle);
                                
                                // Update form data with imported specs
                                setFormData(prev => ({
                                  ...prev,
                                  serviceIntervals: importedVehicle.serviceIntervals || prev.serviceIntervals,
                                  recommendedFluids: importedVehicle.recommendedFluids || prev.recommendedFluids,
                                  torqueValues: importedVehicle.torqueValues || prev.torqueValues,
                                  tires: importedVehicle.tires || prev.tires,
                                  hardware: importedVehicle.hardware || prev.hardware,
                                  lighting: importedVehicle.lighting || prev.lighting,
                                  partsSKUs: importedVehicle.partsSKUs || prev.partsSKUs
                                }));
                                
                                Alert.alert('Success', 'Specs imported from database successfully.');
                              }
                            }
                          ]
                        );
                      }}
                    >
                      <Ionicons name="download-outline" size={20} color={theme.colors.textPrimary} />
                      <Text style={styles.importSpecsButtonText}>Import Specs from Database</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                <View style={styles.sectionDivider}>
                  <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Service Intervals (Miles)</Text>
                    <TouchableOpacity
                      onPress={() => setShowServiceIntervalInfo(!showServiceIntervalInfo)}
                      style={styles.infoIconButton}
                    >
                      <Ionicons 
                        name={showServiceIntervalInfo ? "information-circle" : "information-circle-outline"} 
                        size={20} 
                        color={theme.colors.primary} 
                      />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.sectionDescription}>
                    Manufacturer recommended service intervals (auto-populated)
                  </Text>
                  {showServiceIntervalInfo && (
                    <View style={styles.infoBox}>
                      <Text style={styles.infoTitle}>Severe/Extreme Driving Conditions</Text>
                      <Text style={styles.infoText}>
                        You may want to decrease mileage between service intervals if your vehicle experiences severe or extreme driving conditions, including:
                      </Text>
                      <View style={styles.infoList}>
                        <Text style={styles.infoBullet}>• Repeated short-distance driving (engine doesn't reach full temp)</Text>
                        <Text style={styles.infoBullet}>• Driving in dusty conditions</Text>
                        <Text style={styles.infoBullet}>• Driving with extended use of brakes</Text>
                        <Text style={styles.infoBullet}>• Driving in areas where salt or other corrosive materials are used</Text>
                        <Text style={styles.infoBullet}>• Driving in extreme heat or cold</Text>
                        <Text style={styles.infoBullet}>• Extended periods of idling</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Oil Change</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.oilChange}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, oilChange: text }
                      })}
                      placeholder="e.g., 5000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Tire Rotation</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.tireRotation}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, tireRotation: text }
                      })}
                      placeholder="e.g., 7500"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Brake Inspection</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.brakeInspection}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, brakeInspection: text }
                      })}
                      placeholder="e.g., 15000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Air Filter</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.airFilter}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, airFilter: text }
                      })}
                      placeholder="e.g., 30000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Cabin Filter</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.cabinFilter}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, cabinFilter: text }
                      })}
                      placeholder="e.g., 30000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Spark Plugs</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.sparkPlugs}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, sparkPlugs: text }
                      })}
                      placeholder="e.g., 100000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Transmission</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.transmission}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, transmission: text }
                      })}
                      placeholder="e.g., 60000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Coolant</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.serviceIntervals.coolant}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        serviceIntervals: { ...formData.serviceIntervals, coolant: text }
                      })}
                      placeholder="e.g., 100000"
                      placeholderTextColor="#666"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Brake Fluid</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.serviceIntervals.brakeFluid}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      serviceIntervals: { ...formData.serviceIntervals, brakeFluid: text }
                    })}
                    placeholder="e.g., 30000"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                {/* Recommended Fluids */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Recommended Fluids</Text>
                  <Text style={styles.sectionDescription}>
                    Manufacturer recommended fluids (auto-populated)
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Engine Oil</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.recommendedFluids.engineOil}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      recommendedFluids: { ...formData.recommendedFluids, engineOil: text }
                    })}
                    placeholder="e.g., 5W-30 Synthetic"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Engine Oil Capacity</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.recommendedFluids.engineOilCapacity}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      recommendedFluids: { ...formData.recommendedFluids, engineOilCapacity: text }
                    })}
                    placeholder="e.g., 5.0 quarts"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Transmission Fluid</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.recommendedFluids.transmissionFluid}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      recommendedFluids: { ...formData.recommendedFluids, transmissionFluid: text }
                    })}
                    placeholder="e.g., ATF"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Coolant</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.recommendedFluids.coolant}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        recommendedFluids: { ...formData.recommendedFluids, coolant: text }
                      })}
                      placeholder="e.g., 50/50 Pre-mixed"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Brake Fluid</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.recommendedFluids.brakeFluid}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        recommendedFluids: { ...formData.recommendedFluids, brakeFluid: text }
                      })}
                      placeholder="e.g., DOT 3"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Power Steering</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.recommendedFluids.powerSteering}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        recommendedFluids: { ...formData.recommendedFluids, powerSteering: text }
                      })}
                      placeholder="e.g., ATF"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Differential</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.recommendedFluids.differential}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        recommendedFluids: { ...formData.recommendedFluids, differential: text }
                      })}
                      placeholder="e.g., 75W-90"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                {/* Tires & Wheels Section */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Tires & Wheels</Text>
                  <Text style={styles.sectionDescription}>
                    Tire specifications and wheel information (auto-populated)
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Tire Size (Front)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.tires.tireSizeFront}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        tires: { ...formData.tires, tireSizeFront: text }
                      })}
                      placeholder="e.g., 275/55R20"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Tire Size (Rear)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.tires.tireSizeRear}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        tires: { ...formData.tires, tireSizeRear: text }
                      })}
                      placeholder="e.g., 275/55R20"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Tire Pressure (Front)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.tires.tirePressureFront}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        tires: { ...formData.tires, tirePressureFront: text }
                      })}
                      placeholder="e.g., 35 PSI"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Tire Pressure (Rear)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.tires.tirePressureRear}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        tires: { ...formData.tires, tirePressureRear: text }
                      })}
                      placeholder="e.g., 35 PSI"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Wheel Bolt Pattern</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.tires.wheelBoltPattern}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        tires: { ...formData.tires, wheelBoltPattern: text }
                      })}
                      placeholder="e.g., 6x135"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Lug Nut Torque</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.tires.lugNutTorque}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        tires: { ...formData.tires, lugNutTorque: text }
                      })}
                      placeholder="e.g., 150 ft-lbs"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                {/* Hardware Section */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Hardware</Text>
                  <Text style={styles.sectionDescription}>
                    Battery and wiper blade specifications (auto-populated)
                  </Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Battery Group Size</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.hardware.batteryGroupSize}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      hardware: { ...formData.hardware, batteryGroupSize: text }
                    })}
                    placeholder="e.g., Group 65"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Wiper Blade (Driver)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.hardware.wiperBladeDriver}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        hardware: { ...formData.hardware, wiperBladeDriver: text }
                      })}
                      placeholder="e.g., 26 inches"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Wiper Blade (Passenger)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.hardware.wiperBladePassenger}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        hardware: { ...formData.hardware, wiperBladePassenger: text }
                      })}
                      placeholder="e.g., 20 inches"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Wiper Blade (Rear)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.hardware.wiperBladeRear}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      hardware: { ...formData.hardware, wiperBladeRear: text }
                    })}
                    placeholder="e.g., 18 inches"
                    placeholderTextColor="#666"
                  />
                </View>

                {/* Lighting Section */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Lighting (Bulb Types)</Text>
                  <Text style={styles.sectionDescription}>
                    Bulb specifications for all lighting (auto-populated)
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Headlight (Low Beam)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lighting.headlightLow}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        lighting: { ...formData.lighting, headlightLow: text }
                      })}
                      placeholder="e.g., H11"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Headlight (High Beam)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lighting.headlightHigh}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        lighting: { ...formData.lighting, headlightHigh: text }
                      })}
                      placeholder="e.g., H9"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Fog Light</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lighting.fogLight}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        lighting: { ...formData.lighting, fogLight: text }
                      })}
                      placeholder="e.g., H11"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Brake Light</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lighting.brakeLight}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        lighting: { ...formData.lighting, brakeLight: text }
                      })}
                      placeholder="e.g., 7443"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Turn Signal</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lighting.turnSignal}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        lighting: { ...formData.lighting, turnSignal: text }
                      })}
                      placeholder="e.g., 7440"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Interior Light</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.lighting.interiorLight}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        lighting: { ...formData.lighting, interiorLight: text }
                      })}
                      placeholder="e.g., T10"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Trunk Light</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.lighting.trunkLight}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      lighting: { ...formData.lighting, trunkLight: text }
                    })}
                    placeholder="e.g., T10"
                    placeholderTextColor="#666"
                  />
                </View>

                {/* Parts SKUs Section */}
                <View style={styles.sectionDivider}>
                  <Text style={styles.sectionTitle}>Common Parts SKUs</Text>
                  <Text style={styles.sectionDescription}>
                    Part numbers for commonly replaced items (auto-populated)
                  </Text>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Brake Pads</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.brakePads}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, brakePads: text }
                      })}
                      placeholder="e.g., 12345-BP"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Brake Rotors</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.brakeRotors}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, brakeRotors: text }
                      })}
                      placeholder="e.g., 12345-BR"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Wheel Hubs</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.wheelHubs}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, wheelHubs: text }
                      })}
                      placeholder="e.g., 12345-WH"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Wheel Bearings</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.wheelBearings}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, wheelBearings: text }
                      })}
                      placeholder="e.g., 12345-WB"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Air Filter</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.airFilter}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, airFilter: text }
                      })}
                      placeholder="e.g., 12345-AF"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Cabin Filter</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.cabinFilter}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, cabinFilter: text }
                      })}
                      placeholder="e.g., 12345-CF"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formRow}>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Oil Filter</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.oilFilter}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, oilFilter: text }
                      })}
                      placeholder="e.g., 12345-OF"
                      placeholderTextColor="#666"
                    />
                  </View>
                  <View style={styles.formGroupHalf}>
                    <Text style={styles.label}>Fuel Filter</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.partsSKUs.fuelFilter}
                      onChangeText={(text) => setFormData({
                        ...formData,
                        partsSKUs: { ...formData.partsSKUs, fuelFilter: text }
                      })}
                      placeholder="e.g., 12345-FF"
                      placeholderTextColor="#666"
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Transmission Filter</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.partsSKUs.transmissionFilter}
                    onChangeText={(text) => setFormData({
                      ...formData,
                      partsSKUs: { ...formData.partsSKUs, transmissionFilter: text }
                    })}
                    placeholder="e.g., 12345-TF"
                    placeholderTextColor="#666"
                  />
                </View>
              </>
            )}
            </ScrollView>
          </KeyboardAvoidingView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleAnimatedClose(onCancel)}
              accessibilityLabel="Cancel"
              accessibilityRole="button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              accessibilityLabel={isEditing ? 'Update vehicle' : 'Add vehicle'}
              accessibilityRole="button"
            >
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update' : 'Add'} Vehicle
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </Animated.View>
      </Animated.View>
      
      {/* Picker Modal */}
      <Modal
        visible={pickerModal.visible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePicker}
        presentationStyle="overFullScreen"
      >
        <Pressable style={styles.pickerModalOverlay} onPress={closePicker}>
          <Pressable style={styles.pickerModalContent} onPress={() => {}}>
            <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>
                  {pickerModal.type === 'year' && 'Select Year'}
                  {pickerModal.type === 'make' && 'Select Make'}
                  {pickerModal.type === 'model' && 'Select Model'}
                  {pickerModal.type === 'trim' && 'Select Trim'}
                </Text>
                <TouchableOpacity
                  onPress={closePicker}
                  accessibilityLabel="Close picker"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={pickerModal.data}
                keyExtractor={(item) => String(item.value || item)}
                renderItem={({ item }) => {
                  const label = item.label || String(item);
                  const value = item.value || item;
                  const isSelected = 
                    (pickerModal.type === 'year' && formData.year === String(value)) ||
                    (pickerModal.type === 'make' && formData.make === value) ||
                    (pickerModal.type === 'model' && formData.model === value) ||
                    (pickerModal.type === 'trim' && formData.trim === value);
                  
                  return (
                    <TouchableOpacity
                      style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                      onPress={() => handlePickerSelect(value)}
                    >
                      <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                        {label}
                      </Text>
                      {isSelected && <Ionicons name="checkmark" size={20} color={theme.colors.primary} />}
                    </TouchableOpacity>
                  );
                }}
                style={styles.pickerList}
                contentContainerStyle={styles.pickerListContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              />
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 150 : 50,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  keyboardView: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  labelHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  nicknameChipsScroll: {
    marginBottom: 8,
  },
  nicknameChipsContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  nicknameChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceElevated,
  },
  nicknameChipSelected: {
    backgroundColor: theme.colors.primary,
  },
  nicknameChipText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  nicknameChipTextSelected: {
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  nicknameCustomInput: {
    marginTop: 0,
  },
  disabledInput: {
    backgroundColor: theme.colors.background,
    borderColor: '#3d3d3d',
  },
  disabledText: {
    color: '#666',
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  sectionDivider: {
    marginTop: 24,
    marginBottom: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  importSpecsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 8,
  },
  importSpecsButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoIconButton: {
    padding: 4,
    marginLeft: 4,
  },
  infoBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  infoList: {
    marginTop: 4,
  },
  infoBullet: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
    paddingLeft: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 12,
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: 12,
  },
  advancedToggleText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
  },
  pickerButtonText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: '#666',
  },
  pickerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '50%',
  },
  pickerModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pickerModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  pickerList: {
    flex: 1,
  },
  pickerListContent: {
    paddingBottom: 20,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  pickerItemSelected: {
    backgroundColor: theme.colors.primaryDark,
  },
  pickerItemText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  pickerItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  imageButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  vehicleImagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  vehicleImageItem: {
    position: 'relative',
    width: '31%',
    aspectRatio: 4 / 3,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vehicleImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  vehicleImageRemoveButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  vinContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  vinInput: {
    flex: 1,
  },
  vinScanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
    minWidth: 80,
  },
  vinScanButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  decodingText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  decodingSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  vinDecodingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  carAnimationContainer: {
    marginBottom: 12,
  },
  vinScanTopContainer: {
    marginBottom: 20,
  },
  vinScanTopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vinScanTopButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  vinSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.successBright,
  },
  vinSuccessBannerText: {
    flex: 1,
    color: theme.colors.successBright,
    fontSize: 14,
    fontWeight: '600',
  },
  recallsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recallsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0, // Allows flex children to shrink below their content size
  },
  recallsCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: 4,
    flexShrink: 1,
    minWidth: 0, // Allows text to shrink
  },
  recallsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flexShrink: 0, // Don't shrink the title
  },
  recallsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recallsLoadingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  recallsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
  },
  recallsWarning: {
    backgroundColor: 'rgba(255, 136, 0, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#ff8800',
    padding: 12,
    marginBottom: 12,
    borderRadius: 4,
  },
  recallsWarningText: {
    color: '#ffaa44',
    fontSize: 14,
    lineHeight: 20,
  },
  recallsLink: {
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 8,
  },
  recallsLinkText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  checkAllRecallsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 8,
    gap: 10,
  },
  checkAllRecallsText: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  recallsList: {
    marginTop: 8,
  },
  recallItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  recallItemCompleted: {
    opacity: 0.6,
    backgroundColor: 'rgba(0, 170, 0, 0.05)',
  },
  recallItemHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  recallCheckbox: {
    marginTop: 2,
  },
  recallItemContent: {
    flex: 1,
  },
  recallItemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textMuted,
  },
  recallItemComponentCompleted: {
    color: theme.colors.textMuted,
    opacity: 0.8,
  },
  recallItemSummaryCompleted: {
    color: theme.colors.textMuted,
    opacity: 0.7,
  },
  recallItemDateCompleted: {
    color: theme.colors.textMuted,
    opacity: 0.6,
  },
  recallCompletedLabel: {
    color: '#00aa00',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  recallsCollapsedSummary: {
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recallsCollapsedText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  recallItemTitle: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  recallItemComponent: {
    color: '#ff8800',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  recallItemSummary: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  recallItemDate: {
    color: theme.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  recallsNoRecalls: {
    padding: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recallsNoRecallsText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
