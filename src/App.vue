<script setup lang="ts">
import { inject, ref, computed } from "vue";
import { pocketBaseSymbol } from './symbols/injectionSymbols';

const $pb = inject(pocketBaseSymbol);
const isUploading = ref(false);

const uploadedFile = ref<File>();
const beingDragged = ref(false);
const uploadedFileSubmittedId = ref<string>('');

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file?.type.includes("pdf")) {
    return;
  }

  uploadedFile.value = file;
}

async function submitFile() {
  console.log(import.meta.env.VITE_POCKETBASE_URL);
  const formData = new FormData();
  formData.append("original_file", uploadedFile.value!);

  try {
    const response = await $pb?.collection('pdf_demo').create(formData);
    uploadedFileSubmittedId.value = response?.id || '';
  } catch (error) {
    console.log(error);
  }
}

function onDragEnter(e: DragEvent) {
  e.preventDefault();
  beingDragged.value = true;
}

function onDragLeave(e: DragEvent) {
  e.preventDefault();
  beingDragged.value = false;
}

function onDragOver(e: DragEvent) {
  e.preventDefault();
}

</script>

<template>
  <div class="py-4 md:px-4 min-h-screen bg-gradient-to-r from-primary to-secondary grid grid-cols-3 gap-4">
    <div class="card p-12 h-full bg-base-100 shadow-xl col-span-1">
      <h1 class="text-4xl mb-4 font-bold">Demo - PDF EDITOR</h1>
      <p class="text-xl mb-8">Este es un demo de un editor de PDF</p>

      <input
        id="file"
        type="file"
        class="file-input file-input-bordered file-input-primary file-input-md w-full max-w-md mb-8"
        accept="application/pdf"
        @change="onFileChange"
        @dragenter="onDragEnter"
        @dragleave="onDragLeave"
        @drop="onFileChange"
      />
      <button
        :disabled="isUploading || !uploadedFile || uploadedFileSubmittedId !== ''"
        :class="{
          'btn btn-disabled': !uploadedFile || isUploading || uploadedFileSubmittedId,
          'loading': isUploading
        }"
        class="btn btn-primary btn-lg w-full max-w-md"
        @click="submitFile"
      >
        {{ uploadedFileSubmittedId ? 'Ya subiste un archivo' : 'Subir archivo' }}
      </button>

    </div>
    <div class="card p-4 h-full bg-base-100 shadow-xl col-span-2 flex flex-row justify-center items-center">
    </div>
  </div>
</template>
