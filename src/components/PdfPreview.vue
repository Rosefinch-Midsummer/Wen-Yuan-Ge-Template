<script setup lang="ts">
import { VuePDFjs } from "@tuttarealstep/vue-pdf.js";
import "@tuttarealstep/vue-pdf.js/dist/style.css";

defineProps<{
  fileUrl: string;
  fileName: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void
}>();
</script>

<template>
  <div class="pdf-preview-container">
    <div class="pdf-header">
      <button @click="emit('close')" class="back-btn">
        <i class="fas fa-arrow-left"></i> Back to Files
      </button>
      <span class="file-name">{{ fileName }}</span>
    </div>
    <div class="pdf-content">
      <VuePDFjs :source="fileUrl" />
    </div>
  </div>
</template>

<style scoped>
.pdf-preview-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #2c2c2c;
  color: white;
}

.pdf-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
}

.back-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.back-btn:hover {
  background-color: #333;
}

.file-name {
  margin-left: 1rem;
  font-weight: bold;
}

.pdf-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}
</style>
