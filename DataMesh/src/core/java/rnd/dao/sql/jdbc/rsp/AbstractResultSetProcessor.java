package rnd.dao.sql.jdbc.rsp;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;

import rnd.dao.sql.jdbc.rp.RowProcessor;
import rnd.dao.sql.jdbc.rsmdp.ResultSetMetaDataProcessor;

/**
 * @author Vinod.Pahuja
 */
public abstract class AbstractResultSetProcessor implements ResultSetProcessor {

	protected AbstractResultSetProcessor() {
	}

	public final Object processResultSet(ResultSet rs, ResultSetMetaDataProcessor rsmdp) throws SQLException {

		ResultSetMetaData rsmd = rs.getMetaData();

		RowProcessor rp = getRowProcessor(rsmd);

		Object rspResult = processRowSet(rs, rp);

		if (rsmdp != null) {
			Object rsmdpResult = rsmdp.processResultSetMetaData(rsmd);
			return new Object[] { rsmdpResult, rspResult };
		}
		return rspResult;
	}

	protected abstract RowProcessor getRowProcessor(ResultSetMetaData rsmd);

	protected abstract Object processRowSet(ResultSet rs, RowProcessor rowProcessor) throws SQLException;

}