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

import ca.cybera.netmap.assembler.NetworkConnectionAssembler;
import ca.cybera.netmap.dto.NetworkConnectionDTO;
import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.service.NetworkConnectionService;

@Controller
@RequestMapping("/networkConnection")
public class NetworkConnectionController extends BaseController {

	@Inject private NetworkConnectionService service;
	@Inject private NetworkConnectionAssembler assembler;

	@RequestMapping(value = "", method = RequestMethod.POST)
	public @ResponseBody
	NetworkConnectionDTO post(@RequestBody NetworkConnectionDTO networkConnection) throws Exception {

		return assembler.getDTO(service.save(assembler.assemble(networkConnection)));

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.DELETE)
	public @ResponseBody
	void delete(@PathVariable("uuid") String uuid) throws Exception {

		service.delete(uuid);

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.GET)
	public @ResponseBody
	NetworkConnectionDTO get(@PathVariable("uuid") String uuid) throws Exception {

		return assembler.getDTO(service.get(uuid));

	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public @ResponseBody
	List<NetworkConnectionDTO> getAll() throws Exception {

		return assembler.getDTO(service.get());

	}

	@RequestMapping(value = "/network", method = RequestMethod.GET)
	public @ResponseBody
	List<NetworkConnectionDTO> getAllByNetwork(@RequestParam("network") String network) throws Exception {

		return assembler.getDTO(service.get(service.getNetwork(network)));

	}

	@RequestMapping(value = "/network", method = RequestMethod.POST)
	public @ResponseBody
	Network post(@RequestBody Network network) throws Exception {

		return service.save(network);

	}
	
	@RequestMapping(value = "/networks", method = RequestMethod.GET)
	public @ResponseBody
	List<Network> getAllNetworks() throws Exception {

		return service.getNetworks();

	}
	
	@RequestMapping(value = "/speed", method = RequestMethod.POST)
	public @ResponseBody
	ConnectionSpeed post(@RequestBody ConnectionSpeed speed) throws Exception {

		return service.save(speed);

	}
	
	@RequestMapping(value = "/speeds", method = RequestMethod.GET)
	public @ResponseBody
	List<ConnectionSpeed> getAllSpeeds() throws Exception {

		return service.getConnectionSpeeds();

	}
}
