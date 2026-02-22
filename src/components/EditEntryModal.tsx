import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { LogEntry, updateEntry, getPersonalRecord } from '../db/logEntries';
import { getExerciseById } from '../db/exercises';
import { getExerciseColor, getExerciseEmoji } from '../constants/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useStore } from '../store/useStore';

export interface EditEntryModalRef {
  open: (entry: LogEntry) => void;
}

interface Props {
  onSaved: () => void;
}

export const EditEntryModal = forwardRef<EditEntryModalRef, Props>(
  ({ onSaved }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [entry, setEntry] = useState<LogEntry | null>(null);
    const [exerciseName, setExerciseName] = useState('');
    const [category, setCategory] = useState('Other');
    const [weight, setWeight] = useState('');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [pr, setPr] = useState<{ weight: number; unit: string } | null>(null);
    const { unit, toggleUnit } = useStore();

    useImperativeHandle(ref, () => ({
      async open(e: LogEntry) {
        setEntry(e);
        setWeight(String(e.weight));
        setNote(e.note ?? '');
        setSaving(false);

        // Load exercise info
        const ex = await getExerciseById(e.exerciseId);
        if (ex) {
          setExerciseName(ex.name);
          setCategory(ex.category);
        }

        // Load PR
        const record = await getPersonalRecord(e.exerciseId);
        setPr(record);

        sheetRef.current?.present();
      },
    }));

    const handleSave = useCallback(async () => {
      if (!entry) return;
      const parsed = parseFloat(weight);
      if (isNaN(parsed) || parsed <= 0) {
        Alert.alert('Invalid weight', 'Please enter a valid weight.');
        return;
      }
      setSaving(true);
      try {
        await updateEntry(entry.id, parsed, unit, note.trim() || undefined);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSaved();
        sheetRef.current?.dismiss();
        Keyboard.dismiss();
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'Could not save changes');
      } finally {
        setSaving(false);
      }
    }, [entry, weight, unit, note, onSaved]);

    const color = getExerciseColor(category);
    const emoji = getExerciseEmoji(category);
    const weightNum = parseFloat(weight);
    const isNewPR = pr && !isNaN(weightNum) && weightNum > pr.weight;
    const canSave = !isNaN(weightNum) && weightNum > 0 && !saving;

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={['60%']}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
        keyboardBehavior="extend"
      >
        <BottomSheetView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.thumb, { backgroundColor: color + '33' }]}>
              <Text style={styles.thumbEmoji}>{emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{exerciseName}</Text>
              {pr && (
                <Text style={styles.prLabel}>
                  PR: {pr.weight} {pr.unit}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={toggleUnit} style={styles.unitToggle}>
              <Text style={styles.unitText}>{unit}</Text>
            </TouchableOpacity>
          </View>

          {/* PR badge if new record */}
          {isNewPR && (
            <View style={styles.prBanner}>
              <Text style={styles.prBannerText}>🏆 New Personal Record!</Text>
            </View>
          )}

          {/* Weight input */}
          <TextInput
            style={styles.weightInput}
            value={weight}
            onChangeText={setWeight}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            autoFocus
            returnKeyType="next"
          />
          <Text style={styles.unitDisplay}>{unit}</Text>

          {/* Note input */}
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)"
            placeholderTextColor={colors.textMuted}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: color }, !canSave && styles.disabled]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : isNewPR ? '🏆 Save New PR' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.surface },
  handle: { backgroundColor: colors.border },
  content: { flex: 1, padding: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: { fontSize: 24 },
  exerciseName: { ...typography.h3 },
  prLabel: { ...typography.caption, color: colors.primary, marginTop: 2 },
  unitToggle: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitText: { ...typography.bodyMed, color: colors.text },
  prBanner: {
    backgroundColor: '#FFD70022',
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  prBannerText: { ...typography.bodyMed, color: '#FFD700' },
  weightInput: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  unitDisplay: {
    ...typography.h3,
    color: colors.textSub,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  noteInput: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  saveButton: {
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  disabled: { opacity: 0.4 },
  saveButtonText: { ...typography.bodyMed, color: colors.white },
});
