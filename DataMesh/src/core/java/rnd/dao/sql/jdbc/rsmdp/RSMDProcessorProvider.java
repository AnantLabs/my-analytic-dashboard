package rnd.dao.sql.jdbc.rsmdp;

import rnd.dao.sql.jdbc.rsmdp.impl.NameRSMDProcessor;

public interface RSMDProcessorProvider {

	ResultSetMetaDataProcessor NameRSMDProcessor = new NameRSMDProcessor(); 

}