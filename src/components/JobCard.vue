<template>
  <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500 transition cursor-pointer">

    <!-- Top row -->
    <div class="flex justify-between items-start mb-3">
      <div class="bg-blue-500 text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center text-lg">
        {{ job.company[0] }}
      </div>
      <span class="text-xs px-3 py-1 rounded-full border"
        :class="{
          'border-blue-400 text-blue-400': job.type === 'Full-time',
          'border-purple-400 text-purple-400': job.type === 'Internship',
          'border-green-400 text-green-400': job.type === 'Scholarship'
        }">
        {{ job.type }}
      </span>
    </div>

    <!-- Job info -->
    <h3 class="text-white font-bold text-base mb-1">{{ job.title }}</h3>
    <p class="text-gray-400 text-sm mb-1">{{ job.company }}</p>
    <p class="text-gray-500 text-sm mb-4"> {{ job.location }}</p>

    <!-- Bookmark -->
    <button
      @click="$emit('bookmark', job.id)"
      class="w-full mb-2 border border-gray-600 hover:border-yellow-400 text-gray-400 hover:text-yellow-400 text-sm py-2 rounded-lg transition">
       Bookmark
    </button>

    <!-- View Details -->
    <RouterLink :to="`/job/${job.id}`"
      class="block text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition">
      View Details →
    </RouterLink>

  </div>
</template>

<script setup>
defineProps({
  job: Object
})
defineEmits(['bookmark'])
</script>