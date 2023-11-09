<script setup lang="ts">
import { ref, onMounted} from 'vue'
import {setup_touchpad} from './touchpad'

onMounted(()=>{
  setup_touchpad(document.querySelector('#pad-container') as HTMLElement)
})









</script>

<template>
  <div id="pad-container"></div>
</template>

<style>
#pad-container{
  height: 100%;
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#touchpad{
  background-color:#666;
}
</style>
