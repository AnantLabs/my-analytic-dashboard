package rnd.service.rest;

import java.util.HashMap;
import java.util.Map;

public class APIRegistry {

	private Map<API, API> dependencies = new HashMap<API, API>();

	public void setDependencies(Map<API, API> dependencies) {
		this.dependencies = dependencies;
	}

	public API getDependency(API api) {
		return dependencies.get(api);
	}

}