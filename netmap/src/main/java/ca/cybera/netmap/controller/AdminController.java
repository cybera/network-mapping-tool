package ca.cybera.netmap.controller;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import ca.cybera.netmap.service.AdminService;

@Controller
@RequestMapping("/admin")
public class AdminController extends BaseController {

	
	@Inject private AdminService adminService;

	@RequestMapping(value = "/login", method = { RequestMethod.POST })
	public @ResponseBody
	Boolean login(@RequestParam("password") String password) throws Exception {

		adminService.login(password);
		return true;
		
	}

}
