<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Types
interface FileNode {
  name: string;
  type: 'directory' | 'file';
  path: string;
  size?: number;
  children?: FileNode[];
  extension?: string;
  lastModified?: string;
}

const emit = defineEmits<{
  (e: 'preview', file: FileNode): void
}>();

const rootFiles = ref<FileNode[]>([]);
const currentPath = ref<string[]>([]);
const searchQuery = ref('');

// Fetch files on mount
onMounted(async () => {
  try {
    const res = await fetch('/files.json');
    rootFiles.value = await res.json();
  } catch (e) {
    console.error('Failed to load files:', e);
  }
});

// Navigation logic
const currentDirectoryFiles = computed(() => {
  let current = rootFiles.value;
  for (const folderName of currentPath.value) {
    const folder = current.find(f => f.name === folderName && f.type === 'directory');
    if (folder && folder.children) {
      current = folder.children;
    } else {
      return [];
    }
  }
  return current;
});

function searchRecursive(nodes: FileNode[], query: string): FileNode[] {
  let results: FileNode[] = [];
  for (const node of nodes) {
    if (node.name.toLowerCase().includes(query)) {
      results.push(node);
    }
    if (node.children) {
      results = results.concat(searchRecursive(node.children, query));
    }
  }
  return results;
}

const filteredFiles = computed(() => {
  let files = currentDirectoryFiles.value;
  if (searchQuery.value) {
    if (searchQuery.value.trim() === '') return files;
    return searchRecursive(rootFiles.value, searchQuery.value.toLowerCase());
  }
  return files;
});

function handleItemClick(item: FileNode) {
  if (item.type === 'directory') {
    // If we are in search mode, navigation is tricky as we don't have parent context easily.
    // For simplicity, disable directory navigation in search results for now, or just clear search.
    if (searchQuery.value) {
      searchQuery.value = '';
      // Reset path to root and try to find the path to this directory? 
      // Too complex for now. Just clear search.
      // Ideally we would set currentPath to the path of this directory.
      // Since path in JSON is "Files/folder/...", we could parse it.
      const parts = item.path.split('/');
      // Remove "Files" prefix if it exists in path but not in currentPath structure (which is just names)
      // My generate script uses relative path "Files/..."
      if (parts[0] === 'Files') parts.shift();
      currentPath.value = parts;
    } else {
      currentPath.value.push(item.name);
    }
  } else {
    emit('preview', item);
  }
}

function goUp() {
  if (currentPath.value.length > 0) {
    currentPath.value.pop();
  }
}

function navigateTo(index: number) {
  if (index === -1) {
    currentPath.value = [];
  } else {
    currentPath.value = currentPath.value.slice(0, index + 1);
  }
}

// Icons
function getIcon(item: FileNode) {
  if (item.type === 'directory') return 'fas fa-folder';
  if (item.extension === '.pdf') return 'fas fa-file-pdf';
  if (item.extension === '.epub') return 'fas fa-book';
  return 'fas fa-file';
}

function formatSize(size?: number) {
  if (!size) return '';
  return (size / 1024 / 1024).toFixed(2) + ' MB';
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString();
}

</script>

<template>
  <div class="explorer-container">
    <!-- Header Section (Fixed) -->
    <div class="header-section">
      <div class="search-bar">
        <i class="fas fa-search search-icon"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="输入以全局搜索文件..." 
        />
      </div>
    </div>

    <!-- Content Section (Scrollable) -->
    <div class="content-section">
      <div class="main-content">
        <!-- Breadcrumbs -->
        <div class="breadcrumbs" v-if="!searchQuery">
          <span 
            class="breadcrumb-item" 
            :class="{ active: currentPath.length === 0 }"
            @click="navigateTo(-1)"
          >
            <i class="fas fa-home"></i>
          </span>
          <template v-for="(folder, index) in currentPath" :key="index">
            <span class="separator">/</span>
            <span 
              class="breadcrumb-item"
              :class="{ active: index === currentPath.length - 1 }"
              @click="navigateTo(index)"
            >
              {{ folder }}
            </span>
          </template>
        </div>

        <!-- File List -->
        <div class="file-list">
          <!-- Back Button -->
          <div 
            v-if="currentPath.length > 0 && !searchQuery" 
            class="file-item back-item"
            @click="goUp"
          >
            <i class="fas fa-level-up-alt item-icon"></i>
            <span class="item-name">返回上级目录</span>
          </div>

          <!-- Files -->
          <div 
            v-for="item in filteredFiles" 
            :key="item.path" 
            class="file-item"
            @click="handleItemClick(item)"
          >
            <i :class="[getIcon(item), 'item-icon']"></i>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-meta" v-if="item.type === 'file'">
                {{ formatDate(item.lastModified) }} 
                {{ formatSize(item.size) }}
              </span>
            </div>
            <i class="fas fa-th-large grid-icon"></i>
          </div>

          <div v-if="filteredFiles.length === 0" class="empty-state">
            No files found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.explorer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  overflow: hidden; /* Prevent body scroll */
}

.header-section {
  flex: 0 0 auto;
  padding: 1rem 2rem;
  z-index: 10;
}

.search-bar {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.search-icon {
  color: #888;
  margin-right: 1rem;
}

.search-bar input {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  font-size: 1rem;
  outline: none;
}

.content-section {
  flex: 1;
  overflow-y: auto;
  padding: 0 2rem 2rem 2rem;
}

.main-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1rem 0;
  min-height: 100%; /* Ensure it fills the space */
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.breadcrumbs {
  padding: 0.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap; /* Handle long paths */
}

.breadcrumb-item {
  cursor: pointer;
  opacity: 0.7;
}

.breadcrumb-item:hover, .breadcrumb-item.active {
  opacity: 1;
  font-weight: bold;
}

.separator {
  opacity: 0.5;
}

.file-list {
  display: flex;
  flex-direction: column;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: background 0.2s;
}

.file-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.item-icon {
  font-size: 1.5rem;
  width: 2rem;
  margin-right: 1rem;
  color: #ddd;
}

.back-item .item-icon {
  color: #aaa;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Enable text truncation if needed */
}

.item-name {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 0.2rem;
}

.grid-icon {
  opacity: 0.5;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #aaa;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .header-section {
    padding: 1rem;
  }
  
  .content-section {
    padding: 0 1rem 1rem 1rem;
  }
  
  .file-item {
    padding: 1rem;
  }
  
  .breadcrumbs {
    padding: 0.5rem 1rem;
  }
}
</style>
