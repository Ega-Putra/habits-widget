import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type TrackType = 'Task' | 'Amount' | 'Time';
type RepeatType = 'Daily' | 'Weekly' | 'Monthly';

const COLORS = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => `${index + 1}`);

type SegmentBarProps = {
  value: TrackType;
  onChange: (value: TrackType) => void;
  amount: number;
  time: number;
  onAdjust: (type: 'Amount' | 'Time', delta: number) => void;
};

function SegmentBar({ value, onChange, amount, time, onAdjust }: SegmentBarProps) {
  const items: TrackType[] = ['Task', 'Amount', 'Time'];
  const showDetail = value !== 'Task';
  const isAmount = value === 'Amount';
  const currentValue = isAmount ? amount : time;
  const unit = isAmount ? 'times' : 'minute';

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
          <View style={styles.adjustRow}>
            <Pressable
              style={styles.adjustButton}
              onPress={() => onAdjust(isAmount ? 'Amount' : 'Time', -5)}
            >
              <Text style={styles.adjustText}>-5</Text>
            </Pressable>
            <Pressable
              style={styles.adjustButton}
              onPress={() => onAdjust(isAmount ? 'Amount' : 'Time', -1)}
            >
              <Text style={styles.adjustText}>-1</Text>
            </Pressable>
          </View >
          <Ionicons name={isAmount ? 'repeat-outline' : 'time-outline'} size={18} color="#FFFFFF" />
          <Text style={styles.segmentDetailText}>
            {currentValue} {unit}
          </Text>
          <View style={styles.adjustRow}>
            <Pressable
              style={styles.adjustButton}
              onPress={() => onAdjust(isAmount ? 'Amount' : 'Time', 1)}
            >
              <Text style={styles.adjustText}>+1</Text>
            </Pressable>
            <Pressable
              style={styles.adjustButton}
              onPress={() => onAdjust(isAmount ? 'Amount' : 'Time', 5)}
            >
              <Text style={styles.adjustText}>+5</Text>
            </Pressable>
          </View>
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
  const { emoji } = useLocalSearchParams<{ emoji?: string }>();
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[2]);
  const [track, setTrack] = useState<TrackType>('Task');
  const [repeat, setRepeat] = useState<RepeatType>('Daily');
  const [days, setDays] = useState<string[]>(DAYS);
  const [monthDays, setMonthDays] = useState<string[]>(['1']);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState(1);
  const [timeValue, setTimeValue] = useState(0);

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

  const adjustValue = (type: 'Amount' | 'Time', delta: number) => {
    if (type === 'Amount') {
      setAmountValue((prev) => Math.max(0, prev + delta));
      return;
    }
    setTimeValue((prev) => Math.max(0, prev + delta));
  };

  useEffect(() => {
    if (typeof emoji === 'string' && emoji.length) {
      setSelectedEmoji(emoji);
    }
  }, [emoji]);

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
        emoji: selectedEmoji,
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
          <Ionicons name="close-outline" size={32} color="#1F1F1F" />
        </Link>
        <Pressable
          style={[styles.createBadge, !habitName.trim() && styles.createBadgeDisabled]}
          onPress={handleCreate}
        >
          <Text style={styles.createText}>Create</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable
          style={[styles.habitIconWrap, { backgroundColor: color }]}
          onPress={() =>
            router.push({
              pathname: '/emoji-menu',
              params: { returnTo: '/menu', current: selectedEmoji ?? '' },
            })
          }
        >
          {selectedEmoji ? (
            <Ionicons
              name={selectedEmoji as keyof typeof Ionicons.glyphMap}
              size={44}
              color="#1F1F1F"
            />
          ) : (
            <Ionicons name="book-outline" size={44} color="#1F1F1F" />
          )}
        </Pressable>
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
          <SegmentBar
            value={track}
            onChange={setTrack}
            amount={amountValue}
            time={timeValue}
            onAdjust={adjustValue}
          />
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
    paddingHorizontal: 20,
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
    width: '100%',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  segmentDetailText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adjustButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adjustText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  repeatCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
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
    width: '100%',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    borderWidth: 1,
    borderColor: 'white',
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
    borderWidth: 1,
    borderColor: 'white',
  },
  repeatGridText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
