// Web Audio API ambient synthesizer for Macarena Mantilla's music player

let audioCtx: AudioContext | null = null;
let currentOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
let isPlayingSynth = false;
let synthInterval: any = null;

export function playAmbientSynth() {
  if (isPlayingSynth) return;
  
  try {
    // Lazy initialize AudioContext on user interaction
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    
    isPlayingSynth = true;
    
    // Play a sequence of dreamy pastel chords
    // Cmaj7 (C4, E4, G4, B4) -> Am7 (A3, C4, E4, G4) -> Fmaj7 (F3, A3, C4, E4)
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (Warm Peach)
      [220.00, 261.63, 329.63, 392.00], // Am7 (Atmospheric Baby Teal)
      [174.61, 220.00, 261.63, 329.63]  // Fmaj7 (Lavender Grey)
    ];
    
    let chordIndex = 0;
    
    const playChord = () => {
      if (!audioCtx || audioCtx.state === "suspended") return;
      
      // Stop previous notes gracefully
      stopAmbientSynthNotes();
      
      const freqs = chords[chordIndex];
      const now = audioCtx.currentTime;
      
      freqs.forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filterNode = audioCtx.createBiquadFilter();
        
        // Sine wave for ultra-soft, pure woodwind/vocals tone
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);
        
        // Soft lowpass filter to make it sound vintage and warm
        filterNode.type = "lowpass";
        filterNode.frequency.setValueAtTime(800, now);
        
        // Slow attack and long release
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.06, now + 1.5); // very soft
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
        
        osc.connect(filterNode);
        filterNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 5.0);
        
        currentOscillators.push({ osc, gain: gainNode });
      });
      
      chordIndex = (chordIndex + 1) % chords.length;
    };
    
    // Initial trigger
    playChord();
    
    // Repeat chord progression every 5 seconds
    synthInterval = setInterval(playChord, 5000);
    
  } catch (error) {
    console.error("Failed to initialize Web Audio synth:", error);
  }
}

export function stopAmbientSynth() {
  isPlayingSynth = false;
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
  stopAmbientSynthNotes();
}

function stopAmbientSynthNotes() {
  if (currentOscillators.length > 0) {
    currentOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(0);
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    currentOscillators = [];
  }
}
