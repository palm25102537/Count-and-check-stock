<script setup>
import { PlusOutlined } from "@ant-design/icons-vue";
import { ref, reactive, onBeforeMount, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const isAppModalOpened = ref(false);

const route = useRoute();

const mockAPI = [
  {
    Material: "MAT0001",
    ProductCode: "PC0001",
    Location: "A1",
    QTY: 100,
  },
  {
    Material: "MAT0001",
    ProductCode: "PC0001",
    Location: "A2",
    QTY: 200,
  },
  {
    Material: "MAT0002",
    ProductCode: "PC0002",
    Location: "A3",
    QTY: 100,
  },
  {
    Material: "MAT0003",
    ProductCode: "PC0003",
    Location: "A4",
    QTY: 100,
  },
  {
    Material: "MAT0004",
    ProductCode: "PC0004",
    Location: "A1",
    QTY: 100,
  },
];

const materialFormState = reactive({
  materials: [],
  defaultMaterials: [],
});

const columns = computed(() => {
  const defaultColumn = {
    title: "Material",
    dataIndex: "Material",
    minWidth: 100,
    fixed: "left",
  };

  const dynamicColumns = materialFormState.materials.reduce(
    (acc, item, idx) => {
      const dataIdx = acc?.findIndex((ele) => ele.title === item.Location);
      if (dataIdx === -1) {
        acc.push({
          title: item.Location,
          dataIndex: item.Location,
          minWidth: 200,
          align: "center",
          columnIndex: idx,
        });
      }

      return acc;
    },
    []
  );

  return [
    defaultColumn,
    ...dynamicColumns,
    { title: "Sum", width: 200, align: "center" },
  ];
});

function fetchAllMaterials() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      return res(mockAPI);
    }, 100);
  });
}

function toggleAddModal(e) {
  isAppModalOpened.value = e;
}

function onCloseModal() {
  toggleAddModal(false);
}

function onConfirmAdd(e) {
  columns.value.forEach((item, idx) => {
    if (idx > 0 && item.title !== "Sum") {
      materialFormState.materials.push({
        Material: e.materialNumber,
        ProductCode: e.productCode,
        Location: item.title,
        QTY: 0,
      });

      materialFormState.defaultMaterials.push({
        Material: e.materialNumber,
        ProductCode: e.productCode,
        Location: item.title,
        QTY: 0,
      });
    }
  });

  toggleAddModal(false);
}

function onSaveAdjustedMaterial(e) {
  const body = [];
  columns.value
    .filter((item) => !["Material", "Sum"].includes(item.title))
    .map((item) => item.title)
    .forEach((item) => {
      e.forEach((ele) => {
        body.push({
          Material: ele.Material,
          QTY: ele[item],
          ProductCode: ele.ProductCode,
          Location: item,
        });
      });
    });

  const filteredBody = body.filter((item) => !!item.QTY);
  console.log("all", body);
  console.log("filter", filteredBody);
}

onBeforeMount(() => {
  fetchAllMaterials().then((res) => {
    materialFormState.materials = JSON.parse(JSON.stringify(res));
    if (route.query.material) {
      materialFormState.materials = materialFormState.materials.filter(
        (item) => item.Material === route.query.material
      );
    }
    materialFormState.defaultMaterials = JSON.parse(JSON.stringify(res));
  });
});

watch(
  () => route.query,
  (val) => {
    if (val.material) {
      materialFormState.materials = materialFormState.defaultMaterials.filter(
        (item) => {
          console.log(item);
          return item.Material === val.material;
        }
      );
    }

    if (!val.material) {
      materialFormState.materials = materialFormState.defaultMaterials;
    }
  },
  { deep: true }
);
</script>

<template>
  <h1 class="text-[48px] font-bold text-center">Check Material Stock</h1>
  <div class="px-7">
    <nav-bar></nav-bar>
    <div class="text-end">
      <a-button
        type="primary"
        html-type="submit"
        @click="() => toggleAddModal(true)"
      >
        <div class="flex items-center justify-center gap-2">
          <PlusOutlined />
          Add Material
        </div>
      </a-button>
    </div>
    <section id="table" class="mt-6">
      <material-table
        v-model="materialFormState"
        :columns="columns"
        @save="onSaveAdjustedMaterial"
      ></material-table>
      <material-modal
        :open="isAppModalOpened"
        @cancel="onCloseModal"
        @confirm="onConfirmAdd"
      ></material-modal>
    </section>
  </div>
</template>
