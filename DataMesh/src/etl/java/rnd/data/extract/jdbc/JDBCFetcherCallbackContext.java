package rnd.data.extract.jdbc;

import rnd.data.process.DataProcessor.DataProcessorCallback.DataProcessorCallbackContext;

public class JDBCFetcherCallbackContext implements DataProcessorCallbackContext {

	private JDBCInfo jdbcInfo;

	private JDBCResponsePayLoad jdbcResponsePayLoad;

	public JDBCFetcherCallbackContext(JDBCInfo jdbcInfo, JDBCResponsePayLoad jdbcResponsePayLoad) {
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