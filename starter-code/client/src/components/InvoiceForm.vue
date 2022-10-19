<template>
    <div :class="showForm ? 'invoiceForm show' : 'invoiceForm hide'">
        <h1>{{invoice.id ? `#${invoice.id}`: 'New Invoice' }}</h1>
        <div class="form-container">
            <form ref="formRef" @submit.prevent>
                <div class="form-group">
                    <label for="">Bill From</label>
                    <div class="fg by1">
                        <div class="fg-input">
                            <label for="">Street Address</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.senderAddress.street" type="text">
                        </div>
                    </div>
                    <div class="fg by3">
                        <div class="fg-input">
                            <label for="">City</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.senderAddress.city" type="text">
                        </div>
                        <div class="fg-input">
                            <label for="">Post Code</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.senderAddress.postCode" type="text">
                        </div>
                        <div class="fg-input">
                            <label for="">Country</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.senderAddress.country" type="text">
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="">Bill To</label>
                    <div class="fg by1">
                        <div class="fg-input">
                            <label for="">Client"s Name</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})" v-model="invoice.clientName"
                                type="text">
                        </div>
                    </div>
                    <div class="fg by1">
                        <div class="fg-input">
                            <label for="">Client"s Email</label>
                            <input placeholder="e.g. email@example.com" @input="saveToLocal({})"
                                @change="saveToLocal({})" v-model="invoice.clientEmail" type="email">
                        </div>
                    </div>
                    <div class="fg by1">
                        <div class="fg-input">
                            <label for="">Street Address</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.clientAddress.street" type="text">
                        </div>
                    </div>
                    <div class="fg by3">
                        <div class="fg-input">
                            <label for="">City</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.clientAddress.city" type="text">
                        </div>
                        <div class="fg-input">
                            <label for="">Post Code</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.clientAddress.postCode" type="text">
                        </div>
                        <div class="fg-input">
                            <label for="">Country</label>
                            <input @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.clientAddress.country" type="text">
                        </div>
                    </div>
                    <div class="fg by2">
                        <div class="fg-input">
                            <label for="createdAt">Invoice Date</label>
                            <input disabled :value="invoice.createdAt" type="date">
                        </div>
                        <div class="fg-input">
                            <label for="paymentTerms">Payment Terms</label>
                            <select autocomplete="off" @input="saveToLocal({})" @change="saveToLocal({})"
                                v-model="invoice.paymentTerms" name="paymentTerms" id="paymentTerms">
                                <option value="30" selected>Net 30 Days</option>
                                <option value="60">Net 60 Days</option>
                                <option value="90">Net 90 Days</option>
                                <option value="120">Net 120 Days</option>
                            </select>
                        </div>
                    </div>
                    <div class="fg by1">
                        <div class="fg-input">
                            <label for="">Project Description</label>
                            <input placeholder="e.g. Graphic Design Service" @input="saveToLocal({})"
                                @change="saveToLocal({})" v-model="invoice.description" type="text">
                        </div>
                    </div>
                </div>

            </form>
            <h2>Item list</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>QTY.</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="({name,quantity,price,total},index) in invoice.items" :key="index">
                        <td>
                            <input v-model="invoice.items[index].name" @input="saveToLocal({})"
                                @change="saveToLocal({})" type="text">
                        </td>
                        <td>
                            <input v-model="invoice.items[index].quantity" @input="saveToLocal({type:true,index})"
                                @change="saveToLocal({type:true,index})" type="text">
                        </td>
                        <td>
                            <input v-model="invoice.items[index].price" @input="saveToLocal({type:true,index})"
                                @change="saveToLocal({type:true,index})" type="text">
                        </td>
                        <td>
                            <div class="itemTotal">
                                <p>{{total}}</p>
                                <img @click="removeItem(index)" src="../assets/icon-delete.svg">
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="buttonItem">
                <div @click="addNewItem()" class="text">
                    + Add New Item
                </div>
            </div>
        </div>
        <div class="control">
            <div v-if="!edit" @click="cancel()" class="buttonEdit">
                <div class="text">
                    Discard
                </div>
            </div>
            <div class="buttonDraft">
                <div @click="edit ? cancel() : saveAsDraft()" class="text">
                    {{edit ? 'Cancel' : 'Save as Draft'}}
                </div>
            </div>
            <div @click="edit ? saveEdit() : saveNew()" class="button">
                <div class="text">
                    {{edit ? 'Save Changes' : 'Save & Send'}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters, mapState, mapActions } from 'vuex'

