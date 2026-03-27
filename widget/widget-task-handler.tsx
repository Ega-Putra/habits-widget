import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
// import { HelloWidget } from './hellowidget';
import { HabitWidget } from './habitwidget';
import { HabitWidgetFixed } from './habitwidgetfixed';

const nameToWidget = {
    // Hello will be the **name** with which we will reference our widget.
    // Hello: HelloWidget,
    Habit: HabitWidget,
    HabitFixed: HabitWidgetFixed,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const Widget =
        nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget];
    const todayKey = toDateKey(new Date());

    switch (props.widgetAction) {
        case 'WIDGET_ADDED': {
            if (widgetInfo.widgetName === 'Habit') {
                const habits = await loadHabits(todayKey);
                props.renderWidget(<HabitWidget habits={habits} />);
                break;
            } else if (widgetInfo.widgetName === 'HabitFixed') {
                const habits = await loadHabits(todayKey);
                props.renderWidget(<HabitWidgetFixed habits={habits} />);
                break;
            }
            props.renderWidget(<Widget />);
            break;
        }

        case 'WIDGET_UPDATE': {
            if (widgetInfo.widgetName === 'Habit') {
                const habits = await loadHabits(todayKey);
                props.renderWidget(<HabitWidget habits={habits} />);
                break;
            } else if (widgetInfo.widgetName === 'HabitFixed') {
                const habits = await loadHabits(todayKey);
                props.renderWidget(<HabitWidgetFixed habits={habits} />);
                break;
            }
            break;
        }
        case 'WIDGET_CLICK': {
            if (widgetInfo.widgetName === 'Habit' && props.clickAction === 'TOGGLE_HABIT') {
                const habitId = String(props.clickActionData?.id ?? '');
                if (habitId) {
                    const habits = await loadHabits(todayKey);
                    const next = toggleHabitDone(habits, habitId, todayKey);
                    await AsyncStorage.setItem('habits', JSON.stringify(next));
                    props.renderWidget(<HabitWidget habits={next} />);
                }
            } else if (widgetInfo.widgetName === 'HabitFixed' && props.clickAction === 'TOGGLE_HABIT') {
                const habitId = String(props.clickActionData?.id ?? '');
                if (habitId) {
                    const habits = await loadHabits(todayKey);
                    const next = toggleHabitDone(habits, habitId, todayKey);
                    await AsyncStorage.setItem('habits', JSON.stringify(next));
                    props.renderWidget(<HabitWidgetFixed habits={next} />);
                }
            }
            break;
        }

        case 'WIDGET_RESIZED':
            // Not needed for now
            break;

        case 'WIDGET_DELETED':
            // Not needed for now
            break;

        case 'WIDGET_CLICK':
            // Not needed for now
            break;

        default:
            break;
    }
}

type Habit = {
    id: string;
    name: string;
    color: string;
    emoji?: string | null;
    track: 'Task' | 'Amount' | 'Time';
    repeat: 'Daily' | 'Weekly' | 'Monthly';
    days: string[];
    monthDays: string[];
    streak: number;
    lastCompletedDate: string | null;
};

const WEEKDAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function parseDateKey(key: string) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function isDueDate(habit: Habit, date: Date) {
    if (habit.repeat === 'Monthly') {
        const day = `${date.getDate()}`;
        return Array.isArray(habit.monthDays) && habit.monthDays.includes(day);
    }
    const weekday = WEEKDAYS[date.getDay()];
    const days = Array.isArray(habit.days) ? habit.days : [];
    if (days.length === 0) {
        return true;
    }
    return days.includes(weekday);
}

function hasMissedDue(habit: Habit, lastCompletedDate: string | null, todayKey: string) {
    if (!lastCompletedDate) {
        return false;
    }
    const lastDate = parseDateKey(lastCompletedDate);
    const today = parseDateKey(todayKey);
    if (lastDate >= today) {
        return false;
    }
    const cursor = new Date(lastDate);
    cursor.setDate(cursor.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    while (cursor <= yesterday) {
        if (isDueDate(habit, cursor)) {
            return true;
        }
        cursor.setDate(cursor.getDate() + 1);
    }
    return false;
}

async function loadHabits(todayKey: string): Promise<Habit[]> {
    const stored = await AsyncStorage.getItem('habits');
    const parsed = stored ? JSON.parse(stored) : [];
    const normalized = Array.isArray(parsed)
        ? parsed.map((habit) => {
            const next = {
                ...habit,
                streak: Number.isFinite(Number(habit.streak)) ? Number(habit.streak) : 0,
            } as Habit;
            if (hasMissedDue(next, next.lastCompletedDate, todayKey)) {
                return {
                    ...next,
                    streak: 0,
                    lastCompletedDate: null,
                };
            }
            return next;
        })
        : [];
    return normalized;
}

function toggleHabitDone(habits: Habit[], habitId: string, todayKey: string) {
    const todayDate = parseDateKey(todayKey);
    return habits.map((habit) => {
        if (habit.id !== habitId) {
            return habit;
        }
        if (!isDueDate(habit, todayDate)) {
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
}
