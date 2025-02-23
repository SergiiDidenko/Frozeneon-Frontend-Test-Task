<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useProducts } from "@/composables/use-products";
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
    <div class="container d-flex flex-column">
        <input v-model="searchQuery" type="text" placeholder="Пошук товарів..." class="search-input" />

        <div ref="listRef" class="product-list">
            <div :style="{ paddingTop: topPadding, paddingBottom: bottomPadding }">
                <transition-group name="fade" tag="div" :key="startIndex">
                    <div v-for="product in visibleProducts" :key="product.id"
                        class="product-item d-flex align-center gap-15">
                        <div class="product-image">
                            <img :src="product.thumbnail" :alt="product.title" class=" img-cover" />

                        </div>
                        <div class="product-info gap-5 d-flex flex-column">
                            <h3 class="bold size-m">{{ product.title }}</h3>
                            <p class="text-color size-s">{{ product.description }}</p>
                            <div class="text-color size-m gap-10 d-flex">
                                <span class="discount bold">Discount {{ product.discountPercentage }}%</span>
                                <span class="primary-color">{{ product.brand }}</span>
                                <span class="category">{{ product.category }}</span>
                            </div>
                            <div class="primary-color bold size-m gap-15 d-flex align-center">
                                <span class="price">${{ product.price }}</span>
                                <span class="gap-5 d-flex align-center">
                                    <img :src="star" alt="star" class="img-s" />{{ product.rating }}
                                </span>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>
