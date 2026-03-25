import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

type Habit = {
  id: string;
  name: string;
  description?: string;
  color: string;
  emoji?: string | null;
  track: 'Task' | 'Amount' | 'Time';
  repeat: 'Daily' | 'Weekly' | 'Monthly';
  days: string[];
  monthDays: string[];
  streak: number;
  lastCompletedDate: string | null;
  createdAt: string;
};

type CheckCircleProps = {
  done?: boolean;
  onPress?: () => void;
};

function CheckCircle({ done, onPress }: CheckCircleProps) {
  const Container = onPress ? Pressable : View;
  return (
    <Container style={[styles.checkCircle, done && styles.checkCircleDone]} onPress={onPress}>
      <Ionicons
        name={done ? 'checkmark-outline' : 'checkmark-outline'}
        size={18}
        color={done ? '#FFFFFF' : '#5E636A'}
      />
    </Container>
  );
}

export default function HomeScreen() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const todayKey = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const loadHabits = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      const parsed = stored ? JSON.parse(stored) : [];
      const normalized = Array.isArray(parsed)
        ? parsed.map((habit) => ({
          ...habit,
          streak: Number.isFinite(Number(habit.streak)) ? Number(habit.streak) : 0,
        }))
        : [];
      setHabits(normalized);
    } catch (error) {
      console.error('Failed to load habits', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits]),
  );

  const persistHabits = useCallback(async (nextHabits: Habit[]) => {
    setHabits(nextHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(nextHabits));
  }, []);

  const toggleDone = useCallback(
    async (habitId: string) => {
      const nextHabits = habits.map((habit) => {
        if (habit.id !== habitId) {
          return habit;
        }
        const isDoneToday = habit.lastCompletedDate === todayKey;
        if (isDoneToday) {
          return habit;
        }
        return {
          ...habit,
          lastCompletedDate: todayKey,
          streak: (Number.isFinite(Number(habit.streak)) ? Number(habit.streak) : 0) + 1,
        };
      });
      await persistHabits(nextHabits);
    },
    [habits, persistHabits, todayKey],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Ionicons name="menu-outline" size={34} color="#5E636A" />
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
            <Ionicons name="add-outline" size={24} color="#FFFFFF" />
          </View>
        </Link>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.countCard}>
          <Text style={styles.countNumber}>{habits.length}</Text>
          <View style={styles.countIconWrap}>
            <FontAwesome5 name="seedling" size={44} color="green" />
            <Text style={styles.countLabel}>
              Habits{'\n'}Count
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Habits List</Text>

        {habits.map((habit) => {
          const isDoneToday = habit.lastCompletedDate === todayKey;
          return (
            <View key={habit.id} style={styles.habitCard}>
              <Link href={{ pathname: '/edit/[id]', params: { id: habit.id } }} asChild>
                <Pressable style={styles.habitContent}>
                  <View style={[styles.habitIconWrap, { backgroundColor: habit.color }]}>
                    {habit.emoji ? (
                      <Ionicons
                        name={habit.emoji as keyof typeof Ionicons.glyphMap}
                        size={36}
                        color="#1F1F1F"
                      />
                    ) : (
                      <Ionicons name="book-outline" size={36} color="#1F1F1F" />
                    )}
                  </View>
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle}>{habit.name}</Text>
                    <View style={styles.habitStreakRow}>
                      <View style={styles.streakInfo}>
                        <Ionicons name="flame-outline" size={20} color="#FBBC05" />
                        <Text style={styles.streakText}>{habit.streak ?? 0} Days</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Link>
              <CheckCircle done={isDoneToday} onPress={() => toggleDone(habit.id)} />
            </View>
          );
        })}
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
  habitContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  habitIconWrap: {
    borderRadius: 16,
    padding: 10,
    borderWidth: 4,
    borderColor: 'rgba(94,99,106,0.1)',
  },
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
});
