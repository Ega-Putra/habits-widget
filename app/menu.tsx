import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const imgClose = 'https://www.figma.com/api/mcp/asset/a45ed7d2-1ad2-4413-9387-9dbfcfcb63be';
const imgBook = 'https://www.figma.com/api/mcp/asset/312758ea-241a-4a27-b61d-3238a6f55247';
const imgRepeat = 'https://www.figma.com/api/mcp/asset/6068895b-752b-4d37-9fce-01fcf5a68254';
const imgTime = 'https://www.figma.com/api/mcp/asset/11f38d92-e065-4e74-9371-cf1ba0cbae79';

type TrackType = 'Task' | 'Amount' | 'Time';
type RepeatType = 'Daily' | 'Weekly' | 'Monthly';

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => `${index + 1}`);

type SegmentBarProps = {
  value: TrackType;
  onChange: (value: TrackType) => void;
};

function SegmentBar({ value, onChange }: SegmentBarProps) {
  const items: TrackType[] = ['Task', 'Amount', 'Time'];
  const showDetail = value !== 'Task';

  return (
    <View style={[styles.segmentContainer, showDetail && styles.segmentContainerTall]}>
      <View style={styles.segmentOuter}>
        {items.map((item) => {
          const isActive = value === item;
          return (
            <Pressable
              key={item}
              onPress={() => onChange(item)}
              style={[styles.segmentPill, isActive && styles.segmentActive]}
            >
              <Text style={isActive ? styles.segmentTextActive : styles.segmentText}>{item}</Text>
            </Pressable>
          );
        })}
      </View>
      {showDetail && (
        <View style={styles.segmentDetail}>
          <Image
            source={{ uri: value === 'Amount' ? imgRepeat : imgTime }}
            style={styles.segmentDetailIcon}
            contentFit="contain"
          />
          <Text style={styles.segmentDetailText}>
            {value === 'Amount' ? '1 times' : '15 minute'}
          </Text>
        </View>
      )}
    </View>
  );
}

type RepeatCardProps = {
  repeat: RepeatType;
  onRepeatChange: (value: RepeatType) => void;
  days: string[];
  onToggleDay: (day: string) => void;
  monthDays: string[];
  onToggleMonthDay: (day: string) => void;
};

