package rnd.dao.sql;

import rnd.dao.DataAccessObject;

public interface SQLDataAccessObject<T extends SQLDAOContext> extends DataAccessObject {

	// Object select(String[] fieldsNames, String from, String where, Object[] params, T ctx);

}