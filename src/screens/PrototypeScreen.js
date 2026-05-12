import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const TITLES = {
  promo: 'Promo Codes',
  product: 'Product Detail + Checkout',
};

function loadHtml(prototype) {
  if (prototype === 'promo') {
    return require('../prototypes/promoCodes.html.js').default;
  }
  return require('../prototypes/productDetail.html.js').default;
}

export default function PrototypeScreen({ prototype, onBack }) {
  const [loading, setLoading] = useState(true);
  const html = useMemo(() => loadHtml(prototype), [prototype]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        >
          <Text style={styles.backLabel}>‹ Back</Text>
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {TITLES[prototype] ?? 'Prototype'}
        </Text>
        <View style={styles.backBtn} />
      </View>
      <View style={styles.webWrap}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          mixedContentMode="always"
          onLoadEnd={() => setLoading(false)}
          style={styles.webview}
          containerStyle={styles.webview}
          androidLayerType="hardware"
        />
        {loading ? (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1116',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F2A36',
  },
  backBtn: {
    minWidth: 72,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  backBtnPressed: {
    backgroundColor: '#1A2129',
  },
  backLabel: {
    color: '#7FB3FF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  webWrap: {
    flex: 1,
    backgroundColor: '#0E1116',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0E1116',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E1116',
  },
});
