import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';



export default function EmojiMenuScreen() {
  const router = useRouter();
  const { returnTo, returnId, current } = useLocalSearchParams<{
    returnTo?: string;
    returnId?: string;
    current?: string;
  }>();
  const [query, setQuery] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(
    typeof current === 'string' && current.length ? current : null,
  );

  const emojiIcons = useMemo(
    () => Object.keys(Ionicons.glyphMap).filter((name) => name.endsWith('-outline')),
    [],
  );

  const filteredEmojis = useMemo(() => {
    if (!query.trim()) {
      return emojiIcons;
    }
    const lower = query.trim().toLowerCase();
    return emojiIcons.filter((item) => item.toLowerCase().includes(lower));
  }, [emojiIcons, query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Link href="/" asChild>
          <Ionicons name="close-outline" size={32} color="#1F1F1F" />
        </Link>
        <Pressable
          style={styles.doneButton}
          onPress={() => {
            if (returnTo && selectedIcon) {
              router.replace({
                pathname: returnTo,
                params: returnId
                  ? { id: returnId, emoji: selectedIcon }
                  : { emoji: selectedIcon },
              });
            } else {
              router.replace('/');
            }
          }}
        >
          <Ionicons name="checkmark-outline" size={22} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.habitIconWrap}>
          {selectedIcon ? (
            <Ionicons name={selectedIcon} size={44} color="#1F1F1F" />
          ) : (
            <Ionicons name="book-outline" size={44} color="#1F1F1F" />
          )}
        </View>

        <View style={styles.emojiContainer}>
          <View style={styles.searchBar}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search Emoji"
              placeholderTextColor="#5E636A"
              style={styles.searchInput}
            />
            <Ionicons name="search-outline" size={16} color="#5E636A" />
          </View>

          <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
            {filteredEmojis.map((emoji, index) => {
              const isSelected = selectedIcon === emoji;
              return (
                <Pressable
                  key={`${emoji}-${index}`}
                  style={[styles.emojiItem, isSelected && styles.emojiItemSelected]}
                  onPress={() => setSelectedIcon(emoji)}
                >
                  <Ionicons name={emoji} size={26} color="#1F1F1F" />
                </Pressable>
              );
            })}
            ))}
          </ScrollView>
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
  doneButton: {
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
    gap: 20,
    alignItems: 'center',
  },
  habitIconWrap: {
    backgroundColor: '#FBBC05',
    borderRadius: 16,
    padding: 10,
    borderWidth: 4,
    borderColor: 'rgba(94,99,106,0.1)',
  },
  emojiContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 10,
    color: '#5E636A',
  },
  gridContainer: {
    maxHeight: 520,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  emojiItem: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emojiItemSelected: {
    borderWidth: 2,
    borderColor: '#34A853',
  },
});
