package rnd.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
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

		if (is == null) {
			File file = new File(fileName);
			if (file.exists()) {
				is = new FileInputStream(file);
			}
		}

		if (is == null) {
			throw new FileNotFoundException(fileName);
		}

		return is;
	}

	public static String readContent(String fileName) throws IOException {
		return readContent(fileName, true);
	}

	public static String readContent(String fileName, boolean appendNewLine) throws IOException {
		return readContent(getResourceAsStream(fileName), true, appendNewLine);
	}

	public static String readContent(InputStream is) throws IOException {
		return readContent(is, false);
	}

	public static String readContent(InputStream is, boolean closeStream) throws IOException {
		return readContent(is, closeStream, false);
	}

	public static String readContent(InputStream is, boolean closeStream, boolean appendNewLine) throws IOException {
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

}
