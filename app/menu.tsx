import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const imgClose = 'https://www.figma.com/api/mcp/asset/a45ed7d2-1ad2-4413-9387-9dbfcfcb63be';
const imgBook = 'https://www.figma.com/api/mcp/asset/312758ea-241a-4a27-b61d-3238a6f55247';

function SegmentBar() {
  return (
    <View style={styles.segmentOuter}>
      <View style={[styles.segmentPill, styles.segmentActive]}>
        <Text style={styles.segmentTextActive}>Task</Text>
      </View>
      <View style={styles.segmentPill}>
        <Text style={styles.segmentText}>Amount</Text>
      </View>
      <View style={styles.segmentPill}>
        <Text style={styles.segmentText}>Time</Text>
      </View>
    </View>
  );
}

function RepeatCard() {
  return (
    <View style={styles.repeatCard}>
      <View style={styles.repeatTabs}>
        <View style={[styles.repeatTab, styles.repeatTabActive]}>
          <Text style={styles.repeatTabTextActive}>Daily</Text>
        </View>
        <View style={styles.repeatTab}>
          <Text style={styles.repeatTabText}>Weekly</Text>
        </View>
        <View style={styles.repeatTab}>
          <Text style={styles.repeatTabText}>Monthly</Text>
        </View>
      </View>
      <View style={styles.repeatDays}>
        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
          <View key={day} style={styles.repeatDayPill}>
            <Text style={styles.repeatDayText}>{day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function MenuScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Image source={{ uri: imgClose }} style={styles.closeIcon} contentFit="contain" />
        </Link>
        <View style={styles.createBadge}>
          <Text style={styles.createText}>Create</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.habitIconWrap}>
          <Image source={{ uri: imgBook }} style={styles.habitIcon} contentFit="contain" />
        </View>
        <Text style={styles.habitName}>Habit Name</Text>
        <Text style={styles.habitDescription}>Add Description</Text>

        <View style={styles.colorRow}>
          <View style={[styles.colorDot, styles.colorBlue]} />
          <View style={[styles.colorDot, styles.colorRed]} />
          <View style={[styles.colorDot, styles.colorYellow]} />
          <View style={[styles.colorDot, styles.colorGreen]} />
        </View>

        <Text style={styles.sectionTitle}>Track</Text>
        <View style={styles.segmentCard}>
          <SegmentBar />
        </View>

        <Text style={styles.sectionTitle}>Repeat</Text>
        <RepeatCard />
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
  closeIcon: {
    width: 40,
    height: 40,
  },
  createBadge: {
    backgroundColor: '#FBBC05',
    borderRadius: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  createText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 10,
    alignItems: 'center',
  },
  habitIconWrap: {
    backgroundColor: '#FBBC05',
    borderRadius: 16,
    padding: 10,
    borderWidth: 4,
    borderColor: 'rgba(94,99,106,0.1)',
  },
  habitIcon: {
    width: 60,
    height: 60,
  },
  habitName: {
    fontSize: 24,
    color: '#1F1F1F',
    fontWeight: '600',
  },
  habitDescription: {
    fontSize: 16,
    color: '#5E636A',
    fontWeight: '500',
  },
  colorRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 80,
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  colorDot: {
    width: 40,
    height: 40,
    borderRadius: 16,
  },
  colorBlue: { backgroundColor: '#4285F4' },
  colorRed: { backgroundColor: '#EA4335' },
  colorYellow: { backgroundColor: '#FBBC05' },
  colorGreen: { backgroundColor: '#34A853' },
  sectionTitle: {
    fontSize: 16,
    color: '#4285F4',
    fontWeight: '600',
  },
  segmentCard: {
    width: 320,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentOuter: {
    backgroundColor: '#5E636A',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentPill: {
    width: 100,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: '#34A853',
  },
  segmentText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  segmentTextActive: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  repeatCard: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  repeatTabs: {
    backgroundColor: '#5E636A',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  repeatTab: {
    width: 100,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatTabActive: {
    backgroundColor: '#34A853',
  },
  repeatTabText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  repeatTabTextActive: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  repeatDays: {
    backgroundColor: '#34A853',
    borderRadius: 24,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  repeatDayPill: {
    width: 36,
    height: 30,
    borderRadius: 24,
    backgroundColor: '#5E636A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatDayText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'lowercase',
  },
});
