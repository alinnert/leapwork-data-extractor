<template>
  <div class="grid grid-cols-[1fr,auto] items-center">
    <div class="flex items-center">
      <slot></slot>
    </div>
    <div class="flex items-center">
      <slot name="secondary"></slot>
    </div>
  </div>
</template>
