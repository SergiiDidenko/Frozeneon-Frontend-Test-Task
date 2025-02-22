<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProducts } from "@/composables/useProducts";
import star from "@/assets/img/star.svg";

const { filteredProducts, searchQuery, loadMoreProducts } = useProducts();
const listRef = ref<HTMLElement | null>(null);

const itemHeight = 200;
const containerHeight = 700;
const startIndex = ref(0);
const endIndex = ref(0);

const updateVisibleItems = () => {
    if (!listRef.value) return;
    const scrollTop = listRef.value.scrollTop;
    startIndex.value = Math.floor(scrollTop / itemHeight);
    endIndex.value = Math.ceil((scrollTop + containerHeight) / itemHeight);
};

const onScroll = () => {
    if (!listRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.value;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMoreProducts();
    }
    updateVisibleItems();
};

onMounted(() => {
    if (listRef.value) {
        listRef.value.addEventListener("scroll", onScroll);
        updateVisibleItems();
    }
});

onUnmounted(() => {
    listRef.value?.removeEventListener("scroll", onScroll);
});

const visibleProducts = computed(() =>
    filteredProducts.value.slice(startIndex.value, endIndex.value)
);

const topPadding = computed(() => `${startIndex.value * itemHeight}px`);
const bottomPadding = computed(() => `${(filteredProducts.value.length - endIndex.value) * itemHeight}px`);
</script>

<template>
    <div class="product-container">
        <input v-model="searchQuery" type="text" placeholder="Пошук товарів..." class="search-input" />

        <div ref="listRef" class="product-list">
            <div :style="{ paddingTop: topPadding, paddingBottom: bottomPadding }">
                <transition-group name="fade" tag="div" :key="startIndex">
                    <div v-for="product in visibleProducts" :key="product.id" class="product-item">
                        <img :src="product.thumbnail" :alt="product.title" class="product-image" />
                        <div class="product-info">
                            <h3 class="product-title">{{ product.title }}</h3>
                            <p class="product-description">{{ product.description }}</p>
                            <div class="product-meta">
                                <span class="discount">Discount {{ product.discountPercentage }}%</span>
                                <span class="brand">{{ product.brand }}</span>
                                <span class="category">{{ product.category }}</span>
                            </div>
                            <div class="product-footer">
                                <span class="price">${{ product.price }}</span>
                                <span class="rating"><img :src="star" alt="star" />{{ product.rating }}</span>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

