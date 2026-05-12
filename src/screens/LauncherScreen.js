import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PROTOTYPES = [
  {
    key: 'promo',
    title: 'Promo Codes',
    subtitle: 'Product Detail → Add Promo Code',
  },
  {
    key: 'product',
    title: 'Product Detail + Checkout',
    subtitle: 'Progressive checkout flow',
  },
];

export default function LauncherScreen({ onOpen }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PROMO CODES</Text>
        <Text style={styles.title}>Prototype preview</Text>
        <Text style={styles.helper}>Pick a flow to open it in a WebView.</Text>
      </View>
      <View style={styles.list}>
        {PROTOTYPES.map((p) => (
          <Pressable
            key={p.key}
            onPress={() => onOpen(p.key)}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            android_ripple={{ color: '#1F2A36' }}
          >
            <View>
              <Text style={styles.cardTitle}>{p.title}</Text>
              <Text style={styles.cardSubtitle}>{p.subtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1116',
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  eyebrow: {
    color: '#5C6B7D',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },
  helper: {
    color: '#8593A4',
    fontSize: 14,
    marginTop: 8,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#161B22',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1F2A36',
  },
  cardPressed: {
    backgroundColor: '#1A2129',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  cardSubtitle: {
    color: '#8593A4',
    fontSize: 13,
    marginTop: 4,
  },
  chevron: {
    color: '#5C6B7D',
    fontSize: 28,
    lineHeight: 28,
  },
});
