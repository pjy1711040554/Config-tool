import axios from "axios";
axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/json';


axios.interceptors.request.use(
	function(config) {
		config.headers = {
			'X-Uid': "",
			'X-Authorization':  "",
			'X-APP-ID': "",
			'X-APP-CHANNEL': "",
			'X-APP-VERSION': "",
			'X-Language':  ""
		};
		return config;
	},
	function(error) {
		// Do something with request error
		return Promise.reject(error);
	}
);
export default axios;
