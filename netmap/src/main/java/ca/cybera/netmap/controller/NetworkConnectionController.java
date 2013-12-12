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

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.NetworkConnection;
import ca.cybera.netmap.service.NetworkConnectionService;

@Controller
@RequestMapping("/networkConnection")
public class NetworkConnectionController extends BaseController {

	@Inject
	private NetworkConnectionService service;

	@RequestMapping(value = "", method = RequestMethod.POST)
	public @ResponseBody
	NetworkConnection post(@RequestBody NetworkConnection networkConnection) throws Exception {

		return service.save(networkConnection);

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.DELETE)
	public @ResponseBody
	void delete(@PathVariable("uuid") String uuid) throws Exception {

		service.delete(service.get(uuid));

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.GET)
	public @ResponseBody
	NetworkConnection get(@PathVariable("uuid") String uuid) throws Exception {

		return service.get(uuid);

	}

	@RequestMapping(value = "s", method = RequestMethod.GET)
	public @ResponseBody
	List<NetworkConnection> getAll() throws Exception {

		return service.get();

	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public @ResponseBody
	List<NetworkConnection> getAll(@RequestParam("network") String network) throws Exception {

		return service.get(service.getNetwork(network));

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
