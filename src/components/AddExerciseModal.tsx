import React, {
  forwardRef, useImperativeHandle, useRef, useState, useCallback,
} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert,
} from 'react-native';
import {
  BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import { addEntry, getLastUsedWeight } from '../db/logEntries';
import { createExercise } from '../db/exercises';
import { ExercisePicker } from './ExercisePicker';
import { Exercise } from '../db/exercises';
import { colors, spacing, typography, radius } from '../constants/theme';
import { useStore } from '../store/useStore';
import { ExerciseCategory, getExerciseColor, getExerciseEmoji } from '../constants/exercises';

export interface AddExerciseModalRef {
  open: (dateStr: string, preselectedExerciseId?: string) => void;
}

interface Props {
  onSaved: () => void;
}

type Step = 'pick' | 'weight' | 'create';

const CATEGORIES: ExerciseCategory[] = ['Push', 'Pull', 'Legs', 'Core', 'Pilates', 'Other'];

export const AddExerciseModal = forwardRef<AddExerciseModalRef, Props>(
  ({ onSaved }, ref) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [step, setStep] = useState<Step>('pick');
    const [dateStr, setDateStr] = useState('');
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [weight, setWeight] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');
    const [lastUsed, setLastUsed] = useState<{ weight: number; unit: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState<ExerciseCategory>('Push');
    const { unit, toggleUnit, bumpExercisesVersion } = useStore();

    const isPilates = selectedExercise?.category === 'Pilates';

    useImperativeHandle(ref, () => ({
      open(date, _preselectedId) {
        setDateStr(date);
        setStep('pick');
        setWeight('');
        setYoutubeLink('');
        setLastUsed(null);
        setSelectedExercise(null);
        setSaving(false);
        setNewName('');
        setNewCategory('Push');
        sheetRef.current?.present();
      },
    }));

    const handleSelectExercise = useCallback(async (ex: Exercise) => {
      setSelectedExercise(ex);
      if (ex.category !== 'Pilates') {
        try {
          const lu = await getLastUsedWeight(ex.id);
          setLastUsed(lu);
          if (lu) setWeight(String(lu.weight));
        } catch (e) {}
      }
      setStep('weight');
    }, []);

    const handleCreateExercise = useCallback(async () => {
      if (!newName.trim()) { Alert.alert('Error', 'Please enter an exercise name'); return; }
      setSaving(true);
      try {
        const id = newName.trim().toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
        await createExercise({ id, name: newName.trim(), category: newCategory, imageKey: newCategory.toLowerCase() });
        bumpExercisesVersion();
        const created: Exercise = { id, name: newName.trim(), category: newCategory, imageKey: newCategory.toLowerCase(), isFavorite: false };
        setSelectedExercise(created);
        setLastUsed(null);
        setWeight('');
        setStep('weight');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (e: any) {
        Alert.alert('Error', e?.message ?? 'Could not create exercise');
      } finally {
        setSaving(false);
      }
    }, [newName, newCategory, bumpExercisesVersion]);

    const handleSave = useCallback(async () => {
      if (!selectedExercise) return;

      if (isPilates) {
        // Pilates: save with weight=0 and youtube link as note
        setSaving(true);
        try {
          const now = new Date();
          const parts = dateStr.split('-');
          const dateTime = new Date(
            parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10),
            now.getHours(), now.getMinutes(), now.getSeconds()
          ).getTime();
          await addEntry({ dateTime, exerciseId: selectedExercise.id, weight: 0, unit, note: youtubeLink.trim() || undefined });
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          onSaved();
          sheetRef.current?.dismiss();
          Keyboard.dismiss();
        } catch (e: any) {
          Alert.alert('Save failed', e?.message ?? String(e));
        } finally {
          setSaving(false);
        }
        return;
      }

      const parsed = parseFloat(weight);
      if (isNaN(parsed) || parsed <= 0) { Alert.alert('Error', 'Please enter a valid weight'); return; }

      setSaving(true);
      try {
        const now = new Date();
        const parts = dateStr.split('-');
        const dateTime = new Date(
          parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10),
          now.getHours(), now.getMinutes(), now.getSeconds()
        ).getTime();
        await addEntry({ dateTime, exerciseId: selectedExercise.id, weight: parsed, unit });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onSaved();
        sheetRef.current?.dismiss();
        Keyboard.dismiss();
      } catch (e: any) {
        Alert.alert('Save failed', e?.message ?? String(e));
      } finally {
        setSaving(false);
      }
    }, [selectedExercise, weight, youtubeLink, dateStr, unit, onSaved, isPilates]);

    const snapPoints = step === 'weight' ? ['60%'] : ['85%'];
    const weightNum = parseFloat(weight);
    const canSave = isPilates ? !saving : (!isNaN(weightNum) && weightNum > 0 && !saving);

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheetBg}
        handleIndicatorStyle={styles.handle}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
        )}
        keyboardBehavior="extend"
      >
        {step === 'pick' && (
          <BottomSheetView style={styles.content}>
            <View style={styles.pickHeader}>
              <Text style={styles.sheetTitle}>Choose Exercise</Text>
              <TouchableOpacity style={styles.createBtn} onPress={() => setStep('create')}>
                <Text style={styles.createBtnText}>+ New</Text>
              </TouchableOpacity>
            </View>
            <ExercisePicker onSelect={handleSelectExercise} />
          </BottomSheetView>
        )}

        {step === 'create' && (
          <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.backRow}>
              <TouchableOpacity onPress={() => setStep('pick')} style={styles.backBtn}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetTitle}>New Exercise</Text>
            <Text style={styles.fieldLabel}>NAME</Text>
            <TextInput
              style={styles.textInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. Bulgarian Split Squat"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />
            <Text style={styles.fieldLabel}>CATEGORY</Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => {
                const active = newCategory === cat;
                const color = getExerciseColor(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, active && { backgroundColor: color, borderColor: color }]}
                    onPress={() => setNewCategory(cat)}
                  >
                    <Text style={styles.catChipEmoji}>{getExerciseEmoji(cat)}</Text>
                    <Text style={[styles.catChipText, active && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleCreateExercise}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>{saving ? 'Creating...' : 'Create & Log'}</Text>
            </TouchableOpacity>
          </BottomSheetScrollView>
        )}

        {step === 'weight' && (
          <BottomSheetView style={styles.content}>
            <View style={styles.weightHeader}>
              <TouchableOpacity onPress={() => setStep('pick')} style={styles.backBtn}>
                <Text style={styles.backText}>← {selectedExercise?.name}</Text>
              </TouchableOpacity>
              {!isPilates && (
                <TouchableOpacity onPress={toggleUnit} style={styles.unitToggle}>
                  <Text style={styles.unitText}>{unit}</Text>
                </TouchableOpacity>
              )}
            </View>

            {isPilates ? (
              <>
                <Text style={styles.pilatesEmoji}>🧘</Text>
                <Text style={styles.pilatesLabel}>Pilates Session</Text>
                <TextInput
                  style={styles.textInput}
                  value={youtubeLink}
                  onChangeText={setYoutubeLink}
                  placeholder="YouTube link (optional)"
                  placeholderTextColor={colors.textMuted}
                  autoFocus
                  keyboardType="url"
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                  autoCapitalize="none"
                />
              </>
            ) : (
              <>
                {lastUsed && (
                  <Text style={styles.lastUsedHint}>Last used: {lastUsed.weight} {lastUsed.unit}</Text>
                )}
                <TextInput
                  style={styles.weightInput}
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
                <Text style={styles.unitDisplay}>{unit}</Text>
              </>
            )}

            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : isPilates ? 'Log Pilates Session' : 'Save Exercise'}
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        )}
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.surface },
  handle: { backgroundColor: colors.border },
  content: { flex: 1, padding: spacing.md },
  pickHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sheetTitle: { ...typography.h2 },
  createBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  createBtnText: { ...typography.bodyMed, color: colors.white },
  backRow: { marginBottom: spacing.sm },
  backBtn: { padding: spacing.xs },
  backText: { ...typography.body, color: colors.primary },
  weightHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  unitToggle: { backgroundColor: colors.surfaceAlt, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderWidth: 1, borderColor: colors.border },
  unitText: { ...typography.bodyMed, color: colors.text },
  lastUsedHint: { ...typography.caption, color: colors.primary, marginBottom: spacing.sm },
  weightInput: { fontSize: 72, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xs },
  unitDisplay: { ...typography.h3, color: colors.textSub, textAlign: 'center', marginBottom: spacing.lg },
  pilatesEmoji: { fontSize: 64, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xs },
  pilatesLabel: { ...typography.h3, textAlign: 'center', color: '#E91E8C', marginBottom: spacing.lg },
  fieldLabel: { ...typography.label, color: colors.primary, marginBottom: spacing.xs, marginTop: spacing.md },
  textInput: { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.md, ...typography.body, color: colors.text, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.lg },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceAlt },
  catChipEmoji: { fontSize: 14 },
  catChipText: { ...typography.label, color: colors.textSub },
  catChipTextActive: { color: colors.white },
  saveButton: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...typography.bodyMed, color: colors.white },
});
