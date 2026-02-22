import React, { useRef, useMemo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { LogEntry } from '../db/logEntries';
import { EntryRow } from './EntryRow';
import { EmptyState } from './EmptyState';
import { EditEntryModal, EditEntryModalRef } from './EditEntryModal';
import { colors } from '../constants/theme';

interface Props {
  entries: LogEntry[];
  loading: boolean;
  onEntryAdded?: () => void;
}

export function EntryList({ entries, loading, onEntryAdded }: Props) {
  const editModalRef = useRef<EditEntryModalRef>(null);

  // Count how many sets per exercise for the set counter badge
  const setCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of entries) {
      map[e.exerciseId] = (map[e.exerciseId] ?? 0) + 1;
    }
    return map;
  }, [entries]);

  if (!loading && entries.length === 0) {
    return <EmptyState message={'No exercises logged yet.\nTap + Add Exercise to get started.'} />;
  }

  return (
    <>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EntryRow
            entry={item}
            setCount={setCountMap[item.exerciseId]}
            onDuplicated={onEntryAdded}
            onDeleted={onEntryAdded}
            onEdit={(entry) => editModalRef.current?.open(entry)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <EditEntryModal
        ref={editModalRef}
        onSaved={onEntryAdded ?? (() => {})}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 120 },
  separator: { height: 1, backgroundColor: colors.border },
});
