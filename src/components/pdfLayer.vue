<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
import { ref, computed, watch } from "vue";

interface Props {
  pdfUrl: string;
}

const currentPage = ref(1);
const maxPages = ref(0);
const pdfLoaded = ref(false);
const firstClickPosition = ref({ x: 0, y: 0 });
const lastClickPosition = ref({ x: 0, y: 0 });

function onClick(e: MouseEvent) {
    if (firstClickPosition.value.x !== 0) {
        lastClickPosition.value = { x: e.clientX, y: e.clientY };
    } else if (lastClickPosition.value.x != 0) {
        firstClickPosition.value = { x: e.clientX, y: e.clientY };
        lastClickPosition.value = { x: 0, y: 0 };
    } else {
        firstClickPosition.value = { x: e.clientX, y: e.clientY };
    }
}

function onRendered(documentMetadata: any) {
    maxPages.value = documentMetadata.numPages;
    pdfLoaded.value = true;
}

watch(lastClickPosition, (newVal, oldVal) => {
    if (newVal.x === 0 && newVal.y === 0) {
        return;
    }

    const minX = Math.min(firstClickPosition.value.x, lastClickPosition.value.x);
    const minY = Math.min(firstClickPosition.value.y, lastClickPosition.value.y);
    const maxX = Math.max(firstClickPosition.value.x, lastClickPosition.value.x);
    const maxY = Math.max(firstClickPosition.value.y, lastClickPosition.value.y);

    const width = maxX - minX;
    const height = maxY - minY;

    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = `${minX}px`;
    element.style.top = `${minY}px`;
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
    element.style.border = '1px solid red';
    element.style.zIndex = '1000';

    document.body.appendChild(element);

    firstClickPosition.value = { x: 0, y: 0 };
    lastClickPosition.value = { x: 0, y: 0 };
});


const props = defineProps<Props>();
</script>
<template>
    <div class="flex flex-col">
        <!-- draw a box absolute in the position of the first click and the last click -->
        <vue-pdf-embed @click="onClick" :source="pdfUrl" :page="currentPage"  @loaded="onRendered" id="pdf-embed" />
        <div v-if="pdfLoaded" class="flex flex-col gap-4 items-center">
            <p>Page {{ currentPage }} of {{ maxPages }}</p>
            <div class="flex flex-row gap-4">
                <button class="btn btn-primary" @click="currentPage = currentPage - 1" :disabled="currentPage === 1">Previous</button>
                <button class="btn btn-primary" @click="currentPage = currentPage + 1" :disabled="currentPage === maxPages">Next</button>
            </div>
        </div>
    </div>
</template>