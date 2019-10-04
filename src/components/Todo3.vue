<template>
  <div>
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo"
          autofocus autocomplete="off"
          placeholder="What needs to be done?"
          v-model="newTodo"
          @keyup.enter="addTodo">
      </header>
      <section class="main" v-show="todos.length" v-cloak>
        <input class="toggle-all" type="checkbox" v-model="allDone">
        <ul class="todo-list">
          <li v-for="todo in filteredTodos"
            class="todo"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo == editedTodo }">
            <div class="view">
              <input class="toggle" type="checkbox" v-model="todo.completed">
              <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
              <button class="destroy" @click="removeTodo(todo)"></button>
            </div>
            <input class="edit" type="text"
              v-model="todo.title"
              v-todo-focus="todo == editedTodo"
              @blur="doneEdit(todo)"
              @keyup.enter="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)">
          </li>
        </ul>
      </section>
      <footer class="footer" v-show="todos.length" v-cloak>
        <span class="todo-count">
          <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
        </span>
        <ul class="filters">
          <li><a href="#/all" :class="{ selected: visibility == 'all' }">All</a></li>
          <li><a href="#/active" :class="{ selected: visibility == 'active' }">Active</a></li>
          <li><a href="#/completed" :class="{ selected: visibility == 'completed' }">Completed</a></li>
        </ul>
        <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
          Clear completed
        </button>
      </footer>
    </section>
    <footer class="info">
      <p>Double-click to edit a todo</p>
    </footer>
  </div>
</template>

<script>
import { computed, watch, ref } from '@vue/composition-api';

const STORAGE_KEY = 'todos-vuejs-2.0';
var todoStorage = {
  fetch() {
    const todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    todos.forEach((todo, index) => {
      todo.id = index;
    });
    todoStorage.uid = todos.length;
    return todos;
  },
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};

// visibility filters
const filters = {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter(todo => !todo.completed);
  },
  completed(todos) {
    return todos.filter(todo => todo.completed);
  }
};

export default {
  setup() {
    const todos = ref(todoStorage.fetch());
    const newTodo = ref('');
    const editedTodo = ref(null);
    const visibility = ref('all');
    let beforeEditCache = '';
    watch(todos, (todos) => {
      todoStorage.save(todos);
    }, { deep: true });
    const computeds = {
      filteredTodos: computed(() => filters[visibility.value](todos.value)),
      remaining: computed(() => filters.active(todos.value).length),
      allDone: computed(
        () => computeds.remaining.value === 0,
        () => todos.value.forEach((todo) => {
          todo.completed = true;
        }),
      ),
    };
    

    const methods = {
      addTodo() {
        const value = newTodo.value && newTodo.value.trim();
        if (value) {
          todos.value.push({
            id: todoStorage.uid++,
            title: value,
            completed: false,
          });
        }
        newTodo.value = '';
      },
      removeTodo(todo) {
        todos.value = todos.value.filter(t => t !== todo);
      },
      editTodo(todo) {
        beforeEditCache = todo.title;
        editedTodo.value = todo;
      },
      doneEdit(todo) {
        if (editedTodo.value) {
          editedTodo.value = null;
          todo.title = todo.title.trim();
          if (!todo.title) {
            methods.removeTodo(todo);
          }
        }
      },
      cancelEdit() {
        todo.title = todo.title.trim();
        if (!todo.title) {
          methods.removeTodo(todo);
        }
      },
      removeCompleted() {
        todos.value = filters.active(todos.value);
      },
    };
    return {
      todos,
      newTodo,
      editedTodo,
      visibility,
      ...computeds,
      ...methods,
      ...filters,
    };
  },
};
</script>
