<script setup lang="ts">
import { ref } from 'vue';
import FileExplorer from './components/FileExplorer.vue';
import PdfPreview from './components/PdfPreview.vue';

interface FileNode {
  name: string;
  type: 'directory' | 'file';
  path: string;
  size?: number;
  children?: FileNode[];
  extension?: string;
  lastModified?: string;
}

const currentView = ref<'explorer' | 'preview'>('explorer');
const currentFile = ref<FileNode | null>(null);

function handlePreview(file: FileNode) {
  if (file.extension === '.pdf') {
    currentFile.value = file;
    currentView.value = 'preview';
  } else {
    alert(`Cannot preview ${file.extension} files yet.`);
  }
}

function handleClose() {
  currentView.value = 'explorer';
  currentFile.value = null;
}
</script>

<template>
  <div id="app-container">
    <FileExplorer 
      v-if="currentView === 'explorer'" 
      @preview="handlePreview" 
    />
    <PdfPreview 
      v-else-if="currentView === 'preview' && currentFile" 
      :fileUrl="currentFile.path" 
      :fileName="currentFile.name"
      @close="handleClose"
    />
  </div>
</template>

<style>
/* Global Reset & Base Styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

body {
  /* Background similar to screenshot */
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1518531933037-9a82bf55ab6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
  background-size: cover;
}

#app {
  height: 100%;
  width: 100%;
}

#app-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
