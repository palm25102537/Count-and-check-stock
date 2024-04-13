<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const formState = reactive({
  material: route.query.material,
});
function onSearch(e) {
  if (!e.material) {
    if (route.query.material) {
      router.replace("/");
    }
    return;
  }
  router.replace("/" + "?material=" + e.material);
}
</script>

<template>
  <a-form
    class="flex items-end justify-between mb-6"
    :model="formState"
    @finish="onSearch"
  >
    <a-form-item
      name="material"
      label="Material"
      class="mb-0"
      :labelCol="{ span: 24 }"
    >
      <a-input
        placeholder="Material Number"
        v-model:value="formState.material"
      ></a-input>
    </a-form-item>
    <a-button html-type="submit" type="primary">Search</a-button>
  </a-form>
</template>
