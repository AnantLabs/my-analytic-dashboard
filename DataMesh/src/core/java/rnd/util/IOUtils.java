package rnd.util;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class IOUtils {

	public static InputStream getResourceAsStream(String fileName) throws FileNotFoundException {

		InputStream is = IOUtils.class.getResourceAsStream(fileName);

		if (is == null) {
			is = IOUtils.class.getClassLoader().getResourceAsStream(fileName);
		}

		if (is == null) {
			is = Thread.currentThread().getContextClassLoader().getResourceAsStream(fileName);
		}

		return is;
	}

	public static String readPlainContent(String fileName) throws IOException {
		return readPlainContent(fileName, true);
	}

	public static String readPlainContent(String fileName, boolean appendNewLine) throws IOException {
		return readPlainContent(getResourceAsStream(fileName), true, appendNewLine);
	}

	public static String readPlainContent(InputStream is) throws IOException {
		return readPlainContent(is, false);
	}

	public static String readPlainContent(InputStream is, boolean closeStream) throws IOException {
		return readPlainContent(is, closeStream, false);
	}

	public static String readPlainContent(InputStream is, boolean closeStream, boolean appendNewLine) throws IOException {
		StringBuilder content = new StringBuilder();
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String line = null;
		while ((line = br.readLine()) != null) {
			content.append(line);
			if (appendNewLine) {
				content.append("\n");
			}
		}
		if (closeStream) {
			is.close();
		}
		return content.toString();
	}

	// public static FileInputStream getFileInputStream(String fileName) throws FileNotFoundException {
	// // Check file eagerly
	// File file = new File(fileName);
	// if (file.exists()) {
	// return new FileInputStream(file);
	// } else {
	// throw new FileNotFoundException(fileName);
	// }
	// }
}
