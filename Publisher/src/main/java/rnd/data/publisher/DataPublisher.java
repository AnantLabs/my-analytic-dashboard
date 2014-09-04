package rnd.data.publisher;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import rnd.util.AppConfig;
import rnd.util.UXJacksonUtils;

@Controller
public class DataPublisher extends AbstractDataPublisher {

	@RequestMapping(value = "/data", method = RequestMethod.POST)
	public @ResponseBody
	String getData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		Map requestPayLoad = parseRequest(request);

		Object responseData = processRequest(requestPayLoad, AppConfig.getProperty("APPLICATION"), "data", response, new HashMap());

		if (responseData instanceof String) { return (String) responseData; }

		return UXJacksonUtils.convertToJSON(responseData);
	}

}
