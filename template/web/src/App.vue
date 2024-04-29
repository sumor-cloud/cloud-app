<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
    </Suspense>
  </router-view>
</template>
<script>
export default {
  components:{}
}
</script>
<style lang="scss">
@import "style";
</style>