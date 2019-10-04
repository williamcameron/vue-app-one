<template>
  <div class="about">
    <HelloWorld msg="This is the about page."/>
    {{ message }}
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';

export default {
  name: 'about',
  components: {
    HelloWorld,
  },
  setup() {
    const message = 'hi';
    return {
      HelloWorld,
      message,
    };
  },
};
</script>
