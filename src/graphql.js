/* jshint esversion: 6 */

import axios from 'axios'
class GraphQLClient {
    TIMEOUT = 20000;

	constructor(options) {
		const defaultOpt = {
			timeout: this.TIMEOUT,
			method: 'POST'
		};
		this.options = { 
            ...defaultOpt, 
            ...options,
        };
	}

	request(data) {
		this.options.data = data;
		return axios(this.options).then(res => {
			const d = res.data;
			if (d.errors) {
				throw d.errors[0];
			}
			return d.data;
		});
	}
}

export default GraphQLClient;
