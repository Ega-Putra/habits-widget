import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OPTIONS = [
  { label: 'Settings', color: '#4285F4' },
  { label: 'Theme', color: '#EA4335' },
  { label: 'Widget', color: '#FBBC05' },
  { label: 'Notification', color: '#4285F4' },
  { label: 'About', color: '#34A853' },
  { label: 'Policy', color: '#EA4335' },
];

export default function OptionScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Ionicons name="close-outline" size={32} color="#1F1F1F" />
        </Link>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {OPTIONS.map((item) => (
            <View key={item.label} style={[styles.optionRow, { backgroundColor: item.color }]}>
              <Text style={styles.optionText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF4FB',
  },
  navbar: {
    height: 80,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    color: '#5E636A',
    fontWeight: '900',
  },
  navSpacer: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 10,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionRow: {
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
