import { environment } from "@/environments/environment";
import type { IProduct } from "@/interfaces/product-interface";
import { ref, computed, onMounted } from "vue";

export function useProducts() {
  const products = ref<IProduct[]>([]);
  const searchQuery = ref<string>("");
  const allProducts = ref<IProduct[]>([]);
  const apiUrl: string = environment.apiUrl;
  const limit = 20;
  let offset = 0;

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products?limit=100`);
      const data = await response.json();
      allProducts.value = data.products;
      products.value = allProducts.value.slice(0, limit);
      offset = limit;
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value;
    return allProducts.value.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const loadMoreProducts = () => {
    if (offset < allProducts.value.length) {
      const newProducts = allProducts.value.slice(offset, offset + limit);
      products.value = [...products.value, ...newProducts];
      offset += limit;
    }
  };

  onMounted(fetchProducts);

  return {
    searchQuery,
    filteredProducts,
    loadMoreProducts,
  };
}
