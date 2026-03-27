'use no memo';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlexWidget, IconWidget, TextWidget } from 'react-native-android-widget';

const iconChar = (name: keyof typeof Ionicons.glyphMap) => {
    const glyph = Ionicons.glyphMap[name];
    return typeof glyph === 'number' ? String.fromCharCode(glyph) : glyph;
};

type Habit = {
    id: string;
    name: string;
    color: string;
    emoji?: string | null;
    streak: number;
    lastCompletedDate?: string | null;
};

export function HabitWidget({ habits = [] as Habit[] }: { habits?: Habit[] }) {
    const todayKey = toDateKey(new Date());
    const items = habits;
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#EFF4FB',
                borderRadius: 24,
                padding: 10,
                flexGap: 10,
            }}
            clickAction="OPEN_APP"
            accessibilityLabel="Open habits"
        >
            {items.map((habit) => (
                <HabitRow
                    key={habit.id}
                    color={habit.color}
                    name={habit.name}
                    streak={`${habit.streak ?? 0} Days`}
                    emoji={habit.emoji ?? null}
                    done={habit.lastCompletedDate === todayKey}
                    habitId={habit.id}
                />
            ))}
        </FlexWidget>
    );
}

function HabitRow({
    color,
    name,
    streak,
    emoji,
    done,
    habitId,
}: {
    color: string;
    name: string;
    streak: string;
    emoji?: string | null;
    done: boolean;
    habitId: string;
}) {
    const iconName =
        emoji && typeof emoji === 'string' && emoji.length
            ? (emoji as keyof typeof Ionicons.glyphMap)
            : 'book-outline';
    return (
        <FlexWidget
            style={{
                height: 40,
                width: 'match_parent',
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <FlexWidget
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexGap: 10,
                }}
            >
                <FlexWidget
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        backgroundColor: color as `#${string}`,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconWidget
                        icon={iconChar(iconName)}
                        size={16}
                        font="Ionicons"
                        style={{ color: '#1F1F1F' }}
                    />
                </FlexWidget>
                <FlexWidget
                    style={{
                        flexDirection: 'column',
                        flexGap: 2,
                    }}
                >
                    <TextWidget
                        text={name}
                        style={{
                            fontSize: 10,
                            color: '#1F1F1F',
                        }}
                    />
                    <FlexWidget
                        style={{
                            flexDirection: 'row',
                            flexGap: 4,
                            alignItems: 'center',
                        }}
                    >
                        <IconWidget
                            icon={iconChar('flame-outline')}
                            size={12}
                            font="Ionicons"
                            style={{ color: '#FBBC05' }}
                        />
                        <TextWidget
                            text={streak}
                            style={{
                                fontSize: 10,
                                color: '#5E636A',
                            }}
                        />
                    </FlexWidget>
                </FlexWidget>
            </FlexWidget>
            <FlexWidget
                style={{
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: done ? '#34A853' : '#FFFFFF',
                }}
                clickAction="TOGGLE_HABIT"
                clickActionData={{ id: habitId }}
                accessibilityLabel="Toggle habit"
            >
                <IconWidget
                    icon={iconChar('checkmark-outline')}
                    size={14}
                    font="Ionicons"
                    style={{ color: done ? '#FFFFFF' : '#5E636A' }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}
