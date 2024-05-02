import menu from "../components/menu.vue";
import diaria2 from "../components/diaria2.vue";
import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/", 
    component: menu,
    children: [
      { path: "diaria2", component: diaria2 }
    ]
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});


