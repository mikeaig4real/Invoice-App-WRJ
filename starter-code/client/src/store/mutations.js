import data from '@/data'


const setError = (state, { message }) => {
    state.wasError = true;
    state.errorMsg = message;
    alert(message);
};

const setIsLoading = (state, { isLoading }) => {
    state.isLoading = isLoading;
};

const setItem = (state, { item, itemName, toLocal = false }) => {
    state[itemName] = item;
    toLocal && localStorage.setItem(itemName, JSON.stringify(item));
};

const getItem = (state, { itemName }) => {
    const storedItem = JSON.parse(localStorage.getItem(itemName));
    if (!storedItem) return storedItem;
    state[itemName] = storedItem;
    return storedItem;
};

const calculateItemTotal = (state, { index }) => {
    state.invoice.items[index].total = Number(state.invoice.items[index].quantity) * Number(state.invoice.items[index].price);
}

const toggleForm = (state, { formValue }) => {
    state.showForm = formValue;
}

const toggleEdit = (state, { editValue }) => {
    state.edit = editValue;
}

const addItemToInvoice = (state) => {
    state.invoice.items.push(
        {
            "name": "",
            "quantity": "",
            "price": "",
            "total": "",
        }
    )
}
const removeItemFromInvoice = (state, { index }) => {
    state.invoice.items = state.invoice.items.filter((invoice, idx) => idx !== index)
}

const resetInvoice = (state) => {
    state.invoice = data.emptyInvoice;
}

const setInvoice = (state, payload) => {
    state.invoice = payload;
}

const clearLocalInvoice = (state) => {
    localStorage.removeItem('invoice');
}

const editOneInvoice = (state, payload) => {
    state.invoice = payload;
}

export default {
    calculateItemTotal,
    setIsLoading,
    setError,
    setItem,
    getItem,
    toggleForm,
    toggleEdit,
    addItemToInvoice,
    removeItemFromInvoice,
    resetInvoice,
    setInvoice,
    clearLocalInvoice,
    editOneInvoice,
}