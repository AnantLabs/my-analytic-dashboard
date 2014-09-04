package rnd.data.publisher;

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
@SuppressWarnings("unchecked")
public class MetaDataPublisher extends AbstractDataPublisher {

	@RequestMapping(value = "/metadata", method = RequestMethod.POST)
	public @ResponseBody
	String getMetaData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		Map requestPayLoad = parseRequest(request, Map.class);

		String screenId = (String) requestPayLoad.get("screenId");

		String metaModel = receiveFile(AppConfig.getProperty("META_MODEL_REPOSITORY_TYPE"), AppConfig.getProperty("META_MODEL_REPOSITORY_END_POINT_URI"), screenId + ".json", "");

		if (metaModel == null) { throw new Exception("This screen is not implemented"); }

		Map<String, Object> metaModelMap = UXJacksonUtils.convertFromJSON(metaModel, Map.class);

		metaModelMap.put("screenId", screenId);

		metaModel = UXJacksonUtils.convertToJSON(metaModelMap);

		return metaModel;
	}

	private String receiveFile(String property, String property2, String string, String string2) {
		return null;
	}

}