function RepeatCard({
  repeat,
  onRepeatChange,
  days,
  onToggleDay,
  monthDays,
  onToggleMonthDay,
}: RepeatCardProps) {
  const tabs: RepeatType[] = ['Daily', 'Weekly', 'Monthly'];
  const isMonthly = repeat === 'Monthly';

  return (
    <View style={[styles.repeatCard, isMonthly && styles.repeatCardMonthly]}>
      <View style={styles.repeatTabs}>
        {tabs.map((tab) => {
          const isActive = repeat === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => onRepeatChange(tab)}
              style={[styles.repeatTab, isActive && styles.repeatTabActive]}
            >
              <Text style={isActive ? styles.repeatTabTextActive : styles.repeatTabText}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isMonthly ? (
        <View style={styles.repeatGrid}>
          {MONTH_DAYS.map((day) => {
            const isSelected = monthDays.includes(day);
            return (
              <Pressable
                key={day}
                onPress={() => onToggleMonthDay(day)}
                style={[styles.repeatGridPill, isSelected && styles.repeatGridPillActive]}
              >
                <Text style={styles.repeatGridText}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.repeatDays}>
          {DAYS.map((day) => {
            const isSelected = days.includes(day);
            return (
              <Pressable
                key={day}
                onPress={() => onToggleDay(day)}
                style={[styles.repeatDayPill, isSelected && styles.repeatDayPillActive]}
              >
                <Text style={styles.repeatDayText}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function MenuScreen() {
  const router = useRouter();
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[2]);
  const [track, setTrack] = useState<TrackType>('Task');
  const [repeat, setRepeat] = useState<RepeatType>('Daily');
  const [days, setDays] = useState<string[]>(DAYS);
  const [monthDays, setMonthDays] = useState<string[]>(['1']);
  const [isSaving, setIsSaving] = useState(false);

  const daySelectionEnabled = useMemo(() => repeat === 'Daily' || repeat === 'Weekly', [repeat]);

  const toggleDay = (day: string) => {
    if (!daySelectionEnabled) {
      return;
    }
    setDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const toggleMonthDay = (day: string) => {
    if (repeat !== 'Monthly') {
      return;
    }
    setMonthDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day],
    );
  };

  const handleCreate = async () => {
    if (!habitName.trim() || isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        id: String(Date.now()),
        name: habitName.trim(),
        description: description.trim(),
        color,
        track,
        repeat,
        days: repeat === 'Monthly' ? [] : days,
        monthDays: repeat === 'Monthly' ? monthDays : [],
        streak: 0,
        lastCompletedDate: null,
        createdAt: new Date().toISOString(),
      };
      const existing = await AsyncStorage.getItem('habits');
      const habits = existing ? JSON.parse(existing) : [];
      habits.push(payload);
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
      router.replace('/');
    } catch (error) {
      console.error('Failed to save habit', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Image source={{ uri: imgClose }} style={styles.closeIcon} contentFit="contain" />
        </Link>
        <Pressable
          style={[styles.createBadge, !habitName.trim() && styles.createBadgeDisabled]}
          onPress={handleCreate}
        >
          <Text style={styles.createText}>Create</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.habitIconWrap, { backgroundColor: color }]}>
          <Image source={{ uri: imgBook }} style={styles.habitIcon} contentFit="contain" />
        </View>
        <TextInput
          value={habitName}
          onChangeText={setHabitName}
          style={styles.habitName}
          placeholder="Habit Name"
          placeholderTextColor="#1F1F1F"
          textAlign="center"
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={styles.habitDescription}
          placeholder="Add Description"
          placeholderTextColor="#5E636A"
          textAlign="center"
        />

        <View style={styles.colorRow}>
          {COLORS.map((item) => {
            const isSelected = color === item;
            return (
              <Pressable
                key={item}
                onPress={() => setColor(item)}
                style={[
                  styles.colorDot,
                  { backgroundColor: item },
                  isSelected && styles.colorDotSelected,
                ]}
              />
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Track</Text>
        <View style={[styles.segmentCard, track !== 'Task' && styles.segmentCardTall]}>
          <SegmentBar value={track} onChange={setTrack} />
        </View>

        <Text style={styles.sectionTitle}>Repeat</Text>
        <RepeatCard
          repeat={repeat}
          onRepeatChange={setRepeat}
          days={days}
          onToggleDay={toggleDay}
          monthDays={monthDays}
          onToggleMonthDay={toggleMonthDay}
        />
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
  createBadgeDisabled: {
    opacity: 0.5,
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
    paddingVertical: 2,
    textAlign: 'center',
  },
  habitDescription: {
    fontSize: 16,
    color: '#5E636A',
    fontWeight: '500',
    paddingVertical: 2,
    textAlign: 'center',
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
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#5E636A',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#4285F4',
    fontWeight: '600',
  },
  segmentCard: {
    width: '100%',
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
  segmentCardTall: {
    paddingVertical: 20,
  },
  segmentContainer: {
    height: 40,
    justifyContent: 'center',
  },
  segmentContainerTall: {
    height: 100,
    justifyContent: 'space-between',
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
  segmentDetail: {
    backgroundColor: '#34A853',
    borderRadius: 24,
    paddingHorizontal: 24,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  segmentDetailIcon: {
    width: 30,
    height: 30,
  },
  segmentDetailText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  repeatCard: {
    width: '100%',
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
  repeatCardMonthly: {
    gap: 10,
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
  repeatGrid: {
    backgroundColor: '#34A853',
    borderRadius: 24,
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  repeatDayPill: {
    width: 36,
    height: 30,
    borderRadius: 24,
    backgroundColor: '#5E636A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatDayPillActive: {
    backgroundColor: '#34A853',
  },
  repeatDayText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  repeatGridPill: {
    width: 20,
    height: 20,
    borderRadius: 16,
    backgroundColor: '#5E636A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatGridPillActive: {
    backgroundColor: '#34A853',
  },
  repeatGridText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
