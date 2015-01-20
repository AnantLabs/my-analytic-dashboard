package rnd.data.integrator;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Map;

import rnd.data.process.AbstractDataProcessor;

public class FileIntegrator extends AbstractDataProcessor<Map, Map> {

	@Override
	public Object process(Map requestPayLoad, Map responsePayLoad) throws Throwable {

		InputStream is = new FileInputStream("E:/Vinod/MyLab/MyDashboard/Sample/" + requestPayLoad.get("integrate:param1") + ".xls");
		return is;

		// responsePayLoad.put("type", "File");
		// responsePayLoad.put("name", requestPayLoad.get("integrate:param1"));
		//
		// return responsePayLoad;

	}

}