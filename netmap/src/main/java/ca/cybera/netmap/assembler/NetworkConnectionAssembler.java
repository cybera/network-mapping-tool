package ca.cybera.netmap.assembler;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.springframework.stereotype.Component;

import ca.cybera.netmap.dto.NetworkConnectionDTO;
import ca.cybera.netmap.model.NetworkConnection;
import ca.cybera.netmap.service.OrganizationService;

@Component
public class NetworkConnectionAssembler {

	@Inject private GeometryAssembler geomAssembler;
	@Inject private OrganizationService orgService;
	
	public NetworkConnection assemble(NetworkConnectionDTO dto) throws Exception {
		
		NetworkConnection nc = new NetworkConnection();
		
		nc.setUUID(dto.getUUID());
		nc.setConnectionSpeed(dto.getConnectionSpeed());
		nc.setEnd(orgService.get(dto.getOrgEndUUID()));
		nc.setGeom(geomAssembler.assemble(dto.getGeom()));
		nc.setNetwork(dto.getNetwork());
		nc.setStart(orgService.get(dto.getOrgStartUUID()));
		nc.setWebsites(dto.getWebsites());
		
		return nc;
		
	}
	
	public NetworkConnectionDTO getDTO(NetworkConnection nc) throws Exception {
		
		NetworkConnectionDTO dto = new NetworkConnectionDTO();
		
		dto.setUUID(nc.getUUID());
		dto.setConnectionSpeed(nc.getConnectionSpeed());
		dto.setGeom(geomAssembler.getDTO(nc.getGeom()));
		dto.setNetwork(nc.getNetwork());
		dto.setOrgEndUUID(nc.getEnd().getUUID());
		dto.setOrgStartUUID(nc.getStart().getUUID());
		dto.setWebsites(nc.getWebsites());
		
		return dto;
		
	}
	
	public List<NetworkConnectionDTO> getDTO(List<NetworkConnection> list) throws Exception {
		
		List<NetworkConnectionDTO> ret = new ArrayList<NetworkConnectionDTO>();
		for (NetworkConnection nc : list) ret.add(getDTO(nc));
		return ret;
		
	}
}
