package rnd.dao.sql.jdbc.rsp;

import java.sql.ResultSet;
import java.sql.SQLException;

import rnd.dao.sql.jdbc.rsmdp.ResultSetMetaDataProcessor;

public interface ResultSetProcessor {

	Object processResultSet(ResultSet rs, ResultSetMetaDataProcessor resultSetMetaDataProcessor) throws SQLException;

}
