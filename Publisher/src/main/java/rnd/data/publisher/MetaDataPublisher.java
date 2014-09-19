package rnd.data.publisher;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import rnd.data.router.AbstractDataRouter;
import rnd.util.AppConfig;
import rnd.util.JacksonUtils;

@SuppressWarnings("unchecked")
public class MetaDataPublisher extends AbstractDataRouter {

	public String getMetaData(HttpServletRequest request, HttpServletResponse response) throws Throwable {

		Map requestPayLoad = parseRequest(request, Map.class);

		String screenId = (String) requestPayLoad.get("screenId");

		String metaModel = receiveFile(AppConfig.getProperty("META_MODEL_REPOSITORY_TYPE"), AppConfig.getProperty("META_MODEL_REPOSITORY_END_POINT_URI"), screenId + ".json", "");

		if (metaModel == null) { throw new Exception("This screen is not implemented"); }

		Map<String, Object> metaModelMap = JacksonUtils.convertFromJSON(metaModel, Map.class);

		metaModelMap.put("screenId", screenId);

		metaModel = JacksonUtils.convertToJSON(metaModelMap);

		return metaModel;
	}

	private String receiveFile(String property, String property2, String string, String string2) {
		return null;
	}

}
