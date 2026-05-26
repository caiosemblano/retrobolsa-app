import React, { createContext, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, Platform } from 'react-native';

interface TabsContextProps {
  value: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Tabs({ defaultValue, value, onValueChange, children, style }: TabsProps) {
  const [localValue, setLocalValue] = React.useState(defaultValue);
  const activeValue = value !== undefined ? value : localValue;

  const handleValueChange = (val: string) => {
    if (value === undefined) {
      setLocalValue(val);
    }
    if (onValueChange) {
      onValueChange(val);
    }
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <View style={[styles.tabsContainer, style]}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsList({ children, style }: TabsListProps) {
  return (
    <View style={[styles.tabsList, style]}>
      {children}
    </View>
  );
}

interface TabsTriggerProps {
  value: string;
  children: string;
  style?: ViewStyle;
}

export function TabsTrigger({ value: triggerValue, children, style }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const isActive = context.value === triggerValue;

  return (
    <TouchableOpacity
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
        style,
      ]}
      onPress={() => context.onValueChange?.(triggerValue)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.triggerText,
          isActive && styles.triggerTextActive,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function TabsContent({ value: contentValue, children, style }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  if (context.value !== contentValue) {
    return null;
  }

  return (
    <View style={[styles.tabsContent, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    width: '100%',
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9', // slate-100
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsTriggerActive: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(100, 116, 139, 0.1)',
      } as any,
    }),
  },
  triggerText: {
    fontSize: 14,
    color: '#64748b', // slate-500
    fontWeight: '500',
  },
  triggerTextActive: {
    color: '#0f172a', // slate-900
    fontWeight: '600',
  },
  tabsContent: {
    width: '100%',
  },
});
