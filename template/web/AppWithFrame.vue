<template>
  <Frame>
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
  </Frame>
</template>
<script>
import Frame from '../../../web/Frame.vue'
export default {
  components: {
    Frame
  }
}
</script>
<style lang="scss">
@import 'style';
</style>
