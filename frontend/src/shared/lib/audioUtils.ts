// export function createAudioContext(): AudioContext {
//     return new (window.AudioContext || window.webkitAudioContext)();
//   }
  
//   export function playBeep(frequency = 1000, duration = 0.05, volume = 0.5) {
//     const ctx = createAudioContext();
//     const oscillator = ctx.createOscillator();
//     const gainNode = ctx.createGain();
  
//     oscillator.type = "square";
//     oscillator.frequency.value = frequency;
//     gainNode.gain.value = volume;
  
//     oscillator.connect(gainNode);
//     gainNode.connect(ctx.destination);
  
//     oscillator.start();
//     oscillator.stop(ctx.currentTime + duration);
//   }
  