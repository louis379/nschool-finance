import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Asset Overview */}
      <View style={styles.assetCard}>
        <Text style={styles.assetLabel}>總資產</Text>
        <Text style={styles.assetValue}>NT$ 1,250,000</Text>
        <Text style={styles.assetChange}>+NT$ 35,000 (+2.88%) 本月</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>快速操作</Text>
        <View style={styles.actionGrid}>
          {['記帳', 'OCR 掃描', '交易', '複利計算', '學習', '目標'].map((action) => (
            <View key={action} style={styles.actionItem}>
              <View style={styles.actionIcon} />
              <Text style={styles.actionLabel}>{action}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>最近交易</Text>
        {[
          { desc: '午餐 - 便當', amount: -120 },
          { desc: '3月份薪資', amount: 55000 },
          { desc: 'momo 購物', amount: -1290 },
        ].map((tx, i) => (
          <View key={i} style={styles.txRow}>
            <Text style={styles.txDesc}>{tx.desc}</Text>
            <Text style={[styles.txAmount, tx.amount >= 0 && styles.txPositive]}>
              {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F7FF' },
  content: { padding: 16 },
  assetCard: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  assetLabel: { color: '#D1C2FE', fontSize: 14 },
  assetValue: { color: '#FFF', fontSize: 28, fontWeight: '700', marginTop: 4 },
  assetChange: { color: '#A5D6A7', fontSize: 13, marginTop: 8 },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#343A40', marginBottom: 12 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionItem: { alignItems: 'center', width: '30%' },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6C5CE7',
    marginBottom: 6,
  },
  actionLabel: { fontSize: 11, color: '#495057' },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  txDesc: { fontSize: 14, color: '#343A40' },
  txAmount: { fontSize: 14, fontWeight: '600', color: '#343A40' },
  txPositive: { color: '#4CAF50' },
});
