import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';


const imgIcRoundCheck = 'https://www.figma.com/api/mcp/asset/7f809075-d53f-4d4f-b2a3-3264fc7fbe73';
const imgIcRoundCheck1 = 'https://www.figma.com/api/mcp/asset/588c5126-f96e-4ebd-a252-660896a248b7';
const imgCiMenuAlt05 = 'https://www.figma.com/api/mcp/asset/b4a67355-7108-4e61-8136-ad3a303de090';
const imgIcRoundAdd = 'https://www.figma.com/api/mcp/asset/f92c6af4-082d-4cbc-8416-4af3262f02d9';
const imgGroup = 'https://www.figma.com/api/mcp/asset/e1e22605-c2a8-4c5b-b91e-26adb31c023c';
const imgGroup1 = 'https://www.figma.com/api/mcp/asset/161c9ab3-2755-4968-8a68-321dc0094db0';
const imgGroup2 = 'https://www.figma.com/api/mcp/asset/a6914fb5-f1b9-4102-ba48-e85e28d0363b';
const imgGroup3 = 'https://www.figma.com/api/mcp/asset/07b81dbe-c999-4176-a005-8fa59acb7ddf';
const imgStreamlineSleepRemix =
  'https://www.figma.com/api/mcp/asset/e357bdd7-d972-4a2e-9f59-0ec8c05ec859';

type CheckCircleProps = {
  done?: boolean;
};

function CheckCircle({ done }: CheckCircleProps) {
  return (
    <View style={[styles.checkCircle, done && styles.checkCircleDone]}>
      <Image
        source={{ uri: done ? imgIcRoundCheck1 : imgIcRoundCheck }}
        style={styles.checkIcon}
        contentFit="contain"
      />
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Image source={{ uri: imgCiMenuAlt05 }} style={styles.menuIcon} contentFit="contain" />
        <Text style={styles.brandText}>
          <Text style={styles.brandBlue}>H</Text>
          <Text style={styles.brandRed}>a</Text>
          <Text style={styles.brandYellow}>b</Text>
          <Text style={styles.brandBlue}>i</Text>
          <Text style={styles.brandGreen}>t</Text>
          <Text style={styles.brandRed}>s</Text>
          <Text style={styles.brandMuted}> Widget</Text>
        </Text>
        <Link href="/menu" asChild>
          <View style={styles.addButton}>
            <Image source={{ uri: imgIcRoundAdd }} style={styles.addIcon} contentFit="contain" />
          </View>
        </Link>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>3</Text>
          <View style={styles.countIconWrap}>
            <Image source={{ uri: imgGroup }} style={styles.seedIcon} contentFit="contain" />
            <Text style={styles.countLabel}>
              Habits{'\n'}Count
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Habits List</Text>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconWrap, styles.habitIconYellow]}>
            <Image source={{ uri: imgGroup1 }} style={styles.habitIcon} contentFit="contain" />
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitTitle}>Read 20 Minutes</Text>
            <View style={styles.habitStreakRow}>
              <View style={styles.streakInfo}>
                <Image source={{ uri: imgGroup2 }} style={styles.fireIcon} contentFit="contain" />
                <Text style={styles.streakText}>7 Days</Text>
              </View>
              <CheckCircle />
            </View>
          </View>
        </View>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconWrap, styles.habitIconGreen]}>
            <Image source={{ uri: imgGroup3 }} style={styles.habitIcon} contentFit="contain" />
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitTitle}>Workout 1 Hour</Text>
            <View style={styles.habitStreakRow}>
              <View style={styles.streakInfo}>
                <Image source={{ uri: imgGroup2 }} style={styles.fireIcon} contentFit="contain" />
                <Text style={styles.streakText}>3 Days</Text>
              </View>
              <CheckCircle />
            </View>
          </View>
        </View>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconWrap, styles.habitIconBlue]}>
            <Image source={{ uri: imgStreamlineSleepRemix }} style={styles.habitIcon} contentFit="contain" />
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.habitTitle}>Sleep 8 Hours</Text>
            <View style={styles.habitStreakRow}>
              <View style={styles.streakInfo}>
                <Image source={{ uri: imgGroup2 }} style={styles.fireIcon} contentFit="contain" />
                <Text style={styles.streakText}>30 Days</Text>
              </View>
              <CheckCircle done />
            </View>
          </View>
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
  menuIcon: {
    width: 60,
    height: 60,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F1F1F',
  },
  brandBlue: { color: '#4285F4' },
  brandRed: { color: '#EA4335' },
  brandYellow: { color: '#FBBC05' },
  brandGreen: { color: '#34A853' },
  brandMuted: { color: '#5E636A' },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FBBC05',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 20,
  },
  countCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 20,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  countNumber: {
    fontSize: 96,
    color: '#5E636A',
    fontWeight: '400',
  },
  countIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedIcon: {
    width: 60,
    height: 60,
  },
  countLabel: {
    fontSize: 10,
    color: '#5E636A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#4285F4',
    fontWeight: '600',
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitIconWrap: {
    borderRadius: 16,
    padding: 10,
    borderWidth: 4,
    borderColor: 'rgba(94,99,106,0.1)',
  },
  habitIconYellow: { backgroundColor: '#FBBC05' },
  habitIconGreen: { backgroundColor: '#34A853' },
  habitIconBlue: { backgroundColor: '#4285F4' },
  habitIcon: {
    width: 60,
    height: 60,
  },
  habitInfo: {
    flex: 1,
    gap: 10,
  },
  habitTitle: {
    fontSize: 20,
    color: '#5E636A',
    fontWeight: '600',
  },
  habitStreakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fireIcon: {
    width: 30,
    height: 30,
  },
  streakText: {
    fontSize: 16,
    color: '#5E636A',
    fontWeight: '600',
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkCircleDone: {
    backgroundColor: '#34A853',
  },
  checkIcon: {
    width: 20,
    height: 20,
  },
});
