import { Transaction } from '@prisma/client'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register a better Turkish font support
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#F3F4F6',
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F3F4F6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  green: { color: '#22C55E' },
  red: { color: '#EF4444' },
})

interface TransactionPDFProps {
  transactions: Transaction[]
}

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ₺`;
};

export function TransactionPDF({ transactions }: TransactionPDFProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>İşlem Raporu</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Tarih</Text>
            <Text style={styles.tableCell}>Tip</Text>
            <Text style={styles.tableCell}>Kategori</Text>
            <Text style={styles.tableCell}>Açıklama</Text>
            <Text style={[styles.tableCell, { textAlign: 'right' }]}>Tutar</Text>
          </View>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>
                {new Date(transaction.date).toLocaleDateString('tr-TR')}
              </Text>
              <Text style={styles.tableCell}>
                {transaction.type === 'INCOME' ? 'Gelir' : 'Gider'}
              </Text>
              <Text style={styles.tableCell}>{transaction.category}</Text>
              <Text style={styles.tableCell}>{transaction.description}</Text>
              <Text style={[styles.tableCell, { textAlign: 'right' }]}>
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Toplam Gelir:</Text>
            <Text style={styles.green}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Toplam Gider:</Text>
            <Text style={styles.red}>
              {formatCurrency(totalExpense)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Net Durum:</Text>
            <Text style={totalIncome - totalExpense >= 0 ? styles.green : styles.red}>
              {formatCurrency(totalIncome - totalExpense)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
} 