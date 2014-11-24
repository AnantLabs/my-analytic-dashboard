package rnd.integration.camel;

import java.util.Map;
import java.util.Map.Entry;

import org.apache.camel.CamelContext;
import org.apache.camel.ConsumerTemplate;
import org.apache.camel.Exchange;
import org.apache.camel.ProducerTemplate;
import org.apache.camel.impl.DefaultExchange;
import org.springframework.beans.factory.annotation.Autowired;

import rnd.integration.IntegrationService;
import rnd.util.AppConfig;

public class CamelIntegrationService implements IntegrationService {

	private CamelContext camelContext;

	private ProducerTemplate template;

	private ConsumerTemplate consumerTemplate;

	@Autowired
	public CamelIntegrationService(CamelContext camelContext, ProducerTemplate template, ConsumerTemplate consumerTemplate) {

		this.camelContext = camelContext;

		this.template = template;
		this.consumerTemplate = consumerTemplate;
	}

	public <T> T send(String endPointURI, Map<String, String> headers, Object payLoad, Class<T> returnType) {

		Exchange exchange = createExchange(headers, payLoad);

		T responsePayLoad = (T) template.send(endPointURI, exchange).getOut().getBody(returnType);

		if (responsePayLoad == null) {
			responsePayLoad = exchange.getIn().getBody(returnType);
		}

		return responsePayLoad;

	}

	private Exchange createExchange(Map<String, String> headers, Object payLoad) {
		Exchange exchange = new DefaultExchange(camelContext);
		exchange.getIn().setBody(payLoad);

		if (headers != null) {
			for (Entry<String, String> header : headers.entrySet()) {
				exchange.getIn().setHeader(header.getKey(), header.getValue());
			}
		}
		return exchange;
	}

	public <T> T receive(String endPointURI, Class<T> returnType) {

		int retryLimit = AppConfig.getPropertyAsInt("IntegrationRetryLimit");
		int timeout = AppConfig.getPropertyAsInt("IntegrationReceiveTimeout");

		for (int retryAttempt = 0; retryAttempt <= retryLimit; retryAttempt++) {
			Exchange exchange = consumerTemplate.receive(endPointURI, timeout);
			if (exchange != null) {
				T result = exchange.getIn().getBody(returnType);
				consumerTemplate.doneUoW(exchange);
				return result;
			}
		}

		return null;
	}

}
