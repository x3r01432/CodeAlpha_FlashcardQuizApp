import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'flashcards_v1';
const STARTER = [
  { id: '1', question: 'What is the capital of France?', answer: 'Paris' },
  { id: '2', question: 'What does CPU stand for?', answer: 'Central Processing Unit' },
  { id: '3', question: '2 + 2 × 3 = ?', answer: '8' },
];

function Btn({ title, onPress, kind = 'primary', disabled }) {
  return (
    <Pressable onPress={onPress} disabled={disabled}
      style={[s.btn, s[kind], disabled && s.disabled]}>
      <Text style={[s.btnText, kind === 'ghost' && { color: '#4F46E5' }]}>{title}</Text>
    </Pressable>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [screen, setScreen] = useState('quiz'); // quiz | manage | form
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState('');
  const [a, setA] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(v => {
      setCards(v ? JSON.parse(v) : STARTER);
      setLoaded(true);
    });
  }, []);
  useEffect(() => { if (loaded) AsyncStorage.setItem(KEY, JSON.stringify(cards)); }, [cards, loaded]);
  useEffect(() => { if (index > cards.length - 1) setIndex(Math.max(0, cards.length - 1)); }, [cards]);

  const go = d => { setIndex(i => i + d); setShowAnswer(false); };
  const openForm = card => { setEditing(card); setQ(card?.question ?? ''); setA(card?.answer ?? ''); setScreen('form'); };
  const save = () => {
    if (!q.trim() || !a.trim()) return Alert.alert('Missing info', 'Please fill in both the question and the answer.');
    if (editing) setCards(cs => cs.map(c => c.id === editing.id ? { ...c, question: q.trim(), answer: a.trim() } : c));
    else setCards(cs => [...cs, { id: Date.now().toString(), question: q.trim(), answer: a.trim() }]);
    setScreen('manage');
  };
  const remove = card => Alert.alert('Delete card?', card.question, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => setCards(cs => cs.filter(c => c.id !== card.id)) },
  ]);

  if (!loaded) return null;
  const card = cards[index];

  return (
    <SafeAreaView style={s.root}>
      <StatusBar barStyle="dark-content" />
      <Text style={s.title}>Flashcard Quiz</Text>

      {screen === 'quiz' && (
        <View style={s.body}>
          {card ? (
            <>
              <Text style={s.counter}>Card {index + 1} of {cards.length}</Text>
              <View style={s.card}>
                <Text style={s.label}>{showAnswer ? 'ANSWER' : 'QUESTION'}</Text>
                <Text style={s.cardText}>{showAnswer ? card.answer : card.question}</Text>
              </View>
              <Btn title={showAnswer ? 'Hide Answer' : 'Show Answer'} onPress={() => setShowAnswer(v => !v)} />
              <View style={s.row}>
                <Btn title="‹ Previous" kind="ghost" disabled={index === 0} onPress={() => go(-1)} />
                <Btn title="Next ›" kind="ghost" disabled={index === cards.length - 1} onPress={() => go(1)} />
              </View>
            </>
          ) : <Text style={s.empty}>No cards yet. Add your first one!</Text>}
          <Btn title="Manage Cards" kind="secondary" onPress={() => setScreen('manage')} />
        </View>
      )}

      {screen === 'manage' && (
        <View style={s.body}>
          <FlatList data={cards} keyExtractor={c => c.id} style={{ alignSelf: 'stretch' }}
            ListEmptyComponent={<Text style={s.empty}>No cards yet.</Text>}
            renderItem={({ item }) => (
              <View style={s.item}>
                <Text style={s.itemText} numberOfLines={2}>{item.question}</Text>
                <Pressable onPress={() => openForm(item)}><Text style={s.link}>Edit</Text></Pressable>
                <Pressable onPress={() => remove(item)}><Text style={[s.link, { color: '#DC2626' }]}>Delete</Text></Pressable>
              </View>
            )} />
          <Btn title="+ Add Card" onPress={() => openForm(null)} />
          <Btn title="Back to Quiz" kind="secondary" onPress={() => { setScreen('quiz'); setShowAnswer(false); }} />
        </View>
      )}

      {screen === 'form' && (
        <View style={s.body}>
          <Text style={s.label}>{editing ? 'EDIT CARD' : 'NEW CARD'}</Text>
          <TextInput style={s.input} placeholder="Question" value={q} onChangeText={setQ} multiline />
          <TextInput style={s.input} placeholder="Answer" value={a} onChangeText={setA} multiline />
          <Btn title="Save" onPress={save} />
          <Btn title="Cancel" kind="secondary" onPress={() => setScreen('manage')} />
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FB', paddingTop: 40 },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: '#1F2937', marginBottom: 12 },
  body: { flex: 1, padding: 20, alignItems: 'center', gap: 12 },
  counter: { color: '#6B7280' },
  card: { alignSelf: 'stretch', minHeight: 220, backgroundColor: '#fff', borderRadius: 16, padding: 24, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  label: { fontSize: 12, letterSpacing: 1.5, color: '#4F46E5', fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  cardText: { fontSize: 22, textAlign: 'center', color: '#111827' },
  row: { flexDirection: 'row', gap: 12 },
  btn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, minWidth: 140, alignItems: 'center' },
  primary: { backgroundColor: '#4F46E5', alignSelf: 'stretch' },
  secondary: { backgroundColor: '#9CA3AF', alignSelf: 'stretch' },
  ghost: { backgroundColor: '#EEF2FF' },
  disabled: { opacity: 0.4 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  empty: { color: '#6B7280', marginVertical: 30, textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 8, gap: 12 },
  itemText: { flex: 1, color: '#111827' },
  link: { color: '#4F46E5', fontWeight: '600' },
  input: { alignSelf: 'stretch', backgroundColor: '#fff', borderRadius: 10, padding: 14, fontSize: 16, minHeight: 60, borderWidth: 1, borderColor: '#E5E7EB' },
});
