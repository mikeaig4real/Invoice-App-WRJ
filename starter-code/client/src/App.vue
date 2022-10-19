<template>
  <div id="app">
    <ToolBar />
    <InvoiceForm />
    <router-view />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@400;700&display=swap');

::root {
  --wrPurpleStrong: #765DFA;
  --wrPurpleWeak: #9277FF;
  --wrWhiteStrong: #F8F8FB;
  --wrWhiteWeak: #DFE3FA;
  --wrGreyStrong: #1E2139;
  --wrGreyWeak: #252945;
  --wrBlackStrong: #0C0E16;
  --wrBlackWeak: #141625;
  --wrRedStrong: #EC5757;
  --wrRedWeak: rgb(255, 151, 151);
  --wrGreyMid: #888EB0;
  --wrPurpleMid: #7E88C3;
}

* {
  font-family: 'League Spartan', sans-serif !important;
  transition: all 0.1s ease-in-out;
}

html {
  background-color: var(--wrGreyStrong);
}

h1 {
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 32px !important;
  line-height: 36px !important;
  letter-spacing: -1px !important;
}

h2 {
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 20px !important;
  line-height: 22px !important;
  letter-spacing: -0.63px !important;
}

h3 {
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  line-height: 24px !important;
  letter-spacing: -0.8px !important;
}

h4 {
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 12px !important;
  line-height: 15px !important;
  letter-spacing: -0.25px !important;
}

p {
  color: var(--wrWhiteStrong) !important;
}

.body1>p {
  font-weight: 400 !important;
  font-size: 26px !important;
  line-height: 15px !important;
  letter-spacing: -0.25px !important;
}

.body2>p {
  font-weight: 400 !important;
  font-size: 11px !important;
  line-height: 18px !important;
  letter-spacing: -0.23px !important;
}

.button {
  background-color: var(--wrPurpleStrong) !important;
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  line-height: 0.9rem !important;
  letter-spacing: -0.05rem !important;
}

.button:hover {
  background-color: var(--wrPurpleWeak) !important;
  color: var(--wrWhiteWeak) !important;
}

.buttonEdit {
  background-color: var(--wrBlackStrong) !important;
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  line-height: 0.9rem !important;
  letter-spacing: -0.05rem !important;
}

.buttonEdit:hover {
  background-color: var(--wrGreyStrong) !important;
  color: var(--wrWhiteWeak) !important;
}

.buttonDraft {
  background-color: var(--wrBlackWeak) !important;
  color: var(--wrWhiteWeak) !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  line-height: 0.9rem !important;
  letter-spacing: -0.05rem !important;
}

.buttonDraft:hover {
  background-color: var(--wrBlackStrong) !important;
  color: var(--wrWhiteStrong) !important;
}

.buttonItem {
  background-color: var(--wrGrayWeak) !important;
  color: var(--wrPurpleMid) !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  line-height: 0.9rem !important;
  letter-spacing: -0.05rem !important;
}

.buttonItem:hover {
  background-color: var(--wrWhiteWeak) !important;
  color: var(--wrPurpleMid) !important;
}

.buttonDel {
  background-color: var(--wrRedStrong) !important;
  color: var(--wrWhiteStrong) !important;
  font-weight: 700 !important;
  font-size: 0.75rem !important;
  line-height: 0.9rem !important;
  letter-spacing: -0.05rem !important;
}

.buttonDel:hover {
  background-color: var(--wrRedWeak) !important;
  color: var(--wrWhiteStrong) !important;
}

.toolBar {
  background-color: var(--wrGreyWeak) !important;
}

hr {
  background-color: var(--wrWhiteWeak);
  color: var(--wrWhiteWeak);
}
</style>

<script>

import ToolBar from '@/components/ToolBar.vue'

import InvoiceForm from '@/components/InvoiceForm.vue'

import { mapActions } from 'vuex';

import data from '@/data';

export default {
  data() {
    return {

    }
  },
  components: {
    ToolBar,
    InvoiceForm,
  },
  methods: {
    ...mapActions([
      'getItem',
      'getInvoicesOut',
      'setItem',
      'setInvoice',
    ]),
  },
  async created() {
    try {
      const history = JSON.parse(localStorage.getItem('invoice'));
      if (history) {
        this.setInvoice(history);
        await this.getInvoicesOut({});
        return;
      }
      this.setInvoice(data.emptyInvoice);
      await this.getInvoicesOut({});
    } catch (error) {
      alert(error);
    }
  }
};

</script>
