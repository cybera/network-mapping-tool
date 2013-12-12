package ca.cybera.netmap.controller;

import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import ca.cybera.netmap.assembler.OrganizationAssembler;
import ca.cybera.netmap.dto.OrganizationDTO;
import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationType;
import ca.cybera.netmap.service.OrganizationService;

@Controller
@RequestMapping("/organization")
public class OrganizationController extends BaseController {

	@Inject private OrganizationAssembler assembler;
	
	@Inject private OrganizationService service;

	private Logger log = LoggerFactory.getLogger(getClass());

	
	@RequestMapping(value = "", method = RequestMethod.POST)
	public @ResponseBody
	OrganizationDTO post(@RequestBody OrganizationDTO organization) throws Exception {
		Organization o = assembler.assemble(organization);

		log.debug("incoming: "+o);
		Organization ret = service.save(o);
		log.debug("outgoing: "+ret);
		
		return assembler.getDTO(ret);

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.DELETE)
	public @ResponseBody
	void delete(@PathVariable("uuid") String uuid) throws Exception {

		service.delete(uuid);

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.GET)
	public @ResponseBody
	Organization get(@PathVariable("uuid") String uuid) throws Exception {

		return service.get(uuid);

	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public @ResponseBody
	List<OrganizationDTO> getAll() throws Exception {

		return assembler.getDTO(service.get());

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
