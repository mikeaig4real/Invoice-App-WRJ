<template>
    <div class="invoices-container">
        <div v-if="isLoading">
            <h1>Loading...</h1>
        </div>
        <header v-if="!isLoading">
            <div class="heading">
                <h1>Invoices</h1>
                <p>{{`${items?.length ? `There are ${items?.length} total invoice(s)`:`No Invoices` }`}}</p>
            </div>
            <div class="control">
                <b-dropdown variant="transparent" no-caret>
                    <template #button-content>
                        <strong>Filter by status</strong>
                        <img src="../assets/icon-arrow-down.svg">
                    </template>
                    <b-dropdown-item @click="filterItems({type:'draft'})">Draft</b-dropdown-item>
                    <b-dropdown-item @click="filterItems({type:'pending'})">Pending</b-dropdown-item>
                    <b-dropdown-item @click="filterItems({type:'paid'})">Paid</b-dropdown-item>
                    <b-dropdown-item @click="filterItems({type:'all'})">All</b-dropdown-item>
                </b-dropdown>
                <div @click="createNew()" class="button">
                    <div class="icon">
                        <img src="../assets/icon-plus.svg">
                    </div>
                    <div class="text">
                        New Invoice
                    </div>
                </div>
            </div>
        </header>
        <div v-if="!isLoading && !items?.length" class="emptyInvoices">
            <img src="../assets/illustration-empty.svg">
        </div>
        <table v-if="!isLoading && items?.length">
            <thead>

            </thead>
            <tbody>
                <tr v-for="({id,paymentDue,clientName,total,status,sortId},index) in items" :key="index"
                    class="bg-white border-b">
                    <td>{{`#${id}`}}</td>
                    <td>
                        {{formatDate({date:paymentDue})}}
                    </td>
                    <td>
                        {{clientName}}
                    </td>
                    <td>
                        {{formatAmount({total})}}
                    </td>
                    <td>
                        <div :class="getClass({type:'btn',status})">
                            <p :class="getClass({type:'text',status})">
                                <span class="status-dot">.</span>
                                {{status}}
                            </p>
                        </div>
                        <span @click="goToInvoice({sortId, id})" class="arrow-right">
                            <img src="../assets/icon-arrow-right.svg">
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex';

import moment from 'moment';

export default {
    name: 'invoices',
    data() {
        return {
            items: null
        }
    },
    computed: {
        ...mapState([
            'invoices',
            'isLoading',
        ]),
    },
    methods: {
        ...mapActions([
            'toggleForm',
            'setInvoice',
            'resetInvoice',
            'toggleEdit',
            'getInvoicesOut',
        ]),
        formatDate({ date, text = 'Due' }) {
            return moment(date).format(`[${text}] D MMM YYYY`);
        },
        formatAmount({ total }) {
            const converted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
            return converted.replace('$', '€ ');
        },
        getClass({ type, status }) {
            const typeMap = {
                btn: `status-btn ${status}`,
                text: `status-text ${status}`
            };
            return typeMap[type];
        },
        filterItems({ type }) {
            if (type === 'all') {
                this.items = this.invoices;
                return;
            };
            this.items = this.invoices.filter((invoice) => invoice.status === type);
        },
        goToInvoice({ sortId, id }) {
            this.$router.push({ name: 'invoice', params: { id, sortId } });
        },
        createNew() {
            this.toggleEdit({ editValue: false });
            this.toggleForm({ formValue: true });
        }
    },
    async created() {
        try {
            this.items = await this.getInvoicesOut({});
        } catch (error) {
            alert(error);
        }
    },
}
</script>

<style scoped>
.invoices-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 60%;
    max-height: 90%;
    margin: auto;
    margin-top: 4rem;
    padding: 1rem 0;
}

.emptyInvoices {
    margin-top: 8rem;
}

header {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.heading {
    width: 30%;
    display: flex;
    flex-direction: column;
}

.control {
    width: 40%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.button {
    width: 50%;
    padding: 2rem 0;
    border-radius: 5rem;
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    position: relative;
}

.icon {
    background-color: white;
    padding: 0.5rem;
    border-radius: 50%;
    position: absolute;
    left: 1.5rem;
    bottom: 1.5rem;
    transform: scale(1.5);
}

.button .text {
    font-size: 1.5rem;
    margin-left: 3rem;
}

strong {
    color: var(--wrWhiteStrong) !important;
    margin-right: 1rem !important;
}

table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    margin-top: 0;
}

td {
    border: solid 1px var(--wrGreyWeak);
    border-style: solid none;
    padding: 1rem;
    background-color: var(--wrGreyWeak);
    color: var(--wrWhiteStrong);
    user-select: none;
}

td:first-child {
    border-left-style: solid;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}

td:last-child {
    border-right-style: solid;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

td>div {
    outline: none;
    position: relative;
    border: none;
    width: 90%;
    border-radius: 0.5rem;
    text-transform: capitalize;
    font-weight: bold;
    text-align: center;
    overflow: hidden;
    user-select: none;
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

td>div>p {
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
