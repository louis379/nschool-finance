import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#ADB5BD',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F3F0FF',
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: '#6C5CE7',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首頁',
          headerTitle: 'nSchool Finance',
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: '交易',
          headerTitle: '模擬交易',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '記帳',
          headerTitle: '新增記帳',
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: '資訊',
          headerTitle: '財經資訊',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          headerTitle: '個人中心',
        }}
      />
    </Tabs>
  );
}
