<template>
    <div class="invoice-container">
        <div v-if="isLoading">
            <h1>Loading...</h1>
        </div>
        <div v-if="!isLoading && item" :class="showDelPrompt ? 'delPrompt' : 'delPrompt hide'">
            <h1>Confirm Deletion</h1>
            <p>Are you sure you want to delete invoice #{{item.id}}? This action cannot be undone</p>
            <div class="control">
                <div class="buttonEdit">
                    <div @click="toggleDelPrompt()" class="text">
                        Cancel
                    </div>
                </div>
                <div @click="deleteOne({id:item.id})" class="buttonDel">
                    <div class="text">
                        Delete
                    </div>
                </div>
            </div>
        </div>
        <header v-if="!isLoading && item">
            <div class="heading">
                <div class="back">
                    <span @click="goToInvoices()" class="arrow-right">
                        <img src="../assets/icon-arrow-left.svg">
                    </span>
                    <h2>Go Back</h2>
                </div>
                <h2>Status</h2>
                <div :class="getClass({type:'btn',status:item.status})">
                    <p :class="getClass({type:'text',status:item.status})">
                        <span class="status-dot">.</span>
                        {{item.status}}
                    </p>
                </div>
            </div>
            <div class="control">
                <div @click="editInvoice()" class="buttonEdit">
                    <div class="text">
                        Edit
                    </div>
                </div>
                <div @click="toggleDelPrompt()" class="buttonDel">
                    <div class="text">
                        Delete
                    </div>
                </div>
                <div @click="markAsPaid({id:item.id})" class="button">
                    <div class="text">
                        Mark As Paid
                    </div>
                </div>
            </div>
        </header>
        <main v-if="!isLoading && item">
            <section>
                <article class="info">
                    <div>
                        <div class="id">
                            <span>#</span>
                            <h2>{{item.id}}</h2>
                        </div>
                        <div class="body2">
                            <p>{{item?.description || 'None Specified'}}</p>
                        </div>
                    </div>
                    <div>
                        <div class="body2">
                            <p>Invoice Date</p>
                        </div>
                        <h2>{{formatDate({date:item.createdAt})}}</h2>
                    </div>
                    <div>
                        <div class="body2">
                            <p>Payment Due</p>
                        </div>
                        <h2>{{formatDate({date:item.paymentDue})}}</h2>
                    </div>
                </article>
                <article class="address">
                    <div>
                        <div class="body2">
                            <p>Bill To</p>
                        </div>
                        <h2>{{item.clientName}}</h2>
                        <br>
                        <div class="body2">
                            <p>{{item?.clientAddress?.street || 'None Specified'}}</p>
                        </div>
                        <div class="body2">
                            <p>{{item?.clientAddress?.city || 'None Specified'}}</p>
                        </div>
                        <div class="body2">
                            <p>{{item?.clientAddress?.postCode || 'None Specified'}}</p>
                        </div>
                        <div class="body2">
                            <p>{{item?.clientAddress?.country || 'None Specified'}}</p>
                        </div>
                    </div>
                    <div>
                        <div class="body2">
                            <p>Sent To</p>
                        </div>
                        <h2>{{item?.clientEmail || 'None Specified'}}</h2>
                    </div>
                    <div class="sender">
                        <div class="body2">
                            <p>{{item?.senderAddress?.street || 'None Specified'}}</p>
                        </div>
                        <div class="body2">
                            <p>{{item?.senderAddress?.city || 'None Specified'}}</p>
                        </div>
                        <div class="body2">
                            <p>{{item?.senderAddress?.postCode || 'None Specified'}}</p>
                        </div>
                        <div class="body2">
                            <p>{{item?.senderAddress?.country || 'None Specified'}}</p>
                        </div>
                    </div>
                </article>
            </section>
            <table v-if="item?.items?.length">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>QTY.</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="({name,quantity,price,total},index) in item.items" :key="index">
                        <td>{{name}}</td>
                        <td>{{quantity}}</td>
                        <td>{{formatAmount({total:price})}}</td>
                        <td>{{formatAmount({total})}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="sumTotal">
                <h2>Amount Due</h2>
                <h1>{{formatAmount({total:item.total})}}</h1>
            </div>
        </main>
    </div>
</template>

<script>

import { mapGetters, mapActions, mapState } from 'vuex';

import moment from 'moment'

export default {
    name: 'invoice',
    props: ['id'],
    data() {
        return {
            item: null,
            showDelPrompt: false,
        }
    },
    computed: {
        ...mapState([
            'isLoading',
            'invoices',
        ]),
    },
    methods: {
        ...mapGetters([
            'getInvoicesIn',
            'getInvoice'
        ]),
        ...mapActions([
            'deleteInvoice',
            'markInvoiceAsPaid',
            'editOneInvoice',
            'toggleEdit',
            'toggleForm',
            'setPrevInvoice',
            'updateInvoice',
            'getInvoiceOut',
            'getInvoicesOut'
        ]),
        getClass({ type, status }) {
            const typeMap = {
                btn: `status-btn ${status}`,
                text: `status-text ${status}`
            };
            return typeMap[type];
        },
        formatDate({ date, text = 'Due' }) {
            return moment(date).format(`[${text}] D MMM YYYY`);
        },
        async goToInvoices() {
            try {
                await this.getInvoicesOut({});
                this.$router.push({ name: 'invoices' })
            } catch (error) {
                alert(error);
                this.$router.push({ name: 'invoices' })
            }
        },
        formatAmount({ total }) {
            const converted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
            return converted.replace('$', '€ ');
        },
        async markAsPaid({ id }) {
            const preStatus = this.item.status;
            try {
                await this.updateInvoice({ id, markAsPaid: true });
                this.item.status = 'paid';
            } catch (error) {
                alert(error);
                this.$router.push({ name: 'invoices' });
                this.item.status = preStatus;
            }
        },
        toggleDelPrompt() {
            this.showDelPrompt = !this.showDelPrompt;
        },
        async deleteOne({ id }) {
            try {
                await this.deleteInvoice({ id });
                await this.getInvoicesOut({});
                this.$router.push({ name: 'invoices' });
            } catch (error) {
                this.$router.push({ name: 'invoices' });
                alert(error);
            }
        },
        editInvoice() {
            this.editOneInvoice(this.item);
            this.toggleEdit({ editValue: true });
            this.toggleForm({ formValue: true });
        }
    },
    async created() {
        try {
            this.item = await this.getInvoiceOut({ id: this.id });
        } catch (error) {
            this.$router.push({ name: 'invoices' });
            alert(error);
        }
    }
}
</script>

<style scoped>
.delPrompt {
    position: absolute;
    width: 50%;
    height: 35%;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    justify-content: space-around;
    background-color: var(--wrGreyWeak);
    box-shadow: 1rem 1rem 100px 1000px rgba(0, 0, 0, 0.589);
    z-index: 99;
}

.delPrompt .control {
    width: 100%;
    justify-content: flex-end;
}

.delPrompt .buttonEdit {
    background-color: rgba(255, 255, 255, 0.065) !important;
}

.delPrompt.hide {
    transform: scale(0);
}

.sumTotal {
    background-color: var(--wrBlackStrong);
    width: 100%;
    border-radius: 0 0 1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 3rem;
}

.sumTotal>h2 {
    font-size: 1.3rem !important;
    font-weight: 300 !important;
}

.body2>p {
    font-size: 1.5rem !important;
    color: var(--wrWhiteWeak) !important;
}

.info {
    display: flex;
    flex-direction: column;
    width: 30%;
}

.address {
    display: flex;
    width: 50%;
    justify-content: space-between;
    position: absolute;
    right: 12rem;
    bottom: -1rem;
}

.address>div {
    transform: scale(0.85);
}

.sender {
    position: absolute;
    right: -13rem;
    top: -5rem;
    text-align: right;
}

article>div {
    margin-bottom: 2rem;
}

.id {
    display: flex;
    margin-bottom: 1rem;
}

.id span {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.663);
}

