package rnd.data.transform.jdbc;

import rnd.data.process.DataProcessor.DataProcessorCallback.DataProcessorCallbackContext;

public class JDBCDataMapperCallbackContext implements DataProcessorCallbackContext {

	private JDBCInfo jdbcInfo;

	private JDBCResponsePayLoad jdbcResponsePayLoad;

	public JDBCDataMapperCallbackContext(JDBCInfo jdbcInfo, JDBCResponsePayLoad jdbcResponsePayLoad) {
		this.jdbcInfo = jdbcInfo;
		this.jdbcResponsePayLoad = jdbcResponsePayLoad;
	}

	public JDBCInfo getJDBCInfo() {
		return jdbcInfo;
	}

	public JDBCResponsePayLoad getJDBCResponsePayLoad() {
		return jdbcResponsePayLoad;
	}

}