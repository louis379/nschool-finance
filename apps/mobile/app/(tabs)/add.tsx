import { ScrollView, StyleSheet, Text, View } from 'react-native';

const NSCHOOL_PURPLE = '#6C5CE7';

export default function AddScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>記帳</Text>
        <Text style={styles.comingSoon}>Coming soon</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: NSCHOOL_PURPLE,
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: NSCHOOL_PURPLE,
    opacity: 0.7,
  },
});
