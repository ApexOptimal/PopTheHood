import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import BarcodeScanner from '../components/BarcodeScanner';

export default function InventoryScreen({ appContext }) {
  const { 
    inventory = [], 
    vehicles = [],
    todos = [],
    shoppingList = [],
    addShoppingItem,
    deleteShoppingItem,
    toggleShoppingItem,
    clearCompletedShoppingItems,
    setShowInventoryForm, 
    setEditingInventory, 
    filterVehicleId, 
    setFilterVehicleId,
    setShowBorrowModal,
    setBorrowingItem,
    returnInventoryItem,
    deleteInventoryItem,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    launchReceiptScan,
  } = appContext || {};
  const [localFilter, setLocalFilter] = useState(null);
  const [isTodoExpanded, setIsTodoExpanded] = useState(true);
  const [isShoppingListExpanded, setIsShoppingListExpanded] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newShoppingItemText, setNewShoppingItemText] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const filteredInventory = localFilter
    ? inventory.filter(item => item.vehicleIds?.includes(localFilter))
    : inventory;

  const isLowStock = (item) => {
    if (!item.alertThreshold || item.alertThreshold === '') return false;
    const quantity = parseFloat(item.quantity) || 0;
    const threshold = parseFloat(item.alertThreshold) || 0;
    return quantity <= threshold;
  };

  const handleEdit = (item) => {
    setEditingInventory(item);
    setShowInventoryForm && setShowInventoryForm(true);
  };

  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo && addTodo({ text: newTodoText.trim() });
      setNewTodoText('');
    }
  };

  const handleDeleteTodo = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTodo && deleteTodo(id),
        }
      ]
    );
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  // Calculate low stock items for shopping list
  const lowStockItems = useMemo(() => {
    return inventory.filter(item => {
      if (!item.alertThreshold || item.alertThreshold === '') return false;
      const quantity = parseFloat(item.quantity) || 0;
      const threshold = parseFloat(item.alertThreshold) || 0;
      return quantity <= threshold;
    });
  }, [inventory]);

  // Combine low stock items with manual shopping list items
  const combinedShoppingList = useMemo(() => {
    const lowStockNames = new Set(lowStockItems.map(item => item.name.toLowerCase()));
    const manualItems = shoppingList.filter(item => 
      !lowStockNames.has(item.name.toLowerCase())
    );
    
    // Convert low stock items to shopping list format
    const autoItems = lowStockItems.map(item => ({
      id: `auto_${item.id}`,
      name: item.name,
      isAutoAdded: true,
      completed: shoppingList.find(s => s.name.toLowerCase() === item.name.toLowerCase())?.completed || false,
      quantity: item.quantity,
      unit: item.unit,
      threshold: item.alertThreshold,
    }));
    
    return [...autoItems, ...manualItems];
  }, [lowStockItems, shoppingList]);

  const activeShoppingItems = combinedShoppingList.filter(item => !item.completed);
  const completedShoppingItems = combinedShoppingList.filter(item => item.completed);

  const handleAddShoppingItem = () => {
    if (newShoppingItemText.trim()) {
      addShoppingItem && addShoppingItem({ name: newShoppingItemText.trim() });
      setNewShoppingItemText('');
    }
  };

  const handleBarcodeScan = (productData) => {
    if (productData && productData.name) {
      addShoppingItem && addShoppingItem({ 
        name: productData.name,
        category: productData.category,
        barcode: productData.barcode,
      });
    }
    setShowScanner(false);
  };

  const handleToggleShoppingItem = (item) => {
    if (item.isAutoAdded) {
      const existingItem = shoppingList.find(s => s.name.toLowerCase() === item.name.toLowerCase());
      if (existingItem) {
        toggleShoppingItem && toggleShoppingItem(existingItem.id);
      } else {
        addShoppingItem && addShoppingItem({ name: item.name, completed: true });
      }
    } else {
      toggleShoppingItem && toggleShoppingItem(item.id);
    }
  };

  const handleDeleteShoppingItem = (item) => {
    if (!item.isAutoAdded) {
      deleteShoppingItem && deleteShoppingItem(item.id);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <View style={styles.itemNameRow}>
            <Text style={styles.itemName}>{item.name}</Text>
            {isLowStock(item) && (
              <View style={styles.lowStockBadge}>
                <Ionicons name="warning" size={14} color="#ff4444" />
                <Text style={styles.lowStockText}>Low Stock</Text>
              </View>
            )}
          </View>
          <Text style={[styles.itemDetails, isLowStock(item) && styles.lowStockText]}>
            {item.quantity} {item.unit || 'units'}
            {item.category && ` • ${item.category}`}
            {item.alertThreshold && ` (Alert at: ${item.alertThreshold})`}
          </Text>
          {item.location && (
            <Text style={styles.itemLocation}>Location: {item.location}</Text>
          )}
          {item.vehicleIds && item.vehicleIds.length > 0 && (
            <View style={styles.vehicleTags}>
              {item.vehicleIds.map(vehicleId => {
                const vehicle = vehicles?.find(v => v.id === vehicleId);
                return vehicle ? (
                  <View key={vehicleId} style={styles.vehicleTag}>
                    <Ionicons name="car" size={12} color="#0066cc" />
                    <Text style={styles.vehicleTagText}>
                      {vehicle.make} {vehicle.model}
                    </Text>
                  </View>
                ) : null;
              })}
            </View>
          )}
        </View>
        <View style={styles.actionButtons}>
          {!item.isBorrowed ? (
            <TouchableOpacity
              style={styles.lendButton}
              onPress={() => {
                setBorrowingItem && setBorrowingItem(item);
                setShowBorrowModal && setShowBorrowModal(true);
              }}
            >
              <Ionicons name="hand-left-outline" size={18} color="#ffaa00" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.returnButton}
              onPress={() => {
                Alert.alert(
                  'Return Item',
                  `${item.name} returned?`,
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Yes',
                      onPress: () => {
                        returnInventoryItem && returnInventoryItem(item.id);
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color="#4dff4d" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create" size={18} color="#0066cc" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteInventoryItem && deleteInventoryItem(item.id)}
          >
            <Ionicons name="trash" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
      {item.isBorrowed && (
        <View style={styles.borrowedSection}>
          <View style={styles.borrowedBadge}>
            <Ionicons name="person" size={14} color="#ffaa00" />
            <Text style={styles.borrowedText}>
              Borrowed by {item.borrowedBy}
            </Text>
          </View>
          {item.borrowedDate && (
            <Text style={styles.borrowedDate}>
              Lent on: {new Date(item.borrowedDate).toLocaleDateString()}
            </Text>
          )}
          {item.returnReminderDate && (
            <Text style={styles.reminderText}>
              Return reminder: {new Date(item.returnReminderDate).toLocaleDateString()}
            </Text>
          )}
          {item.borrowedPhoto && (
            <Image source={{ uri: item.borrowedPhoto }} style={styles.borrowedPhoto} />
          )}
        </View>
      )}
    </View>
  );

  if (!inventory) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Ionicons name="cube" size={64} color="#666" />
          <Text style={styles.emptyText}>Loading inventory...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* To Do List Section */}
        <View style={styles.todoSection}>
          <TouchableOpacity
            style={styles.todoHeader}
            onPress={() => setIsTodoExpanded(!isTodoExpanded)}
          >
            <View style={styles.todoHeaderLeft}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#0066cc" />
              <Text style={styles.todoSectionTitle}>To Do</Text>
              {activeTodos.length > 0 && (
                <View style={styles.todoBadge}>
                  <Text style={styles.todoBadgeText}>{activeTodos.length}</Text>
                </View>
              )}
            </View>
            <Ionicons
              name={isTodoExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="#b0b0b0"
            />
          </TouchableOpacity>

          {isTodoExpanded && (
            <View style={styles.todoContent}>
              {/* Add Todo Input */}
              <View style={styles.addTodoContainer}>
                <TextInput
                  style={styles.addTodoInput}
                  placeholder="Add a task..."
                  placeholderTextColor="#909090"
                  value={newTodoText}
                  onChangeText={setNewTodoText}
                  onSubmitEditing={handleAddTodo}
                />
                <TouchableOpacity
                  style={[styles.addTodoButton, !newTodoText.trim() && styles.addTodoButtonDisabled]}
                  onPress={handleAddTodo}
                  disabled={!newTodoText.trim()}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Active Todos */}
              {activeTodos.length > 0 && (
                <View style={styles.todoList}>
                  {activeTodos.map(todo => (
                    <View key={todo.id} style={styles.todoItem}>
                      <TouchableOpacity
                        style={styles.todoCheckbox}
                        onPress={() => toggleTodo && toggleTodo(todo.id)}
                      >
                        <Ionicons name="ellipse-outline" size={20} color="#b0b0b0" />
                      </TouchableOpacity>
                      <Text style={styles.todoText}>{todo.text}</Text>
                      <TouchableOpacity
                        style={styles.todoDeleteButton}
                        onPress={() => handleDeleteTodo(todo.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {/* Completed Todos */}
              {completedTodos.length > 0 && (
                <View style={styles.completedSection}>
                  <Text style={styles.completedTitle}>Completed</Text>
                  {completedTodos.map(todo => (
                    <View key={todo.id} style={styles.todoItem}>
                      <TouchableOpacity
                        style={styles.todoCheckbox}
                        onPress={() => toggleTodo && toggleTodo(todo.id)}
                      >
                        <Ionicons name="checkmark-circle" size={20} color="#4dff4d" />
                      </TouchableOpacity>
                      <Text style={[styles.todoText, styles.todoTextCompleted]}>{todo.text}</Text>
                      <TouchableOpacity
                        style={styles.todoDeleteButton}
                        onPress={() => handleDeleteTodo(todo.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {todos.length === 0 && (
                <View style={styles.todoEmptyState}>
                  <Ionicons name="checkmark-circle-outline" size={48} color="#666" />
                  <Text style={styles.todoEmptyText}>No tasks yet</Text>
                  <Text style={styles.todoEmptySubtext}>Add a task to get started</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Shopping List Section */}
        <View style={styles.shoppingListSection}>
          <TouchableOpacity
            style={styles.shoppingListHeader}
            onPress={() => setIsShoppingListExpanded(!isShoppingListExpanded)}
          >
            <View style={styles.shoppingListHeaderLeft}>
              <Ionicons name="cart" size={24} color="#4CAF50" />
              <Text style={styles.shoppingListSectionTitle}>Shopping List</Text>
              {activeShoppingItems.length > 0 && (
                <View style={styles.shoppingBadge}>
                  <Text style={styles.shoppingBadgeText}>{activeShoppingItems.length}</Text>
                </View>
              )}
            </View>
            <Ionicons
              name={isShoppingListExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="#b0b0b0"
            />
          </TouchableOpacity>

          {isShoppingListExpanded && (
            <View style={styles.shoppingListContent}>
              {/* Add Item Row */}
              <View style={styles.addShoppingItemContainer}>
                <TextInput
                  style={styles.addShoppingItemInput}
                  placeholder="Add item..."
                  placeholderTextColor="#909090"
                  value={newShoppingItemText}
                  onChangeText={setNewShoppingItemText}
                  onSubmitEditing={handleAddShoppingItem}
                />
                <TouchableOpacity
                  style={[styles.addShoppingItemButton, !newShoppingItemText.trim() && styles.addShoppingItemButtonDisabled]}
                  onPress={handleAddShoppingItem}
                  disabled={!newShoppingItemText.trim()}
                >
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={() => setShowScanner(true)}
                >
                  <Ionicons name="barcode" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Active Shopping Items */}
              {activeShoppingItems.length > 0 && (
                <View style={styles.shoppingItemsList}>
                  {activeShoppingItems.map(item => (
                    <View key={item.id} style={styles.shoppingItem}>
                      <TouchableOpacity
                        style={styles.shoppingCheckbox}
                        onPress={() => handleToggleShoppingItem(item)}
                      >
                        <Ionicons name="ellipse-outline" size={20} color="#b0b0b0" />
                      </TouchableOpacity>
                      <View style={styles.shoppingItemDetails}>
                        <Text style={styles.shoppingItemName}>{item.name}</Text>
                        {item.isAutoAdded && (
                          <Text style={styles.shoppingItemSubtext}>
                            Low stock: {item.quantity} {item.unit || 'units'}
                          </Text>
                        )}
                      </View>
                      {item.isAutoAdded ? (
                        <View style={styles.autoAddedBadge}>
                          <Text style={styles.autoAddedText}>Auto</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.shoppingDeleteButton}
                          onPress={() => handleDeleteShoppingItem(item)}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ff4444" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Completed Shopping Items */}
              {completedShoppingItems.length > 0 && (
                <View style={styles.shoppingCompletedSection}>
                  <View style={styles.shoppingCompletedHeader}>
                    <Text style={styles.shoppingCompletedTitle}>Completed</Text>
                    <TouchableOpacity onPress={() => clearCompletedShoppingItems && clearCompletedShoppingItems()}>
                      <Text style={styles.clearCompletedText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {completedShoppingItems.map(item => (
                    <View key={item.id} style={[styles.shoppingItem, styles.shoppingItemCompleted]}>
                      <TouchableOpacity
                        style={styles.shoppingCheckbox}
                        onPress={() => handleToggleShoppingItem(item)}
                      >
                        <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                      </TouchableOpacity>
                      <Text style={[styles.shoppingItemName, styles.shoppingItemNameCompleted]}>{item.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Empty State */}
              {combinedShoppingList.length === 0 && (
                <View style={styles.shoppingEmptyState}>
                  <Ionicons name="cart-outline" size={48} color="#666" />
                  <Text style={styles.shoppingEmptyText}>No items yet</Text>
                  <Text style={styles.shoppingEmptySubtext}>Low stock items will appear here automatically</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Inventory Section */}
        <View style={styles.inventorySection}>
          <View style={styles.inventoryHeader}>
            <Text style={styles.inventorySectionTitle}>Inventory</Text>
            <View style={styles.inventoryHeaderButtons}>
              {launchReceiptScan && (
                <TouchableOpacity
                  style={styles.scanReceiptButton}
                  onPress={() => launchReceiptScan('garage')}
                >
                  <Ionicons name="document-text" size={18} color="#0066cc" />
                  <Text style={styles.scanReceiptButtonText}>Scan Receipt</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (setShowInventoryForm) {
                    setShowInventoryForm(true);
                  }
                }}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
          {vehicles && vehicles.length > 0 && (
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Filter:</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={localFilter}
                  onValueChange={(value) => setLocalFilter(value)}
                  style={styles.picker}
                  dropdownIconColor="#ffffff"
                >
                  <Picker.Item label="All Items" value={null} />
                  {vehicles.map(vehicle => (
                    <Picker.Item
                      key={vehicle.id}
                      label={`${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim()}
                      value={vehicle.id}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {!filteredInventory || filteredInventory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube" size={64} color="#666" />
              <Text style={styles.emptyText}>
                {localFilter ? 'No items for this vehicle' : 'No inventory items yet'}
              </Text>
              <Text style={styles.emptySubtext}>
                {localFilter 
                  ? 'Try selecting a different vehicle or add items for this vehicle'
                  : 'Add items to track your inventory'}
              </Text>
            </View>
          ) : (
            <View style={styles.inventoryList}>
              {filteredInventory.map(item => (
                <View key={item.id?.toString() || Math.random().toString()}>
                  {renderItem({ item })}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        visible={showScanner}
        onScan={handleBarcodeScan}
        onClose={() => setShowScanner(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  todoSection: {
    backgroundColor: '#2d2d2d',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    overflow: 'hidden',
  },
  todoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2d2d2d',
  },
  todoHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  todoSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  todoBadge: {
    backgroundColor: '#0066cc',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  todoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  todoContent: {
    padding: 16,
    paddingTop: 0,
    maxHeight: 400,
  },
  addTodoContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  addTodoInput: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  addTodoButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTodoButtonDisabled: {
    backgroundColor: '#4d4d4d',
    opacity: 0.5,
  },
  todoList: {
    marginBottom: 16,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  todoCheckbox: {
    padding: 4,
  },
  todoText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#909090',
  },
  todoDeleteButton: {
    padding: 4,
  },
  completedSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  completedTitle: {
    fontSize: 12,
    color: '#909090',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  todoEmptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  todoEmptyText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  todoEmptySubtext: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  inventorySection: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  inventorySectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  inventoryHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scanReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 2,
    borderColor: '#0066cc',
    backgroundColor: 'rgba(0,102,204,0.15)',
  },
  scanReceiptButtonText: {
    color: '#0066cc',
    fontWeight: '600',
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 0,
  },
  filterLabel: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 150,
    height: 48,
  },
  picker: {
    flex: 1,
    color: '#fff',
    backgroundColor: '#3d3d3d',
    height: 48,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0066cc',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  inventoryList: {
    marginTop: 8,
  },
  itemCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  lendButton: {
    padding: 8,
  },
  returnButton: {
    padding: 8,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4d1a1a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  lowStockText: {
    color: '#ff4444',
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  vehicleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a5c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  vehicleTagText: {
    fontSize: 12,
    color: '#0066cc',
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
  },
  itemLocation: {
    fontSize: 12,
    color: '#909090',
    marginTop: 4,
  },
  borrowedSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3d3d3d',
  },
  borrowedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d2d00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
    gap: 6,
  },
  borrowedText: {
    color: '#ffaa00',
    fontSize: 12,
    fontWeight: '600',
  },
  borrowedDate: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 12,
    color: '#4dff4d',
    marginBottom: 8,
  },
  borrowedPhoto: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 8,
    resizeMode: 'cover',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  // Shopping List Styles
  shoppingListSection: {
    backgroundColor: '#2d2d2d',
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4d4d4d',
    overflow: 'hidden',
  },
  shoppingListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2d2d2d',
  },
  shoppingListHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shoppingListSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  shoppingBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  shoppingBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  shoppingListContent: {
    padding: 16,
    paddingTop: 0,
    maxHeight: 400,
  },
  addShoppingItemContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  addShoppingItemInput: {
    flex: 1,
    backgroundColor: '#3d3d3d',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 14,
  },
  addShoppingItemButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addShoppingItemButtonDisabled: {
    backgroundColor: '#4d4d4d',
    opacity: 0.5,
  },
  scanButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shoppingItemsList: {
    marginBottom: 8,
  },
  shoppingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  shoppingItemCompleted: {
    opacity: 0.6,
  },
  shoppingCheckbox: {
    padding: 4,
  },
  shoppingItemDetails: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 14,
    color: '#ffffff',
  },
  shoppingItemNameCompleted: {
    textDecorationLine: 'line-through',
    color: '#909090',
    flex: 1,
  },
  shoppingItemSubtext: {
    fontSize: 11,
    color: '#ff9800',
    marginTop: 2,
  },
  autoAddedBadge: {
    backgroundColor: '#1a3a5c',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autoAddedText: {
    color: '#0066cc',
    fontSize: 10,
    fontWeight: '600',
  },
  shoppingDeleteButton: {
    padding: 4,
  },
  shoppingCompletedSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4d4d4d',
  },
  shoppingCompletedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shoppingCompletedTitle: {
    fontSize: 12,
    color: '#909090',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  clearCompletedText: {
    fontSize: 12,
    color: '#ff4444',
    fontWeight: '500',
  },
  shoppingEmptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  shoppingEmptyText: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  shoppingEmptySubtext: {
    fontSize: 14,
    color: '#b0b0b0',
  },
});
