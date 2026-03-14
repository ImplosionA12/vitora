import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, activeName, label, focused, accent }: {
  name: IoniconName; activeName: IoniconName; label: string; focused: boolean; accent: string;
}) {
  return (
    <View style={[styles.tabItem, focused && { backgroundColor: accent + '1e', borderColor: accent + '30' }]}>
      <Ionicons name={focused ? activeName : name} size={21} color={focused ? accent : 'rgba(255,255,255,0.28)'} />
      <Text style={[styles.tabLabel, { color: focused ? accent : 'rgba(255,255,255,0.28)' }]}>{label}</Text>
      {focused && (
        <LinearGradient
          colors={['transparent', accent, 'transparent']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.glowLine}
          pointerEvents="none"
        />
      )}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarItemStyle: styles.tabBarItem,
          tabBarBackground: () => (
            <View style={StyleSheet.absoluteFillObject}>
              <LinearGradient
                colors={['transparent', 'rgba(123,79,212,0.28)', 'transparent']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.topBorderGlow}
                pointerEvents="none"
              />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="home-outline" activeName="home" label="Home" focused={focused} accent="#9B7FFF" />
            ),
          }}
        />
        <Tabs.Screen
          name="health"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="heart-outline" activeName="heart" label="Health" focused={focused} accent={Colors.red} />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="bar-chart-outline" activeName="bar-chart" label="Insights" focused={focused} accent={Colors.amber} />
            ),
          }}
        />
        <Tabs.Screen
          name="sos"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon name="warning-outline" activeName="warning" label="SOS" focused={focused} accent={Colors.red} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0a0a16',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    height: 68,
    paddingHorizontal: 8,
    paddingTop: 0,
    paddingBottom: 0,
    elevation: 0,
  },
  tabBarItem: {
    height: 68,
    paddingTop: 0,
    paddingBottom: 0,
  },
  topBorderGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 3,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  glowLine: {
    position: 'absolute',
    bottom: 5,
    width: 28,
    height: 2,
    borderRadius: 1,
    alignSelf: 'center',
  },
});
