<script setup lang="ts">
import { inject, ref } from 'vue';
import type AccountGateway from './AccountGateway';

  const form = ref({
    name: "",
    email: "",
    document: "",
    password: "",
    accountId: "",
    message: "",
  })

  const accountGateway = inject("accountGateway") as AccountGateway;

  async function signup() {
    const input = form.value;
    const output = await accountGateway.save(input);

    if (output.accountId) {
      form.value.accountId = output.accountId;
      form.value.message = "success";
    } else {
      form.value.message = output.message;
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
