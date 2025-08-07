<script setup lang="ts">
import { ref } from 'vue';

  const form = ref({
    name: "",
    email: "",
    document: "",
    password: "",
    accountId: "",
    message: "",
  })

  async function signup() {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'post',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(form.value)
    });

    const output = await response.json();

    if (output.accountId) {
      form.value.accountId = output.accountId;
      form.value.message = "success";
    }
  }

</script>

<template>
    <input class="input-name" type="text" v-model="form.name" placeholder="Insert name" />
    <input class="input-email" type="email" v-model="form.email" placeholder="Insert email" />
    <input class="input-document" type="text" v-model="form.document" placeholder="Insert document" />
    <input class="input-password" type="password" v-model="form.password" autocomplete="off" placeholder="Insert password" />
    
    <button class="button-signup" @click="signup">Signup</button>

  <span class="span-message">{{ form.message }}</span>
</template>

<style scoped>
</style>
