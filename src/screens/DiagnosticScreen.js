import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Note: react-native-reanimated entering animations removed to avoid Worklets error
// Re-enable after rebuilding app with: npx expo run:android or npx expo run:ios
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBuildSheet, hasModifications, getRelevantModifications } from '../utils/buildSheet';
import { getVehicleContext, extractSuspectedRecentWork, buildOptimizedForumQuery } from '../utils/vehicleContext';
import { listAvailableModels } from '../utils/visionAI';
import { theme } from '../theme';
import logger from '../utils/logger';
import { getEnv } from '../utils/env';
import { requireNetwork } from '../utils/network';
import { checkRateLimit, recordCall } from '../utils/rateLimit';

// Initialize Gemini AI
let genAI = null;

function initializeGemini() {
  if (genAI) return genAI;
  
  const apiKey = getEnv('EXPO_PUBLIC_GEMINI_API_KEY');

  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please set EXPO_PUBLIC_GEMINI_API_KEY in your .env file.');
  }
  
  genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
}

export default function DiagnosticScreen({ appContext, navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [showVehicleContext, setShowVehicleContext] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const insets = useSafeAreaInsets();

  const isPro = appContext?.isPro;
  const proLoading = appContext?.proLoading;
  const vehicles = appContext?.vehicles || [];

  // Auto-select first vehicle when vehicles change
  useEffect(() => {
    if (vehicles.length > 0) {
      // If current selection is invalid or not set, select first vehicle
      if (!selectedVehicleId || !vehicles.find(v => v.id === selectedVehicleId)) {
        setSelectedVehicleId(vehicles[0].id);
      }
    } else {
      setSelectedVehicleId(null);
    }
  }, [vehicles]);

  // Show loading while Pro status is being determined
  if (proLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.lockedContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // If not pro, render locked state
  if (!isPro) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.lockedContainer}>
            <Ionicons name="construct" size={64} color={theme.colors.primary} />
            <Text style={styles.lockedTitle}>Stoich AI Mechanic</Text>
            <Text style={styles.lockedMessage}>
              Upgrade to Pro to access AI-powered diagnostics
            </Text>

            <View style={styles.lockedFeatureCard}>
              <Text style={styles.lockedFeatureHeading}>Intelligent, Vehicle-Aware Diagnostics</Text>
              <Text style={styles.lockedFeatureDescription}>
                The Stoich AI Mechanic doesn't just give generic answers — it automatically factors in your vehicle's unique profile to deliver precise troubleshooting.
              </Text>
              <View style={styles.lockedFeatureList}>
                <View style={styles.lockedFeatureItem}>
                  <Ionicons name="speedometer-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.lockedFeatureText}>Current mileage and wear patterns</Text>
                </View>
                <View style={styles.lockedFeatureItem}>
                  <Ionicons name="document-text-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.lockedFeatureText}>Full maintenance history and service records</Text>
                </View>
                <View style={styles.lockedFeatureItem}>
                  <Ionicons name="build-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.lockedFeatureText}>Recent repairs and work performed</Text>
                </View>
                <View style={styles.lockedFeatureItem}>
                  <Ionicons name="swap-horizontal-outline" size={18} color={theme.colors.primary} />
                  <Text style={styles.lockedFeatureText}>Aftermarket parts and modifications</Text>
                </View>
              </View>
              <Text style={styles.lockedFeatureFootnote}>
                Every diagnostic response is tailored to your exact build — not a one-size-fits-all answer.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation?.navigate('Subscription')}
              activeOpacity={0.7}
              accessibilityLabel="Upgrade to Pro"
              accessibilityRole="button"
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Get selected vehicle object
  const getVehicle = () => {
    if (vehicles.length === 0) {
      return null;
    }
    
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) return vehicle;
    }
    
    // Fallback to first vehicle
    return vehicles[0] || null;
  };

  // Get selected vehicle info if available
  const getVehicleInfo = () => {
    const vehicle = getVehicle();
    if (vehicle && vehicle.make && vehicle.model && vehicle.year) {
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    }
    return null;
  };

  // Get combined modifications string for current vehicle
  const getVehicleBuildSheet = () => {
    const vehicle = getVehicle();
    if (!vehicle) return '';
    return getBuildSheet(vehicle);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const extractSearchQuery = (aiResponse, userMessage) => {
    // Look for search query patterns in the response
    // The AI should end with a specific search query
    const lines = aiResponse.split('\n');
    
    // Look for "Search query:" pattern
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line.toLowerCase().includes('search query:')) {
        // Extract the query part after "Search query:"
        const match = line.match(/search query:\s*(.+)/i);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }
    
    // If no explicit query found, use the user's original input
    return userMessage || '';
  };

  // Render text with highlighting for suspected recent work
  const renderHighlightedText = (message) => {
    if (!message.suspectedWork?.hasSuspectedWork || message.isUser || message.isError) {
      return (
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
            message.isError && styles.errorText,
          ]}
        >
          {message.text}
        </Text>
      );
    }

    // Highlight suspected recent work phrases
    const text = message.text;
    const suspectedKeywords = [
      'since you just',
      'after you',
      'recently',
      'just replaced',
      'just installed',
      'just changed',
      'just did',
      'after the',
      'following the',
      'after replacing',
      'after installing',
      'could be related to',
      'may be related to',
      'likely related to'
    ];

    // Split text into parts and highlight suspected phrases
    const parts = [];
    let lastIndex = 0;
    let foundHighlight = false;

    suspectedKeywords.forEach(keyword => {
      const index = text.toLowerCase().indexOf(keyword.toLowerCase(), lastIndex);
      if (index !== -1 && !foundHighlight) {
        // Add text before highlight
        if (index > lastIndex) {
          parts.push(
            <Text
              key={`before-${index}`}
              style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText,
              ]}
            >
              {text.substring(lastIndex, index)}
            </Text>
          );
        }

        // Find the end of the sentence or phrase
        const dotIndex = text.indexOf('.', index);
        const newlineIndex = text.indexOf('\n', index);
        const parenIndex = text.indexOf('(', index);
        
        // Filter out -1 values and find the minimum
        const validIndices = [dotIndex, newlineIndex, parenIndex, text.length].filter(idx => idx !== -1);
        const endIndex = validIndices.length > 0 ? Math.min(...validIndices) : text.length;

        // Add highlighted text
        parts.push(
          <Text
            key={`highlight-${index}`}
            style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.aiMessageText,
              styles.suspectedWorkHighlight,
            ]}
          >
            {text.substring(index, endIndex)}
          </Text>
        );

        lastIndex = endIndex;
        foundHighlight = true;
      }
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <Text
          key="remaining"
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {text.substring(lastIndex)}
        </Text>
      );
    }

    // If no highlight found, return plain text
    if (parts.length === 0) {
      return (
        <Text
          style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.aiMessageText,
          ]}
        >
          {text}
        </Text>
      );
    }

    return <Text>{parts}</Text>;
  };

  const handleSend = async () => {
    const userMessage = inputText.trim();
    if (!userMessage || loading) return;

    const limit = checkRateLimit('ai-diagnostic', { cooldownMs: 2000, dailyLimit: 60 });
    if (!limit.allowed) {
      Alert.alert('Slow Down', limit.reason);
      return;
    }

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setLoading(true);
    scrollToBottom();

    try {
      await requireNetwork('AI diagnostics');
      recordCall('ai-diagnostic');

      // Initialize Gemini
      const ai = initializeGemini();
      
      // Find the best available model for text generation
      // Prefer pro models for better reasoning, fallback to flash if needed
      let modelName = null;
      const fallbackModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-2.0-flash-exp'];
      
      try {
        const availableModels = await listAvailableModels();
        if (availableModels && availableModels.length > 0) {
          // Look for a pro model first (better for diagnostics)
          const proModel = availableModels.find(m => 
            m.name && (
              m.name.includes('gemini-1.5-pro') || 
              m.name.includes('gemini-2.0') ||
              m.name.includes('gemini-pro')
            ) &&
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent')
          );
          
          if (proModel) {
            // Extract model name (remove 'models/' prefix if present)
            modelName = proModel.name.replace('models/', '');
            logger.log('✅ Using Pro model for diagnostics:', modelName);
          } else {
            // Fallback to any model that supports generateContent
            const anyModel = availableModels.find(m => 
              m.supportedGenerationMethods && 
              m.supportedGenerationMethods.includes('generateContent')
            );
            if (anyModel) {
              modelName = anyModel.name.replace('models/', '');
              logger.log('⚠️ Using available model:', modelName);
            }
          }
        }
      } catch (modelError) {
        logger.warn('Could not list models, will try fallbacks:', modelError);
      }
      
      // If no model found, try fallback models in order
      if (!modelName) {
        for (const fallback of fallbackModels) {
          try {
            const testModel = ai.getGenerativeModel({ model: fallback });
            modelName = fallback;
            logger.log('✅ Using fallback model:', modelName);
            break;
          } catch (e) {
            // Try next fallback
            continue;
          }
        }
      }
      
      if (!modelName) {
        throw new Error('No available Gemini model found. Please check your API key and model access.');
      }
      
      const model = ai.getGenerativeModel({ model: modelName });

      // Get complete vehicle context
      const vehicle = getVehicle();
      const vehicleContext = getVehicleContext(vehicle);
      const vehicleInfo = getVehicleInfo();

      // Build system prompt with new structure
      let systemPrompt = `You are a master technician diagnosing a vehicle issue.\n`;
      
      if (vehicleContext.basicSpecs) {
        systemPrompt += `VEHICLE PROFILE:\n`;
        systemPrompt += `- Car: ${vehicleContext.specsString}\n`;
        systemPrompt += `- Build/Mods: ${vehicleContext.modifications || 'Stock (no modifications recorded)'}\n`;
        systemPrompt += `- RECENT WORK (Last 30 days/500 miles):\n${vehicleContext.recentHistory.map(r => r.formatted).join('\n') || 'No recent maintenance recorded.'}\n`;
      }
      
      systemPrompt += `USER SYMPTOM: "${userMessage}"\n`;
      systemPrompt += `DIAGNOSTIC STRATEGY:\n`;
      systemPrompt += `1. FIRST, check if the "Recent Work" could have caused this. (e.g., if they just did brakes and now hear a noise, suspect a loose caliper bolt).\n`;
      systemPrompt += `2. SECOND, consider the Modifications (e.g., aftermarket ECU issues).\n`;
      systemPrompt += `3. THIRD, look for common stock issues for this specific model.\n`;
      systemPrompt += `OUTPUT FORMAT:\n`;
      systemPrompt += `- succinct analysis.\n`;
      systemPrompt += `- 3 probable causes (flagging "Recent Work" if relevant).\n`;
      systemPrompt += `- A specific search query for forums.\n`;
      systemPrompt += `Always end with: "Search query: [specific query here]"`;

      // Generate response
      const result = await model.generateContent(systemPrompt);

      const response = result.response;
      const text = response.text();

      // Extract search query from response
      const searchQuery = extractSearchQuery(text, userMessage);
      setLastSearchQuery(searchQuery);

      // Extract suspected recent work
      const suspectedWork = extractSuspectedRecentWork(text, vehicleContext.recentHistory);

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: text,
        isUser: false,
        timestamp: new Date(),
        searchQuery: searchQuery,
        userIssue: userMessage,
        suspectedWork: suspectedWork, // Store suspected work info
        vehicleContext: vehicleContext, // Store context for forum search
      };

      setMessages(prev => [...prev, aiMessage]);
      scrollToBottom();
    } catch (error) {
      logger.error('Error calling Gemini API:', error);
      
      let errorMessage = 'Unable to get diagnosis. ';
      if (error.message?.includes('API key')) {
        errorMessage += 'Please configure your Gemini API key.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage += 'Check your internet connection.';
      } else {
        errorMessage += 'Please try again.';
      }

      const errorMsg = {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMsg]);
      scrollToBottom();
    } finally {
      setLoading(false);
    }
  };

  // Get relevant brand forum based on vehicle make
  const getBrandForum = (make) => {
    if (!make) return null;
    
    const makeLower = make.toLowerCase();
    
    // Map vehicle makes to their specific forums
    if (makeLower === 'subaru') {
      return 'nasioc.com';
    } else if (makeLower === 'bmw') {
      return 'bimmerforums.com';
    } else if (makeLower === 'mercedes-benz' || makeLower === 'mercedes') {
      return 'mbworld.org';
    } else if (makeLower === 'audi') {
      return 'audiworld.com';
    } else if (makeLower === 'volkswagen' || makeLower === 'vw') {
      return 'vwvortex.com';
    } else if (makeLower === 'chevrolet' || makeLower === 'chevy') {
      const vehicle = getVehicle();
      if (vehicle?.model?.toLowerCase() === 'corvette') {
        return 'corvetteforum.com';
      }
    } else if (makeLower === 'ford') {
      const vehicle = getVehicle();
      if (vehicle?.model?.toLowerCase() === 'mustang') {
        return 'mustang6g.com';
      }
    }
    
    return null;
  };

  // Extract concise keywords from the issue description
  const extractConciseKeywords = (text) => {
    if (!text) return '';
    
    // Remove common filler words and get key terms
    const fillerWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'my', 'vehicle', 'car', 'when', 'while', 'i', 'it'];
    
    // Split into words, filter out fillers, and take most important terms
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 2 && !fillerWords.includes(word))
      .slice(0, 5); // Take first 5 meaningful words
    
    return words.join(' ');
  };

  const handleSearchForums = (message) => {
    const vehicle = getVehicle();
    const symptom = message?.userIssue || inputText;
    
    // Extract concise keywords from the issue
    let searchKeywords = extractConciseKeywords(symptom);
    
    // If we have suspected recent work, add relevant part keywords
    const suspectedWork = message?.suspectedWork;
    if (suspectedWork?.hasSuspectedWork && suspectedWork.suspectedParts.length > 0) {
      const partName = suspectedWork.suspectedParts[0].type || suspectedWork.suspectedParts[0].description || '';
      if (partName) {
        const partKeywords = partName.split(/\s+/).slice(0, 2).join(' '); // Take first 2 words of part name
        searchKeywords = `${searchKeywords} ${partKeywords}`;
      }
    }
    
    // Get brand-specific forum
    const brandForum = getBrandForum(vehicle?.make);
    
    // Build site filters: always Reddit, plus brand forum if available
    const forums = ['reddit.com'];
    if (brandForum) {
      forums.push(brandForum);
    }
    const siteFilters = forums.map(forum => `site:${forum}`).join('+OR+');
    
    // Encode only the search keywords
    const encodedQuery = encodeURIComponent(searchKeywords.trim());
    
    // Build Google search URL: site filters + concise keywords only
    const searchUrl = `https://www.google.com/search?q=${siteFilters}+${encodedQuery}`;
    
    Linking.openURL(searchUrl).catch(err => {
      logger.error('Error opening browser:', err);
      Alert.alert('Error', 'Unable to open browser. Please check your internet connection.');
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Ionicons name="construct" size={24} color={theme.colors.primary} />
            <Text style={styles.headerTitle}>AI Mechanic</Text>
          </View>
          <View style={styles.headerActions}>
            <Text style={styles.headerSubtitle}>Diagnostic Assistant</Text>
            <TouchableOpacity
              style={styles.warningLightsButton}
              onPress={() => navigation?.navigate('WarningLights')}
              activeOpacity={0.7}
              accessibilityLabel="Warning lights reference"
              accessibilityRole="button"
            >
              <Ionicons name="warning" size={18} color={theme.colors.primary} />
              <Text style={styles.warningLightsButtonText}>Lights</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Selector */}
        {vehicles.length > 0 && (
          <View style={styles.vehicleSelectorContainer}>
            <TouchableOpacity
              style={styles.vehicleSelectorButton}
              accessibilityLabel={getVehicleInfo() ? `Select vehicle, current: ${getVehicleInfo()}` : 'Select vehicle'}
              accessibilityRole="button"
              onPress={() => {
                const vehicleOptions = vehicles.map(v => ({
                  label: `${v.year || ''} ${v.make || ''} ${v.model || ''}${v.trim ? ` ${v.trim}` : ''}`.trim() || 'Unnamed Vehicle',
                  value: v.id,
                  vehicle: v
                }));
                
                Alert.alert(
                  'Select Vehicle',
                  'Choose which vehicle to diagnose:',
                  [
                    ...vehicleOptions.map(option => ({
                      text: option.label,
                      onPress: () => {
                        setSelectedVehicleId(option.value);
                      },
                      style: selectedVehicleId === option.value ? 'default' : 'default'
                    })),
                    { text: 'Cancel', style: 'cancel' }
                  ],
                  { cancelable: true }
                );
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="car" size={18} color={theme.colors.primary} />
              <Text style={styles.vehicleSelectorText}>
                {getVehicleInfo() || 'Select Vehicle'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Vehicle Context Badge */}
        {(() => {
          const vehicleInfo = getVehicleInfo();
          if (!vehicleInfo) return null;
          
          const vehicle = getVehicle();
          const vehicleContext = getVehicleContext(vehicle);
          const hasMods = hasModifications(vehicle);
          const hasRecent = vehicleContext.hasRecentWork;
          const hasInfo = hasMods || hasRecent;
          
          return (
            <TouchableOpacity
              style={styles.vehicleContextContainer}
              onPress={() => setShowVehicleContext(!showVehicleContext)}
              activeOpacity={0.7}
              accessibilityLabel={showVehicleContext ? 'Hide vehicle context' : 'Show vehicle context'}
              accessibilityRole="button"
            >
              <View style={styles.vehicleContextHeader}>
                <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
                <Text style={styles.vehicleContextTitle}>
                  {hasMods && 'Modified'}
                  {hasMods && hasRecent && ' • '}
                  {hasRecent && 'Recent Work'}
                  {!hasInfo && 'Vehicle Info'}
                </Text>
                <Ionicons
                  name={showVehicleContext ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#b0b0b0"
                />
              </View>
              {showVehicleContext && (
                <View style={styles.vehicleContextDetails}>
                  {/* Basic Vehicle Info - Always show */}
                  <View>
                    <Text style={styles.vehicleContextLabel}>Vehicle:</Text>
                    <Text style={styles.vehicleContextText}>
                      {vehicle.year || ''} {vehicle.make || ''} {vehicle.model || ''}
                      {vehicle.trim ? ` ${vehicle.trim}` : ''}
                    </Text>
                    {vehicle.mileage && (
                      <Text style={styles.vehicleContextText}>
                        Mileage: {parseInt(vehicle.mileage).toLocaleString()} mi
                      </Text>
                    )}
                  </View>
                  
                  {/* Modifications */}
                  {vehicleContext.modifications && (
                    <>
                      <View style={styles.vehicleContextDivider} />
                      <Text style={styles.vehicleContextLabel}>Modifications:</Text>
                      <Text style={styles.vehicleContextText} numberOfLines={3}>
                        {vehicleContext.modifications}
                      </Text>
                    </>
                  )}
                  
                  {/* Recent Work */}
                  {vehicleContext.hasRecentWork && (
                    <>
                      <View style={styles.vehicleContextDivider} />
                      <Text style={styles.vehicleContextLabel}>Recent Work (Last 30 days/500 mi):</Text>
                      {vehicleContext.recentHistory.slice(0, 3).map((record, idx) => (
                        <Text key={idx} style={styles.vehicleContextText} numberOfLines={1}>
                          {record.formatted}
                        </Text>
                      ))}
                    </>
                  )}
                  
                  {/* Show message if no mods or recent work */}
                  {!hasInfo && (
                    <>
                      <View style={styles.vehicleContextDivider} />
                      <Text style={styles.vehicleContextText}>
                        No modifications or recent maintenance recorded. The AI will diagnose based on common issues for this vehicle.
                      </Text>
                    </>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })()}

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {messages.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.border} />
              <Text style={styles.emptyStateTitle}>Describe Your Vehicle Issue</Text>
              <Text style={styles.emptyStateText}>
                Tell me what's wrong with your vehicle and I'll help diagnose the problem.
              </Text>
              {getVehicleInfo() && (
                <View style={styles.vehicleInfoBadge}>
                  <Ionicons name="car" size={16} color={theme.colors.primary} />
                  <Text style={styles.vehicleInfoText}>{getVehicleInfo()}</Text>
                </View>
              )}
            </View>
          )}

          {messages.map((message, index) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessageContainer : styles.aiMessageContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userBubble : styles.aiBubble,
                  message.isError && styles.errorBubble,
                ]}
              >
                {!message.isUser && !message.isError && (
                  <View style={styles.aiIconContainer}>
                    <Ionicons name="construct" size={16} color={theme.colors.primary} />
                  </View>
                )}
                <View style={styles.messageTextContainer}>
                  {renderHighlightedText(message)}
                </View>
              </View>

              {/* Suspected Recent Work Warning */}
              {!message.isUser && !message.isError && message.suspectedWork?.hasSuspectedWork && (
                <View style={styles.suspectedWorkWarning}>
                  <Ionicons name="warning" size={16} color={theme.colors.warningLight} />
                  <Text style={styles.suspectedWorkText}>
                    Recent work may be related to this issue
                  </Text>
                </View>
              )}

              {/* Search Forums Button */}
              {!message.isUser && !message.isError && message.searchQuery && (
                <View>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => handleSearchForums(message)}
                    accessibilityLabel="Search forums"
                    accessibilityRole="button"
                  >
                    <Ionicons name="search" size={16} color={theme.colors.textPrimary} />
                    <Text style={styles.searchButtonText}>Search Forums</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Scanning...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Describe the problem (e.g., 'Rattling noise at 60mph')"
            placeholderTextColor="#666"
            multiline
            maxLength={500}
            editable={!loading}
            accessibilityLabel="Describe the problem"
            onFocus={() => {
              // Scroll to bottom when input is focused
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 300);
            }}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
            accessibilityLabel="Send message"
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.textPrimary} />
            ) : (
              <Ionicons name="send" size={20} color={theme.colors.textPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    flexGrow: 1,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: 32,
  },
  warningLightsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#0066cc33',
  },
  warningLightsButtonText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  vehicleSelectorContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  vehicleSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vehicleSelectorText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  vehicleContextContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  vehicleContextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vehicleContextTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  vehicleContextDetails: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  vehicleContextLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
    marginTop: 4,
    marginBottom: 2,
  },
  vehicleContextText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  vehicleContextDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  vehicleInfoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: '#0066cc33',
  },
  vehicleInfoText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  messageContainer: {
    marginBottom: 16,
    width: '100%',
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  aiMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
  },
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  errorBubble: {
    backgroundColor: '#4d1a1a',
    borderColor: theme.colors.dangerDark,
    borderWidth: 1,
  },
  aiIconContainer: {
    marginTop: 2,
  },
  messageTextContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: theme.colors.textPrimary,
  },
  aiMessageText: {
    color: '#e0e0e0',
  },
  errorText: {
    color: '#ffaaaa',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  searchButtonText: {
    color: theme.colors.textPrimary,
    ...theme.typography.bodySmall,
    fontWeight: '600',
  },
  suspectedWorkWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4d3a00',
    borderWidth: 1,
    borderColor: '#ffaa0033',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  suspectedWorkText: {
    color: '#ffaa00',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  suspectedWorkHighlight: {
    backgroundColor: '#4d3a00',
    color: '#ffaa00',
    fontWeight: '600',
    paddingHorizontal: 2,
    borderRadius: 3,
  },
  loadingContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  loadingText: {
    color: theme.colors.textSecondary,
    ...theme.typography.bodySmall,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 16 : 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.5,
  },
  lockedContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  lockedTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedMessage: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  lockedFeatureCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
  },
  lockedFeatureHeading: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  lockedFeatureDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  lockedFeatureList: {
    gap: 12,
    marginBottom: 16,
  },
  lockedFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockedFeatureText: {
    fontSize: 14,
    color: '#e0e0e0',
    flex: 1,
  },
  lockedFeatureFootnote: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    lineHeight: 18,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
  },
  upgradeButtonText: {
    color: theme.colors.textPrimary,
    ...theme.typography.body,
    fontWeight: '700',
  },
});
