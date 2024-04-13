<script setup>
import { computed, reactive, watch } from "vue";
import { Form } from "ant-design-vue";

const useForm = Form.useForm;

const props = defineProps({
  open: Boolean,
});

const emits = defineEmits(["cancel", "confirm"]);

const mockRes = [
  {
    Material: "MAT000",
    ProductCode: "PC00015",
    Description: "xxxx-xxxx-xxxx-xxxx",
  },
  {
    Material: "MAT0005",
    ProductCode: "PC0005",
    Description: "xxxx-xxxx-xxx",
  },
];

const formState = reactive({
  materialNumber: "",
  productCode: "",
  description: "",
});

const ruleRef = reactive({
  materialNumber: [{ validator: findMaterial }],
  productCode: [],
  description: [],
});

function fetchMaterial() {
  return new Promise((res, rej) => {
    return setTimeout(() => {
      res(mockRes);
    }, 100);
  });
}

const { validateInfos, resetFields } = useForm(formState, ruleRef);

async function findMaterial(_rule, e) {
  if (!e) {
    formState.productCode = "";
    formState.description = "";
    return Promise.resolve();
  }

  const res = await fetchMaterial();

  const matchMaterialIdx = res.findIndex((item) => {
    return item.Material === e;
  });

  if (matchMaterialIdx != -1) {
    formState.productCode = res[matchMaterialIdx].ProductCode;
    formState.description = res[matchMaterialIdx].Description;
    return Promise.resolve();
  }

  if (matchMaterialIdx == -1) {
    formState.productCode = "";
    formState.description = "";
    return Promise.reject("There is no this material number");
  }

  return Promise.resolve();
}

watch(
  () => props.open,
  (val) => {
    if (val) {
      resetFields();
    }
  }
);
</script>

<template>
  <a-modal
    :open="props.open"
    centered
    :maskClosable="false"
    title="Add Material"
    @cancel="emits('cancel')"
  >
    <a-form>
      <a-form-item
        label="Material Number"
        :labelCol="{ span: 24 }"
        name="materialNumber"
        v-bind="validateInfos.materialNumber"
      >
        <a-input v-model:value="formState.materialNumber"></a-input>
      </a-form-item>
      <a-form-item
        label="Product Code"
        :labelCol="{ span: 24 }"
        name="productCode"
        v-bind="validateInfos.productCode"
      >
        <a-input disabled v-model:value="formState.productCode"></a-input>
      </a-form-item>
      <a-form-item
        label="Description"
        :labelCol="{ span: 24 }"
        name="description"
        v-bind="validateInfos.description"
      >
        <a-textarea disabled :rows="5" v-model:value="formState.description">
        </a-textarea>
      </a-form-item>
    </a-form>
    <template #footer>
      <div class="flex items-center justify-center gap-5">
        <a-button
          type="primary"
          @click="() => emits('confirm', formState)"
          class="w-[94px]"
          :disabled="
            !formState.materialNumber ||
            validateInfos.materialNumber.validateStatus === 'error'
          "
          >Add</a-button
        >
        <a-button class="w-[94px]" @click="emits('cancel')">Cancel</a-button>
      </div>
    </template>
  </a-modal>
</template>
