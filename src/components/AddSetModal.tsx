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
import { addEntry, getLastUsedWeight } from '../db/logEntries';
import { ExercisePicker } from './ExercisePicker';
import { Exercise } from '../db/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useStore } from '../store/useStore';

export interface AddSetModalRef {
  open: (dateStr: string, preselectedExerciseId?: string) => void;
}

interface Props {
  onSaved: () => void;
}

type Step = 'pick' | 'weight';

export const AddSetModal = forwardRef<AddSetModalRef, Props>(
  ({ onSaved }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [step, setStep] = useState<Step>('pick');
    const [dateStr, setDateStr] = useState('');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [weight, setWeight] = useState('');
    const [lastUsed, setLastUsed] = useState<{ weight: number; unit: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const { unit, toggleUnit } = useStore();

    useImperativeHandle(ref, () => ({
      open(date, _preselectedId) {
        setDateStr(date);
        setStep('pick');
        setWeight('');
        setLastUsed(null);
        setSelectedExercise(null);
        setSaving(false);
        sheetRef.current?.present();
      },
    }));

    const handleSelectExercise = useCallback(async (ex: Exercise) => {
      setSelectedExercise(ex);
      try {
        const lu = await getLastUsedWeight(ex.id);
        setLastUsed(lu);
        if (lu) setWeight(String(lu.weight));
      } catch (e) {
        console.log('getLastUsedWeight error:', e);
      }
      setStep('weight');
    }, []);

    const handleSave = useCallback(async () => {
      console.log('handleSave called', { selectedExercise: selectedExercise?.id, weight, dateStr, unit });

      if (!selectedExercise) {
        Alert.alert('Error', 'No exercise selected');
        return;
      }
      if (!weight) {
        Alert.alert('Error', 'Please enter a weight');
        return;
      }

      const parsed = parseFloat(weight);
      if (isNaN(parsed) || parsed <= 0) {
        Alert.alert('Error', `Invalid weight: "${weight}"`);
        return;
      }

      if (!dateStr) {
        Alert.alert('Error', 'No date set');
        return;
      }

      setSaving(true);
      try {
        const now = new Date();
        const parts = dateStr.split('-');
        const year  = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day   = parseInt(parts[2], 10);
        const dateTime = new Date(year, month, day, now.getHours(), now.getMinutes(), now.getSeconds()).getTime();

        console.log('Saving entry:', { dateTime, exerciseId: selectedExercise.id, weight: parsed, unit });

        const saved = await addEntry({
          dateTime,
          exerciseId: selectedExercise.id,
          weight: parsed,
          unit,
        });

        console.log('Entry saved successfully:', saved.id);

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSaved();
        sheetRef.current?.dismiss();
        Keyboard.dismiss();
      } catch (e: any) {
        console.log('Save error:', e);
        Alert.alert('Save failed', e?.message ?? String(e));
      } finally {
        setSaving(false);
      }
    }, [selectedExercise, weight, dateStr, unit, onSaved]);

    const snapPoints = step === 'pick' ? ['85%'] : ['55%'];
    const weightNum = parseFloat(weight);
    const canSave = !!selectedExercise && !!weight && !isNaN(weightNum) && weightNum > 0 && !saving;

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        )}
        keyboardBehavior="extend"
      >
        <BottomSheetView style={styles.content}>
          {step === 'pick' ? (
            <>
              <Text style={styles.sheetTitle}>Choose Exercise</Text>
              <ExercisePicker onSelect={handleSelectExercise} />
            </>
          ) : (
            <>
              <View style={styles.weightHeader}>
                <TouchableOpacity
                  onPress={() => setStep('pick')}
                  style={styles.backBtn}
                >
                  <Text style={styles.backText}>← {selectedExercise?.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleUnit} style={styles.unitToggle}>
                  <Text style={styles.unitText}>{unit}</Text>
                </TouchableOpacity>
              </View>

              {lastUsed && (
                <Text style={styles.lastUsedHint}>
                  Last used: {lastUsed.weight} {lastUsed.unit}
                </Text>
              )}

              <TextInput
                style={styles.weightInput}
                value={weight}
                onChangeText={(v) => {
                  console.log('weight input changed:', v);
                  setWeight(v);
                }}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
              <Text style={styles.unitDisplay}>{unit}</Text>

              <TouchableOpacity
                style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!canSave}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? 'Saving...' : 'Save Set'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.surface },
  handle: { backgroundColor: colors.border },
  content: { flex: 1, padding: spacing.md },
  sheetTitle: { ...typography.h2, marginBottom: spacing.md },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  backText: { ...typography.body, color: colors.primary },
  unitToggle: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitText: { ...typography.bodyMed, color: colors.text },
  lastUsedHint: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  weightInput: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  unitDisplay: {
    ...typography.h3,
    color: colors.textSub,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: { ...typography.bodyMed, color: colors.white },
});
