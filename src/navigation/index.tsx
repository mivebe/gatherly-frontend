import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { colors, font, nav, shadow } from '../theme';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EventsListScreen from '../screens/EventsListScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MyReservationsScreen from '../screens/MyReservationsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import EventReservationsScreen from '../screens/EventReservationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TabIcon =
  (name: IoniconName) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) =>
    <Ionicons name={name} size={size ?? 22} color={color} style={{ opacity: focused ? 1 : 0.6 }} />;

function useTabScreenOptions() {
  const insets = useSafeAreaInsets();
  const basePaddingBottom = 8;
  return {
    tabBarActiveTintColor: nav.tabActiveTint,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarLabelPosition: 'below-icon' as const,
    tabBarLabelStyle: {
      fontSize: font.size.xs,
      fontWeight: font.medium,
      textAlign: 'center' as const,
      includeFontPadding: false,
    },
    tabBarItemStyle: { paddingHorizontal: 2, paddingVertical: 4 },
    tabBarStyle: {
      height: nav.tabBarHeight + insets.bottom,
      paddingTop: 6,
      paddingBottom: basePaddingBottom + insets.bottom,
      backgroundColor: colors.surface,
      borderTopColor: colors.borderLight,
      ...shadow.sm,
    },
    tabBarAllowFontScaling: false,
    headerStyle: { backgroundColor: nav.headerBg, ...shadow.sm },
    headerTintColor: nav.headerTint,
    headerTitleStyle: { fontWeight: font.semibold as any, fontSize: font.size.lg },
    headerShadowVisible: false,
  };
}

const stackHeaderOptions = {
  headerStyle: { backgroundColor: nav.headerBg },
  headerTintColor: nav.headerTint,
  headerTitleStyle: { fontWeight: font.semibold as any, fontSize: font.size.lg },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
};

function UserTabs() {
  const tabScreenOptions = useTabScreenOptions();
  return (
    <Tabs.Navigator screenOptions={tabScreenOptions}>
      <Tabs.Screen name="Събития" component={EventsListScreen}
        options={{ tabBarIcon: TabIcon('ticket-outline') }} />
      <Tabs.Screen name="Календар" component={CalendarScreen}
        options={{ tabBarIcon: TabIcon('calendar-outline') }} />
      <Tabs.Screen name="Резервации" component={MyReservationsScreen}
        options={{ tabBarIcon: TabIcon('bookmark-outline') }} />
      <Tabs.Screen name="Профил" component={ProfileScreen}
        options={{ tabBarIcon: TabIcon('person-outline') }} />
    </Tabs.Navigator>
  );
}

function OrganizerTabs() {
  const tabScreenOptions = useTabScreenOptions();
  return (
    <Tabs.Navigator screenOptions={tabScreenOptions}>
      <Tabs.Screen name="Събития" component={EventsListScreen}
        options={{ tabBarIcon: TabIcon('ticket-outline') }} />
      <Tabs.Screen name="Календар" component={CalendarScreen}
        options={{ tabBarIcon: TabIcon('calendar-outline') }} />
      <Tabs.Screen name="Моите събития" component={MyEventsScreen}
        options={{ tabBarLabel: 'Мои', tabBarIcon: TabIcon('briefcase-outline') }} />
      <Tabs.Screen name="Профил" component={ProfileScreen}
        options={{ tabBarIcon: TabIcon('person-outline') }} />
    </Tabs.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <NavigationContainer>
      {user ? (
        <AppStack.Navigator screenOptions={stackHeaderOptions}>
          <AppStack.Screen name="Home" options={{ headerShown: false }}
            component={user.role === 'organizer' ? OrganizerTabs : UserTabs} />
          <AppStack.Screen name="EventDetails" component={EventDetailsScreen} options={{ title: 'Детайли' }} />
          <AppStack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Ново събитие' }} />
          <AppStack.Screen name="EventReservations" component={EventReservationsScreen}
            options={({ route }: any) => ({ title: route.params?.title || 'Резервации' })} />
        </AppStack.Navigator>
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
