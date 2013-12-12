package ca.cybera.netmap.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

	public class BaseController {


		@ExceptionHandler(Exception.class)
		@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
		public @ResponseBody Error handleAllExceptions(Exception ex) {
			ex.printStackTrace();
			return new Error(ex.getMessage());
		}
	}