main {
    width: 100%;
    border-radius: 1rem;
    background-color: var(--wrGreyWeak);
    padding: 4rem;
    color: var(--wrWhiteStrong);
}

section {
    display: flex;
    align-items: flex-end;
    position: relative;
}

.invoice-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 60%;
    max-height: 90%;
    margin: auto;
    margin-top: 4rem;
    padding: 1rem 0;
    position: relative;
}

header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin: 2rem 0;
    background-color: var(--wrGreyWeak);
    padding: 2rem 2rem;
    border-radius: 1rem;
}

.heading {
    width: 30%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
}

.back {
    position: absolute !important;
    top: -6rem;
    left: -5rem;
    display: flex;
}

.back span {
    position: absolute;
    left: -8rem;
    top: 0;
}

.control {
    width: 50%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.button,
.buttonEdit,
.buttonDel {
    padding: 1.5rem 0;
    border-radius: 5rem;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: relative;
}

.button {
    width: 40%;
}

.buttonDel {
    width: 35%;
    margin-right: 1rem;
}

.buttonEdit {
    width: 30%;
    margin-right: 1rem;
}

.button .text,
.buttonEdit .text,
.buttonDel .text {
    font-size: 1.3rem;
}

strong {
    color: var(--wrWhiteStrong) !important;
    margin-right: 1rem !important;
}

table {
    width: 100%;
    border-radius: 1rem 1rem 0 0;
    border-collapse: separate;
    padding: 2rem 3rem;
    border-spacing: 0 10px;
    margin-top: 0;
    background-color: rgba(240, 255, 255, 0.108);
}

th {
    font-size: 1.3rem;
    line-height: 2;
    font-weight: 100;
    color: var(--wrWhiteWeak);
}

th:not(:first-child),
td:not(:first-child) {
    text-align: right;
}

td {
    border-style: solid none;
    user-select: none;
    font-size: 1.5rem;
    line-height: 2.5;
    font-weight: 900;
    color: var(--wrWhiteStrong);
}

.heading {
    display: flex;
    position: relative;
}

.heading>div {
    outline: none;
    position: relative;
    border: none;
    user-select: none;
    width: 60%;
    border-radius: 0.5rem;
    text-transform: capitalize;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.status-btn.pending {
    background-color: rgba(130, 84, 0, 0.508);
}

.status-btn.draft {
    background-color: rgba(255, 255, 255, 0.078);
}

.status-btn.paid {
    background-color: rgba(48, 248, 85, 0.438);
}

.heading>div>p {
    align-self: center;
    justify-self: center;
    margin-top: 1rem;
    z-index: 55;
    position: relative;
}

.status-text.draft {
    color: white;
}

.status-text.pending {
    color: rgb(255, 166, 0) !important;
}

.status-text.paid {
    color: rgb(0, 22, 0) !important;
    z-index: 55;
}

.status-dot {
    position: absolute;
    transform: scale(3);
    left: -0.7rem;
    bottom: 0.6rem;
    z-index: 55;
}

.arrow-right {
    position: absolute;
    right: 0.5rem;
    cursor: pointer;
}

.arrow-right:hover {
    transform: scale(1.2)
}
</style>
