
import axios from 'axios'

export default {
     invoices: null,
     invoice: null,
     wasError: false,
     errorMsg: '',
     isLoading: false,
     timeout: null,
     showForm: false,
     edit: false,
     baseUrl: 'http://localhost:8082/api/v1',
     caller: axios,
}