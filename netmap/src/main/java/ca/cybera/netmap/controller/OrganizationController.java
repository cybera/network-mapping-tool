package ca.cybera.netmap.controller;

import java.io.BufferedInputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import ca.cybera.netmap.assembler.OrganizationAssembler;
import ca.cybera.netmap.dto.OrganizationDTO;
import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationDisplay;
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
		try {
			service.delete(uuid);
		} catch(DataIntegrityViolationException e) {
			throw new Exception("You must remove all network connections that depend on this organization before it can be removed.");
		}
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

	
	@RequestMapping(value = "/loadKML", method = {RequestMethod.POST})
	public @ResponseBody
	void load(@RequestParam("kmlFile") MultipartFile kmlFile) throws Exception {
		service.importKML(new BufferedInputStream(kmlFile.getInputStream()));
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
	
	@RequestMapping(value = "/type/{uuid}", method = RequestMethod.DELETE)
	public @ResponseBody
	void deleteType(@PathVariable("uuid") String uuid) throws Exception {
		service.deleteType(uuid);

	}


	@RequestMapping(value = "/types", method = RequestMethod.GET)
	public @ResponseBody
	List<OrganizationType> getAllTypes() throws Exception {

		return service.getTypes();

	}
	
	@RequestMapping(value = "/displayDetails", method = RequestMethod.GET)
	public @ResponseBody
	List<OrganizationDisplay> getOrgDisplay() throws Exception {
		return service.getOrgDisplay();

	}
	
	@RequestMapping(value = "/displayDetails", method = RequestMethod.POST)
	public @ResponseBody
	void saveOrgDisplay(@RequestBody OrganizationDisplay[] orgDisplays) throws Exception {
		List<OrganizationDisplay> list = new ArrayList<>();
		list.addAll(Arrays.asList(orgDisplays));
		
		service.saveOrgDisplay(list);
	}
}
