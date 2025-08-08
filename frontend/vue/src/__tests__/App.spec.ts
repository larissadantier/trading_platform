import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { AccountGatewayMemory } from '@/AccountGateway';

import App from '../App.vue'

function sleep (time: number) {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(true);
      }, time);
  });
}

describe('App.vue', () => {
  it('Should be create an account', async () => {
    const accountGateway = new AccountGatewayMemory();
    const wrapper = mount(App, {
      global: { 
        provide: { 
          accountGateway,
        }
      }
    });

    const input = {
      name: "John Doe",
      email: "john@hotmail.com",
      document: "87748248800",
      password: "asdQWE123"
    }

    await wrapper.get(".input-name").setValue(input.name);
    await wrapper.get(".input-email").setValue(input.email);
    await wrapper.get(".input-document").setValue(input.document);
    await wrapper.get(".input-password").setValue(input.password);
    await wrapper.get(".button-signup").trigger("click");
    await sleep(200);

    expect(wrapper.get(".span-message").text()).toBe("success");
  })

  it('Should be not create an account if name is invalid', async () => {
    const accountGateway = new AccountGatewayMemory();
    const wrapper = mount(App, {
      global: { 
        provide: { 
          accountGateway,
        }
      }
    });

    const input = {
      name: "John",
      email: "john@hotmail.com",
      document: "87748248800",
      password: "asdQWE123"
    }


    await wrapper.get(".input-name").setValue(input.name);
    await wrapper.get(".input-email").setValue(input.email);
    await wrapper.get(".input-document").setValue(input.document);
    await wrapper.get(".input-password").setValue(input.password);
    await wrapper.get(".button-signup").trigger("click");
    await sleep(200);

    expect(wrapper.get(".span-message").text()).toBe("Invalid name");
  })
})
