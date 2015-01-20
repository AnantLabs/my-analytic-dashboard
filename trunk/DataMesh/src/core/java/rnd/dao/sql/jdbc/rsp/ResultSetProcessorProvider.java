package rnd.dao.sql.jdbc.rsp;

import rnd.dao.sql.jdbc.rsp.impl.ArrayResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.ListArrayResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.ListResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.MapArrayResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.MapListArrayResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.MapListResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.MapResultSetProcessor;
import rnd.dao.sql.jdbc.rsp.impl.UnitResultSetProcessor;

public interface ResultSetProcessorProvider {

	// Unit : It is a atomic value
	// Array : It is a horizontal row

	// List : It is a collection of Rows (Unit/Array)
	// Map : It map First Unit to rest Row (Unit/Array)

	ResultSetProcessor UnitResultSetProcessor = new UnitResultSetProcessor();

	ResultSetProcessor ArrayResultSetProcessor = new ArrayResultSetProcessor();

	ResultSetProcessor ListResultSetProcessor = new ListResultSetProcessor();

	ResultSetProcessor ListArrayResultSetProcessor = new ListArrayResultSetProcessor();

	ResultSetProcessor MapResultSetProcessor = new MapResultSetProcessor();

	ResultSetProcessor MapArrayResultSetProcessor = new MapArrayResultSetProcessor();

	ResultSetProcessor MapListResultSetProcessor = new MapListResultSetProcessor();

	ResultSetProcessor MapListArrayResultSetProcessor = new MapListArrayResultSetProcessor();

}