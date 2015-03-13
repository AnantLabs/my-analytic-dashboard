package rnd.data.extract.sql.jdbc;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import rnd.dao.sql.jdbc.JDBCDataAccessObject;
import rnd.dao.sql.jdbc.rsmdp.RSMDProcessorProvider;
import rnd.dao.sql.jdbc.rsp.ResultSetProcessorProvider;
import rnd.data.process.AbstractDataProcessor;

public class JDBCExtractor extends AbstractDataProcessor<Map, Map> {

	private static JDBCDataAccessObject dao = new JDBCDataAccessObject();

	@Override
	public Map process(Map requestPayLoad) throws Throwable {

		Connection conn = (Connection) getDelegate().process(requestPayLoad);

		String sql = (String) requestPayLoad.get("sql");
		Object[] params = (Object[]) requestPayLoad.get("params");

		Object[] result = (Object[]) dao.executeQuery(sql, params, ResultSetProcessorProvider.ListArrayResultSetProcessor, RSMDProcessorProvider.NameRSMDProcessor, conn, true);

		Map responseData = new HashMap();

		responseData.put("headers", result[0]);
		responseData.put("data", result[1]);

		return responseData;

	}

}