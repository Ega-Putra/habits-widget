import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OptionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Link href={"/"} asChild>
          <Pressable style={styles.navButton}>
            <Ionicons name="close-outline" size={28} color="#1F1F1F" />
          </Pressable>
        </Link>
        <Text style={styles.title}>Menu</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Settings */}
          <Pressable
            style={styles.optionRow}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#4285F4' }]}>
              <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Settings</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#5E636A" />
          </Pressable>

          {/* Theme */}
          <Pressable
            style={styles.optionRow}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#EA4335' }]}>
              <Ionicons name="color-palette-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Theme</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#5E636A" />
          </Pressable>

          {/* Widget Preview */}
          <Link href="/widget-preview" asChild style={styles.optionRow}>
            <Pressable>
              <View style={[styles.iconContainer, { backgroundColor: '#FBBC05' }]}>
                <Ionicons name="apps-outline" size={22} color="#FFFFFF" />
              </View>
              <Text style={styles.optionText}>Widget Preview</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#5E636A" />
            </Pressable>
          </Link>

          {/* Notification */}
          <Pressable
            style={styles.optionRow}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#4285F4' }]}>
              <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Notification</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#5E636A" />
          </Pressable>

          {/* About */}
          <Pressable
            style={styles.optionRow}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#34A853' }]}>
              <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>About</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#5E636A" />
          </Pressable>

          {/* Privacy Policy */}
          <Pressable
            style={[styles.optionRow, styles.noBorder]}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#EA4335' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.optionText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#5E636A" />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  navSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#1F1F1F',
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#5E636A',
  },
});
