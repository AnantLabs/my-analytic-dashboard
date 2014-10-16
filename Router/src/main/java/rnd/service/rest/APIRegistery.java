package rnd.service.rest;

import rnd.data.route.DataRouter;
import rnd.util.ApplicationContextProvider;

public class APIRegistery {

	public static DataRouter getAPIProvider(String version, String url, APIMethod method) {
		return ApplicationContextProvider.get().getBean(DataRouter.class);
	}

}
