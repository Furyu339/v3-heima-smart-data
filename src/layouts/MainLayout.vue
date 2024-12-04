<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import SliderBar from "./components/SliderBar.vue";
</script>

<template>
  <div class="main-layout">
    <SliderBar class="slider-container"></SliderBar>
    <div class="main-container">
      <NavBar></NavBar>
      <div class="main-wrapper">
        <div class="main-content">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-transform" mode="out-in">
              <component :key="$route.path" :is="Component" />
            </Transition>
          </RouterView>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  .main-container {
    background-color: #f4f6f8;
    flex: 1;
    min-width: 820px;
    .main-wrapper {
      padding: 0 20px;
      .main-content {
        background-color: #ffffff;
        height: calc(100vh - 60px);
        overflow-y: auto;
      }
    }
  }
  .slider-container {
    width: 260px;
    min-width: 260px;
  }
}
</style>
