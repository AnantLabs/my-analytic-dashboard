package rnd.data.integration;

import java.util.Map;

public interface IntegrationService {

	<T> T send(String endPointURI, Map<String, String> headers, Object payLoad, Class<T> returnType);

	<T> T receive(String endPointURI, Class<T> returnType);

}