package ca.cybera.netmap.controller;

import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import ca.cybera.netmap.dto.NetworkConnectionDTO;
import ca.cybera.netmap.model.MapStyle;
import ca.cybera.netmap.service.MapStyleService;

@Controller
@RequestMapping("/mapStyles")
public class MapStyleController extends BaseController {

	@Inject private MapStyleService service;
	@RequestMapping(value = "", method = RequestMethod.POST)
	public @ResponseBody
	MapStyle post(@RequestBody MapStyle mapStyle) throws Exception {
		return service.save(mapStyle);
	}

	@RequestMapping(value = "", method = RequestMethod.GET)
	public @ResponseBody
	List<MapStyle> getAll() throws Exception {
		return service.get();

	}

	@RequestMapping(value = "/{uuid}", method = RequestMethod.DELETE)
	public @ResponseBody
	void delete(@PathVariable("uuid") String uuid) throws Exception {
		service.delete(uuid);
	}

}
