package ca.cybera.netmap.controller;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.service.OrganizationService;

@Controller
@RequestMapping("/organization")
public class OrganizationController {

	@Inject
	OrganizationService service;

	@RequestMapping(value = "", method = RequestMethod.POST)
	public @ResponseBody
	Organization post(@RequestBody Organization organization) throws Exception {
		return service.save(organization);
	}
}
