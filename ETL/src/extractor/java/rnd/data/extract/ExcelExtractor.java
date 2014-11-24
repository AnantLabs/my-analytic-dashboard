package rnd.data.extract;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import rnd.data.process.AbstractDataProcessor;
import rnd.util.IOUtils;

@SuppressWarnings("unchecked")
public class ExcelExtractor extends AbstractDataProcessor<Map, Map> {

	@Override
	public Object processRequest(Map requestPayLoad, DataProcessorCallback callback) throws Throwable {

		InputStream is = IOUtils.getResourceAsStream("/sample/" + requestPayLoad.get("exec") + ".xls");

		HSSFWorkbook wb = new HSSFWorkbook(is);
		HSSFSheet sheet = wb.getSheetAt(0);

		Map responseData = new HashMap();

		List columnNames = extractColumnNames(sheet.getRow(0));
		responseData.put("header", columnNames);

		List data = new ArrayList();

		for (int i = sheet.getFirstRowNum() + 1; i <= sheet.getLastRowNum(); i++) {
			List columnValues = extractColumnValues(sheet.getRow(i));
			data.add(columnValues);
		}
		responseData.put("data", data);

		return responseData;
	}

	@Override
	public Object processResponse(Object responseData, Map requestPayLoad, Map responsePayLoad, DataProcessorCallback callback) throws Throwable {
		return responseData;
	}

	private static interface CellVisitor {
		void visitCell(HSSFCell cell);
	}

	public static List extractColumnNames(HSSFRow row) {

		final List columnNames = new ArrayList();

		visitCells(row, new CellVisitor() {
			@Override
			public void visitCell(HSSFCell cell) {
				String columnName = cell.getStringCellValue().trim().replace(' ', '_').replace('.', '_');
				columnNames.add(columnName);
			}
		});

		return columnNames;
	}

	public static List extractColumnValues(HSSFRow row) {

		final List columnValues = new ArrayList();

		visitCells(row, new CellVisitor() {
			@Override
			public void visitCell(HSSFCell cell) {

				switch (cell.getCellType()) {
				case HSSFCell.CELL_TYPE_BOOLEAN:
					columnValues.add(cell.getBooleanCellValue());
					break;
				case HSSFCell.CELL_TYPE_NUMERIC:
					columnValues.add(cell.getNumericCellValue());
					break;
				case HSSFCell.CELL_TYPE_STRING:
					columnValues.add(cell.getStringCellValue());
					break;
				default:
					columnValues.add("Unknown Type:" + cell.getCellType());
					break;
				}
			}
		});

		return columnValues;
	}

	private static void visitCells(HSSFRow row, CellVisitor cellVisitor) {
		int i = 0;
		for (HSSFCell cell = row.getCell(i); cell != null; cell = row.getCell(++i)) {
			cellVisitor.visitCell(cell);
		}
	}
}