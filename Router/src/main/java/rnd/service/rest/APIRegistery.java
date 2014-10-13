package rnd.service.rest;

import rnd.ApplicationContextProvider;
import rnd.data.route.DataRouter;

public class APIRegistery {

	public static DataRouter getAPIProvider(String version, String url, APIMethod method) {
		return ApplicationContextProvider.get().getBean(DataRouter.class);
	}

}
