import axios, {AxiosRequestConfig} from "axios";

class ApiService {
  axiosInstance = axios.create({
    baseURL: '/api',
  });
  auth = {
    accessToken: '',
    refreshToken: '',
  }

  getChannels() {
    return this.callApi('GET', '/channels');
  }

  async callApi(method: string, endpoint: string, data: any = {}, config?: AxiosRequestConfig, ignoreAuth = false) {
    try {
      const r = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        headers: {
          Authorization: this.auth.accessToken ? `Bearer ${this.auth.accessToken}` : undefined,
        },
        ...config,
      });
      return r.data;
    } catch (e) {
      if (e.response) {
        if (e.response.data) throw e.response.data;
        throw e.response;
      } else {
        throw e;
      }
    }
  }
}

export default new ApiService();
