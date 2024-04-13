import { createApp, h } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import router from "./router";
import Form from "ant-design-vue/lib/form";
import Input from "ant-design-vue/lib/input";
import InputNumber from "ant-design-vue/lib/input-number";
import Button from "ant-design-vue/lib/button";
import Navbar from "./components/Navbar.vue";
import MaterialTable from "./components/MaterialTable.vue";
import MaterialModal from "./components/MaterialModal.vue";
import Modal from "ant-design-vue/lib/Modal";
import Table from "ant-design-vue/lib/table";

const app = createApp({
  render: () => h(App),
});

const antDComponent = [Form, Input, Button, Modal, Table, InputNumber];

antDComponent.forEach((component) => app.use(component));

app.component("nav-bar", Navbar);
app.component("material-table", MaterialTable);
app.component("material-modal", MaterialModal);

app.use(router);

app.mount("#app");
