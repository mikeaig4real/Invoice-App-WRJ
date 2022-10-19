const setItem = ({ commit }, payload = {}) => {
    commit('setItem', payload);
}
const getItem = ({ commit }, payload = {}) => {
    commit('getItem', payload);
}
const setError = ({ commit }, payload = {}) => {
    commit('setError', payload);
}
const toggleForm = ({ commit }, payload) => {
    commit('toggleForm', payload);
}
const toggleEdit = ({ commit }, payload) => {
    commit('toggleEdit', payload);
}
const addItemToInvoice = ({ commit }, payload) => {
    commit('addItemToInvoice', payload);
}
const removeItemFromInvoice = ({ commit }, payload) => {
    commit('removeItemFromInvoice', payload);
}
const calculateItemTotal = ({ commit }, payload) => {
    commit('calculateItemTotal', payload);
}
const resetInvoice = ({ commit }, payload) => {
    commit('resetInvoice', payload);
}
const setInvoice = ({ commit }, payload) => {
    commit('setInvoice', payload);
}
const clearLocalInvoice = ({ commit }, payload) => {
    commit('clearLocalInvoice', payload);
}
const editOneInvoice = ({ commit }, payload) => {
    commit('editOneInvoice', payload);
}
const addToInvoices = ({ commit }, payload) => {
    commit('addToInvoices', payload);
}
const setInvoices = ({ commit }, payload) => {
    commit('setInvoices', payload);
}

const makeApiCall = async ({ state, commit }, { urlSuffix, params = {}, method, data = {}, setAs = '', toLocal = false }) => {
    try {
        commit('setIsLoading', { isLoading: true });
        const { data: response } = await state.caller({ method, url: `${state.baseUrl}${urlSuffix}`, params, data });
        if (response.error) {
            throw new Error(response.message);
        };
        setAs && setAs !== 'invoice' && commit('setItem', { item: response[setAs], itemName: setAs, toLocal });
        return response[setAs];
    } catch ({ response: { data: { message } } }) {
        throw new Error(message);
    } finally {
        commit('setIsLoading', { isLoading: false });
    };
}

export default {
    toggleForm,
    toggleEdit,
    addItemToInvoice,
    removeItemFromInvoice,
    calculateItemTotal,
    resetInvoice,
    setInvoice,
    clearLocalInvoice,
    editOneInvoice,
    addToInvoices,
    setInvoices,
    makeApiCall,
    setItem,
    getItem,
    setError,
    createInvoice: async ({ commit, state }, { invoice }) => {
        try {
            const newInvoice = await makeApiCall({ state, commit }, {
                urlSuffix: '/invoice',
                method: 'post',
                data: invoice
            });
            return newInvoice;
        } catch (error) {
            throw new Error(error);
        }
    },
    getInvoicesOut: async ({ commit, state }, { status }) => {
        try {
            const invoices = await makeApiCall({ state, commit }, {
                urlSuffix: '/invoice',
                method: 'get',
                setAs: 'invoices',
                toLocal: false,
                params: { status, limit: 1000 }
            });
            return invoices;
        } catch (error) {
            throw new Error(error);
        }
    },
    getInvoiceOut: async ({ commit, state }, { id }) => {
        try {
            const invoice = await makeApiCall({ state, commit }, {
                urlSuffix: '/invoice',
                method: 'get',
                setAs: 'invoice',
                params: { id }
            });
            return invoice;
        } catch (error) {
            throw new Error(error);
        }
    },
    updateInvoice: async ({ state, commit }, { id, markAsPaid, invoice }) => {
        try {
            const updatedInvoice = await makeApiCall({ state, commit }, {
                urlSuffix: `/invoice`,
                method: 'patch',
                params: { id, markAsPaid, invoice },
                setAs: 'invoice',
                returnValue: true,
            });
            return updatedInvoice;
        } catch (error) {
            throw new Error(error);
        }
    },
    deleteInvoice: async ({ state, commit }, { id }) => {
        try {
            await makeApiCall({ state, commit }, {
                urlSuffix: `/invoice`,
                method: 'delete',
                params: { id },
            });
        } catch (error) {
            throw new Error(error);
        }
    },
}