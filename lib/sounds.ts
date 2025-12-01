import { Audio } from 'expo-av';

let completeSound: Audio.Sound | null = null;
let allDoneSound: Audio.Sound | null = null;
let soundsLoaded = false;

async function loadSoundsIfNeeded() {
  if (soundsLoaded) return;
  try {
    // Please add these two files to `assets/sounds/`:
    // - complete.mp3 (short chime)
    // - all_done.mp3 (celebratory sound)
    const complete = await Audio.Sound.createAsync(require('../assets/sounds/complete.mp3'));
    completeSound = complete.sound;

    const allDone = await Audio.Sound.createAsync(require('../assets/sounds/all_done.mp3'));
    allDoneSound = allDone.sound;

    soundsLoaded = true;
  } catch (e) {
    console.warn('[sounds] failed to load sounds', e);
  }
}

export async function playCompleteSound() {
  try {
    await loadSoundsIfNeeded();
    if (!completeSound) return;
    // replay so position is reset
    await completeSound.replayAsync();
  } catch (e) {
    console.warn('[sounds] playCompleteSound error', e);
  }
}

export async function playAllDoneSound() {
  try {
    await loadSoundsIfNeeded();
    if (!allDoneSound) return;
    await allDoneSound.replayAsync();
  } catch (e) {
    console.warn('[sounds] playAllDoneSound error', e);
  }
}

export async function unloadSounds() {
  try {
    if (completeSound) {
      await completeSound.unloadAsync();
      completeSound = null;
    }
    if (allDoneSound) {
      await allDoneSound.unloadAsync();
      allDoneSound = null;
    }
    soundsLoaded = false;
  } catch (e) {
    console.warn('[sounds] unload error', e);
  }
}
