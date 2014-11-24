package rnd.service.rest;

public class API {

	private String version;
	private APIMethod method;

	private String baseURL;
	private String resource = "";

	public API() {
	}

	public API(String version, String baseURL, String resource, APIMethod method) {
		this.version = version;
		this.baseURL = baseURL;
		this.resource = resource;
		this.method = method;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public APIMethod getMethod() {
		return method;
	}

	public void setMethod(APIMethod method) {
		this.method = method;
	}

	public String getBaseURL() {
		return baseURL;
	}

	public void setBaseURL(String baseURL) {
		this.baseURL = baseURL;
	}

	public String getResource() {
		return resource;
	}

	public void setResource(String resource) {
		this.resource = resource;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof API)) {
			return false;
		}
		API api = (API) obj;
		return (version + baseURL + resource).equals(api.version + api.baseURL + api.resource);
	}

	@Override
	public int hashCode() {
		return (version + baseURL + resource).hashCode();
	}

}