import utility from '@/utils'

const {
    checkFalsyFieldsArr,
    checkFalsyFieldsObj,
    checkAllFieldsIn,
    generateId,
    getDueDate,
    getCreatedAt,
} = utility;

import data from '@/data'

export default {
    name: 'invoice-form',
    props: {

    },
    data() {
        return {
            reload: false,
            item: null,
        }
    },
    computed: {
        ...mapState([
            'edit',
            'showForm',
            'invoice',
        ]),
    },
    watch: {

    },
    methods: {
        ...mapActions([
            'addItemToInvoice',
            'removeItemFromInvoice',
            'toggleForm',
            'resetInvoice',
            'clearLocalInvoice',
            'calculateItemTotal',
            'addToInvoices',
            'createInvoice',
            'getInvoicesOut',
            'updateInvoice',
        ]),
        ...mapGetters([
            'getInvoice'
        ]),
        addNewItem() {
            this.addItemToInvoice();
        },
        removeItem(index) {
            this.removeItemFromInvoice({ index });
        },
        cancel() {
            this.resetInvoice();
            this.clearLocalInvoice();
            this.toggleForm({ formValue: false });
            this.reload && window.location.reload();
        },
        saveToLocal({ type = false, index = null }) {
            if (this.edit) this.reload = true;
            if (type) this.calculateItemTotal({ index });
            const invoice = JSON.stringify(this.invoice);
            localStorage.setItem('invoice', invoice);
        },
        async saveAsDraft() {
            try {
                this.invoice.status = 'draft';
                await this.createInvoice({ invoice: this.invoice });
                this.resetInvoice();
                this.clearLocalInvoice();
                this.toggleForm({ formValue: false });
                await this.getInvoicesOut({});
                window.location.reload();
            } catch (error) {
                console.log(error);
                alert(error);
            }
        },
        async saveNew() {
            try {
                this.invoice.status = 'pending';
                await this.createInvoice({ invoice: this.invoice });
                this.resetInvoice();
                this.clearLocalInvoice();
                this.toggleForm({ formValue: false });
                await this.getInvoicesOut({});
                window.location.reload();
            } catch (error) {
                console.log(error);
                alert(error);
            }
        },
        async saveEdit() {
            try {
                this.invoice.status = 'pending';
                await this.updateInvoice({ id: this.invoice.id, invoice: this.invoice });
                this.resetInvoice();
                this.clearLocalInvoice();
                this.toggleForm({ formValue: false });
                await this.getInvoicesOut({});
                window.location.reload();
            } catch (error) {
                console.log(error);
                alert(error);
            }
        }
    },
    created() {

    }
}
</script>

<style scoped>
.control {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 10%;
    width: 100%;
    border-radius: 0 2rem 0 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: #10121f;
    z-index: 90;
    padding-right: 6rem;
}

.itemTotal {
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.8);
    position: absolute;
    top: 0;
    left: -0.3rem;
    width: 100%;
    font-size: 1.3rem;
}

.itemTotal img {
    position: absolute;
    right: -2.3rem;
    top: 0.9rem;
    cursor: pointer;
}

.buttonItem {
    width: 100%;
    display: flex;
    font-size: 1.3rem !important;
    align-items: center;
    background-color: var(--wrGreyWeak) !important;
    color: var(--wrWhiteWeak) !important;
    padding: 1.5rem 1rem;
    cursor: pointer;
    border-radius: 2rem;
    justify-content: center;
}

