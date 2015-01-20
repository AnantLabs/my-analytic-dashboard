package rnd.data.integrator.sql.jdbc;

import java.sql.Connection;
import java.util.Map;

import rnd.data.process.AbstractDataProcessor;

public class JDBCIntegrator extends AbstractDataProcessor<Map, Map> {

	private Connection getConnection(String data_source) {
		return null;
	}

	@Override
	public Object process(Map requestPayLoad, Map responsePayLoad) throws Throwable {
		return getConnection((String) requestPayLoad.get("datasource"));
	}

}