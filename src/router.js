import Vue from 'vue';
import Router from 'vue-router';
import Todo from './components/Todo.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'todo',
      component: Todo,
    },
    {
      path: '/todo3',
      name: 'todo3',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './components/Todo3.vue'),
    },
  ],
});
