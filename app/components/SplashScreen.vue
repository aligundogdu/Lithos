<template>
  <Transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-stone-950">
      <!-- Splash Image -->
      <div class="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
        <img 
          :src="randomSplashImage" 
          alt="Lithos" 
          class="max-w-full max-h-full object-contain rounded-2xl shadow-2xl shadow-black/50"
        />
        
        <!-- Overlay Gradient -->
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950/80 pointer-events-none"></div>
      </div>
      
      <!-- Loading Bar -->
      <div class="absolute bottom-12 sm:bottom-20 left-1/2 -translate-x-1/2 w-64 sm:w-80 md:w-96 px-4">
        <div class="text-center mb-4">
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-400 mb-2">Lithos</h2>
          <p class="text-xs sm:text-sm text-stone-400">Antik Heykel Atölyesi</p>
        </div>
        
        <!-- Progress Bar -->
        <div class="relative h-2 bg-stone-800 rounded-full overflow-hidden shadow-lg">
          <div 
            class="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-300 ease-out shadow-amber-500/50 shadow-lg"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
        
        <p class="text-xs text-stone-500 text-center mt-2">Yükleniyor... {{ progress }}%</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const isVisible = ref(true);
const progress = ref(0);

const emit = defineEmits<{
  complete: []
}>();

const TOTAL_IMAGES = 23;
const STORAGE_KEY = 'lithos_splash_shown';

// Select next unseen splash image
const randomSplashImage = computed(() => {
  // Get shown images from localStorage
  const shownStr = localStorage.getItem(STORAGE_KEY);
  const shown: number[] = shownStr ? JSON.parse(shownStr) : [];
  
  // If all images have been shown, reset
  if (shown.length >= TOTAL_IMAGES) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    shown.length = 0;
  }
  
  // Get list of unseen images
  const allImages = Array.from({ length: TOTAL_IMAGES }, (_, i) => i + 1);
  const unseenImages = allImages.filter(num => !shown.includes(num));
  
  // Pick random from unseen (fallback to 1 if somehow empty)
  const selectedImage = unseenImages.length > 0 
    ? unseenImages[Math.floor(Math.random() * unseenImages.length)]
    : 1;
  
  // Mark as shown
  shown.push(selectedImage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shown));
  
  return `/images/splash/${selectedImage}.webp`;
});

onMounted(() => {
  // Simulate loading progress
  const interval = setInterval(() => {
    progress.value += Math.random() * 15 + 5; // Random increment between 5-20
    
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(interval);
      
      // Wait a bit then fade out
      setTimeout(() => {
        isVisible.value = false;
        
        // Emit complete after fade animation
        setTimeout(() => {
          emit('complete');
        }, 500);
      }, 500);
    }
  }, 200); // Update every 200ms
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
