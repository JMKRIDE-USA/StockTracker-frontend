//const backend_ip_and_port = "http://192.168.1.166:3600"
const backend_ip_and_port = "https://backend.stocktracker.jmkride-internal.link"
//const backend_ip_and_port = "http://192.168.1.8:3600"
const config = {
  backend_url: backend_ip_and_port + "/api/v1/",
  backend_url_v2: backend_ip_and_port + "/api/v2/",
  endpoint_prefixes: {
    v1: "/api/v1/",
    v2: "/api/v2/",
  },
};
export default config;