.button,
.buttonEdit,
.buttonDraft {
    padding: 1.5rem 0;
    border-radius: 5rem;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: relative;
    width: 20%;
    margin-left: 1rem;
}

.buttonEdit {
    background-color: var(--wrWhiteWeak) !important;
    color: var(--wrGreyWeak) !important;
    margin-right: 4rem;
}

.button .text,
.buttonDraft .text,
.buttonEdit .text,
.buttonDel .text {
    font-size: 1.3rem;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    margin-top: 0;
}

h2 {
    color: var(--wrWhiteWeak) !important;
    font-weight: 400 !important;
}

td input {
    display: flex;
    height: 3rem;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    background-color: var(--wrGreyWeak);
    border: 1px solid rgba(255, 255, 255, 0.052);
    box-shadow: inset rgba(0, 0, 0, 0.07) 0px 0px 6rem;
    color: var(--wrWhiteStrong) !important;
    font-weight: 700;
    font-size: 1rem;
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
}

td:nth-child(1) input {
    width: 12rem;
}

td:nth-child(2) input {
    width: 4rem;
}

td:nth-child(3) input {
    width: 9rem;
}

td:nth-child(4) input {
    width: 1rem;
}

th {
    font-size: 1rem;
    line-height: 2;
    font-weight: 100;
    color: var(--wrWhiteStrong);
}

th:not(:first-child),
td:not(:first-child) {
    text-align: right;
}

th:nth-child(3),
th:last-child {
    text-align: center;
}

td {
    border-style: solid none;
    user-select: none;
    font-size: 1.5rem;
    line-height: 2.5;
    font-weight: 900;
    color: var(--wrWhiteStrong);
    position: relative;
}

h1 {
    margin-bottom: 3rem;
}

.invoiceForm {
    position: fixed;
    height: 100vh;
    width: 40%;
    background-color: var(--wrGreyStrong);
    color: var(--wrPurpleStrong);
    top: 0;
    left: 0;
    z-index: 89;
    padding: 2rem 2rem 2rem 10vw;
    border-radius: 0 3rem 3rem 0;
}

.invoiceForm.show {
    box-shadow: 1rem 1rem 100px 1000px rgba(0, 0, 0, 0.589);
}

.invoiceForm.hide {
    transform: translateX(-100%);
}

.form-container {
    width: 95%;
    height: 80%;
    overflow-y: scroll;
    padding-right: 1.5rem;
}

.form-container::-webkit-scrollbar {
    background-color: transparent;
    width: 10px;
}

.form-container::-webkit-scrollbar-thumb {
    background-color: var(--wrGreyWeak);
    width: 5px;
    border-radius: 5px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group>label {
    margin-bottom: 2rem;
}

.fg-input {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 1rem;
}

.fg-input input {
    height: 3rem;
    border-radius: 0.5rem;
    outline: none;
    border: none;
    background-color: var(--wrGreyWeak);
    border: 1px solid rgba(255, 255, 255, 0.052);
    box-shadow: inset rgba(0, 0, 0, 0.07) 0px 0px 6rem;
    color: var(--wrWhiteStrong) !important;
    font-weight: 700;
    font-size: 1.2rem;
    padding: 1.5rem 1rem;
    margin-bottom: 1rem;
}

select {
    background-color: var(--wrGreyWeak);
    color: var(--wrWhiteStrong) !important;
    padding: 1rem 1rem;
    border-radius: 0.5rem;
    border: none;
    border: 1px solid rgba(255, 255, 255, 0.052);
    box-shadow: inset rgba(0, 0, 0, 0.07) 0px 0px 6rem;
    outline: none;
    font-size: 1rem;
    margin-bottom: 1rem;
}

.fg-input label {
    color: var(--wrWhiteWeak);
    font-size: 1.1rem;
}

.by3,
.by2 {
    display: flex;
}

.by3 .fg-input {
    width: 30%;
    margin-right: 1.6rem;
}

.by2 .fg-input {
    width: 48%;
    margin-right: 1.5rem;
}
</style>
