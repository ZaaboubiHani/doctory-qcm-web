import axios from "axios";

class Globals {
    static apiUrl = 
    // 'http://localhost:3000'
    'https://doctoryqcm.brokermarketing.dz'
    ;

}

class Api {
    constructor() {
        this.axiosInstance = this.createAxiosInstance();
        this.setupInterceptors();
    }

    static get instance() {
        if (!this._instance) {
            this._instance = new Api();
        }
        return this._instance;
    }

    createAxiosInstance() {
        return axios.create({
            baseURL: Globals.apiUrl,
            timeout: 50000,
        });
    }

    setupInterceptors() {
        this.axiosInstance.interceptors.request.use(
            (config) => {
               
                return config;
            },
            (error) => {
              
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            this.handleSuccess.bind(this),
            this.handleError.bind(this),
        );
    }

    handleSuccess(response) {
        return response;
    }

    async handleError(error) {
        return Promise.reject(error);
    }

    getAxios() {
        return this.axiosInstance;
    }
}

export default Api;