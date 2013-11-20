package ca.cybera.netmap.controller;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationType;
import ca.cybera.netmap.service.OrganizationService;

@Controller
@RequestMapping("/organization")
public class OrganizationController {

	@Inject private OrganizationService service;

	@RequestMapping(value = "", method = RequestMethod.POST)
	public @ResponseBody
	Organization post(@RequestBody Organization organization) throws Exception {

		return service.save(organization);

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.DELETE)
	public @ResponseBody
	void delete(@PathVariable("uuid") String uuid) throws Exception {

		service.delete(service.get(uuid));

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.GET)
	public @ResponseBody
	Organization get(@PathVariable("uuid") String uuid) throws Exception {

		return service.get(uuid);

	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public @ResponseBody
	List<Organization> getAll() throws Exception {

		return service.get();

	}

	@RequestMapping(value = "s", method = RequestMethod.GET)
	public @ResponseBody
	List<Organization> getAll(@RequestParam("type") String type) throws Exception {

		return service.get(service.getType(type));

	}

	@RequestMapping(value = "/type", method = RequestMethod.POST)
	public @ResponseBody
	OrganizationType post(@RequestBody OrganizationType type) throws Exception {

		return service.save(type);

	}

	@RequestMapping(value = "/types", method = RequestMethod.GET)
	public @ResponseBody
	List<OrganizationType> getAllTypes() throws Exception {

		return service.getTypes();

	}
}
