package rnd.data.route;

import rnd.data.process.DataProcessorFactory;

public interface DataRouter {

	DataProcessorFactory getDataProcessorFactory();

	Object sendDataRequest(String resource, Object requestPayLoad) throws Throwable;

	Object receiveDataResponse(String resource, Object requestPayLoad, Object responsePayLoad) throws Throwable;

}