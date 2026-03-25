import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';


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

  return (
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

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[]; emoji?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const emoji = Array.isArray(params.emoji) ? params.emoji[0] : params.emoji;
  const [habitName, setHabitName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[2]);
  const [track, setTrack] = useState<TrackType>('Task');
  const [repeat, setRepeat] = useState<RepeatType>('Daily');
  const [days, setDays] = useState<string[]>(DAYS);
  const [monthDays, setMonthDays] = useState<string[]>(['1']);
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

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

  const loadHabit = useCallback(async () => {
    if (!id || isLoaded) {
      return;
    }
    try {
      const stored = await AsyncStorage.getItem('habits');
      const habits = stored ? JSON.parse(stored) : [];
      const target = Array.isArray(habits) ? habits.find((item) => item.id === id) : null;
      if (target) {
        setHabitName(target.name ?? '');
        setDescription(target.description ?? '');
        setColor(target.color ?? COLORS[2]);
        setTrack((target.track as TrackType) ?? 'Task');
        setRepeat((target.repeat as RepeatType) ?? 'Daily');
        setDays(Array.isArray(target.days) && target.days.length ? target.days : DAYS);
        setMonthDays(
          Array.isArray(target.monthDays) && target.monthDays.length ? target.monthDays : ['1'],
        );
        setStreak(Number.isFinite(Number(target.streak)) ? Number(target.streak) : 0);
        setLastCompletedDate(target.lastCompletedDate ?? null);
        if (!(typeof emoji === 'string' && emoji.length)) {
          setSelectedEmoji(target.emoji ?? null);
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load habit', error);
    }
  }, [id, isLoaded]);

  useEffect(() => {
    loadHabit();
  }, [loadHabit]);

  useEffect(() => {
    if (typeof emoji === 'string' && emoji.length) {
      setSelectedEmoji(emoji);
    }
  }, [emoji]);

  useEffect(() => {
    setIsLoaded(false);
  }, [id]);

  const handleSave = useCallback(async () => {
    if (!id || !habitName.trim()) {
      return;
    }
    try {
      const stored = await AsyncStorage.getItem('habits');
      const habits = stored ? JSON.parse(stored) : [];
      const next = Array.isArray(habits)
        ? habits.map((item) =>
          item.id === id
            ? {
              ...item,
              name: habitName.trim(),
              description: description.trim(),
                  color,
                  emoji: selectedEmoji,
                  track,
                  repeat,
                  days: repeat === 'Monthly' ? [] : days,
                  monthDays: repeat === 'Monthly' ? monthDays : [],
              streak,
              lastCompletedDate,
            }
            : item,
        )
        : [];
      await AsyncStorage.setItem('habits', JSON.stringify(next));
      router.replace('/');
    } catch (error) {
      console.error('Failed to save habit', error);
    }
  }, [
    id,
    habitName,
    description,
    color,
    track,
    repeat,
    days,
    monthDays,
    streak,
    lastCompletedDate,
    router,
  ]);

  const handleDelete = useCallback(async () => {
    if (!id) {
      return;
    }
    try {
      const stored = await AsyncStorage.getItem('habits');
      const habits = stored ? JSON.parse(stored) : [];
      const next = Array.isArray(habits) ? habits.filter((item) => item.id !== id) : [];
      await AsyncStorage.setItem('habits', JSON.stringify(next));
      router.replace('/');
    } catch (error) {
      console.error('Failed to delete habit', error);
    }
  }, [id, router]);

  const handleResetStreak = () => {
    setStreak(0);
    setLastCompletedDate(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Ionicons name="close-outline" size={32} color="#1F1F1F" />
        </Link>
        <View style={styles.actionRow}>
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Ionicons name="save-outline" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable
          style={[styles.habitIconWrap, { backgroundColor: color }]}
          onPress={() =>
            router.push({
              pathname: '/emoji-menu',
              params: { returnTo: '/edit/[id]', returnId: String(id), current: selectedEmoji ?? '' },
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
        <View style={styles.segmentCard}>
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

        <Text style={styles.sectionTitle}>Streak</Text>
        <View style={styles.streakCard}>
          <View style={styles.streakRow}>
            <View style={styles.streakInfo}>
              <Ionicons name="flame-outline" size={22} color="#FBBC05" />
              <Text style={styles.streakText}>{streak} Days</Text>
            </View>
            <Pressable style={styles.resetButton} onPress={handleResetStreak}>
              <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
            </Pressable>
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
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#EA4335',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#34A853',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 10,
    alignItems: 'center',
  },
  habitIconWrap: {
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
  streakCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakText: {
    fontSize: 16,
    color: '#5E636A',
    fontWeight: '600',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#FBBC05',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
