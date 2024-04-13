<script setup>
import { anyType } from "ant-design-vue/es/_util/type";
import { computed, watch } from "vue";

const props = defineProps({
  modelValue: anyType,
  columns: anyType,
});

const emits = defineEmits(["save"]);

const values = computed(() => {
  const data = props.modelValue.materials.reduce((acc, item, idx) => {
    const testIdx = acc.findIndex((ele) => ele.Material === item.Material);
    if (testIdx !== -1) {
      acc[testIdx] = {
        ...acc[testIdx],
        [item.Location]: item.QTY,
      };
    } else {
      acc.push({
        Material: item.Material,
        [item.Location]: item.QTY,
        ProductCode: item.ProductCode,
      });
    }

    return acc;
  }, []);

  return data;
});
</script>

<template>
  <div>
    <a-table
      :pagination="false"
      :columns="columns"
      v-model:dataSource="values"
      :scroll="{ x: 1300 }"
    >
      <template #bodyCell="{ column, text, record, index }">
        <template v-if="column.title === 'Material'">
          {{ text }}
        </template>
        <template v-if="column.title !== 'Material' && column.title !== 'Sum'">
          <div class="w-full">
            <a-input-number
              :tabindex="column.columnIndex + 1 + '' + index"
              class="w-full"
              min="0"
              :controls="false"
              v-model:value="record[column.title]"
            />
          </div>
        </template>
        <template v-if="column.title === 'Sum'">
          {{
            Object.entries(record).reduce((acc, [key, value]) => {
              if (["Material", "ProductCode"].includes(key)) {
                acc += 0;
              } else {
                acc += +value;
              }

              return acc;
            }, 0)
          }}
        </template>
      </template>
    </a-table>
  </div>
  <div class="text-end mt-6">
    <a-button type="primary" @click="emits('save', values)">Save</a-button>
  </div>
</template>
